import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
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

// ✅ Firestore CRUD Functions with error handling
export const addToCart = async (uid, product) => {
  if (!uid) {
    console.error("No user UID provided");
    return;
  }

  try {
    const cartRef = userCartsCollection(uid);
    if (cartRef) {
      await addDoc(cartRef, product); // Add product to user's cart collection
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
    const cartItemRef = doc(db, "userCarts", userUID, "cartItems", itemId);  // Reference to specific cart item
    await deleteDoc(cartItemRef);  // Delete document from Firestore
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }

  try {
    const cartRef = doc(db, "userCarts", uid, "cartItems", itemId);
    await deleteDoc(cartRef); // Remove the item from user's cart collection
    console.log("Item removed from cart");
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

// ✅ Real-time Cart Listener (for live updates)
export const onCartUpdate = (uid, callback) => {
  const cartRef = userCartsCollection(uid);
  return onSnapshot(cartRef, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  });
};

// Cloudinary Configuration for both Product and Lookbook
export const CLOUDINARY_CLOUD_NAME = "dm97yk6vr"; // Your Cloud Name
export const CLOUDINARY_UPLOAD_PRESET_PRODUCT = "product_shop"; // Upload preset for product images
export const CLOUDINARY_UPLOAD_PRESET_LOOKBOOK = "lookbook_images"; // Upload preset for Lookbook images
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`; // Cloudinary API URL

// Export default firebase app instance
export default app;
