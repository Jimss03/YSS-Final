import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAylHJpHDOhK_5uUK4J73tifBauOZwILQc",
  authDomain: "yss-final.firebaseapp.com",
  projectId: "yss-final",
  storageBucket: "yss-final.appspot.com",
  messagingSenderId: "111711921902",
  appId: "1:111711921902:web:e7b23f006ea8bfff6635ff",
  measurementId: "G-G6ZGZV101S",
  databaseURL: "https://yss-final-default-rtdb.firebaseio.com/",
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Firebase Services
export const auth = getAuth(app); // Authentication Service
export const db = getFirestore(app); // Firestore Database
export const realtimeDB = getDatabase(app); // Realtime Database

// ✅ Firestore Collections
export const lookbookCollection = collection(db, "lookbook"); // Lookbook Collection
export const shopCollection = collection(db, "shop"); // Shop Collection
export const userCartsCollection = (uid) => collection(db, "userCarts", uid, "cartItems"); // 🛒 User's Cart Collection
export const userRef = (uid) => doc(db, "users", uid); // User data reference

// ✅ Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = "dm97yk6vr"; // Your Cloud Name
export const CLOUDINARY_UPLOAD_PRESET_PRODUCT = "product_shop"; // Upload preset for product images
export const CLOUDINARY_UPLOAD_PRESET_LOOKBOOK = "lookbook_images"; // Upload preset for Lookbook images
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`; // Cloudinary API URL

// ✅ Firestore CRUD Functions with error handling
export const addToCart = async (uid, product) => {
  if (!uid) {
    console.error("No user UID provided");
    return;
  }

  try {
    const cartRef = userCartsCollection(uid);
    if (cartRef) {
      // If product image is uploaded via Cloudinary, use the product's Cloudinary URL
      const imageUrl = product.imageUrl || `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${product.imagePublicId}.jpg`;

      // Add product to user's cart collection
      const productWithImage = {
        ...product,
        imageUrl,
      };
      await addDoc(cartRef, productWithImage); // Add product with image to user's cart collection
      console.log("Product added to cart");
    } else {
      console.error("Cart reference is invalid");
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

export const saveUserToDatabase = async (uid, firstName, lastName, email) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      firstName,
      lastName,
      email,
    });
    console.log("User saved to Firestore");
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
  }
};

// Fetch user address from Firestore
export const getUserAddress = async (uid) => {
  if (!uid) {
    console.error("No user UID provided");
    return {};
  }

  try {
    const userDoc = await getDoc(userRef(uid));
    if (userDoc.exists()) {
      return userDoc.data(); // Return the address data from user document
    } else {
      console.log("No user data found");
      return {};
    }
  } catch (error) {
    console.error("Error fetching user address:", error);
    return {};
  }
};

// Update user address in Firestore
export const updateUserAddress = async (uid, newAddress) => {
  if (!uid) {
    console.error("No user UID provided");
    return;
  }

  try {
    const userDocRef = userRef(uid); // Reference to the user's document
    await updateDoc(userDocRef, {
      address: newAddress, // Update the address field in Firestore
    });
    console.log("User address updated successfully!");
  } catch (error) {
    console.error("Error updating address:", error);
  }
};

export const getCartItems = async (uid) => {
  if (!uid) {
    console.error("No user UID provided");
    return [];
  }

  try {
    const cartRef = userCartsCollection(uid);
    const snapshot = await getDocs(cartRef);

    if (snapshot.empty) {
      console.log("No cart items found");
      return [];
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

export const removeCartItem = async (userUID, itemId) => {
  try {
    const cartItemRef = doc(db, "userCarts", userUID, "cartItems", itemId); // Reference to specific cart item
    await deleteDoc(cartItemRef); // Delete document from Firestore
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

export const onCartUpdate = (uid, callback) => {
  const cartRef = userCartsCollection(uid);
  return onSnapshot(cartRef, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  });
};

// Export default firebase app instance
export default app;
