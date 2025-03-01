import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot 
} from "firebase/firestore";
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
export const realtimeDB = getDatabase(app);

// ✅ Firestore Collections
export const lookbookCollection = collection(db, "lookbook"); // Lookbook Collection
export const shopCollection = collection(db, "shop"); // Shop Collection
export const cartCollection = collection(db, "cart"); // 🛒 Cart Collection

// ✅ Firestore CRUD Functions
export const addToCart = async (product) => {
  try {
    await addDoc(cartCollection, product);
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

export const saveUserToDatabase = async (uid, firstName, lastName, email) => {
  try {
    await set(ref(realtimeDB, "users/" + uid), {
      firstName: firstName,
      lastName: lastName,
      email: email,
    });
  } catch (error) {
    console.error("Error saving user to Realtime Database:", error);
  }
};

export const getCartItems = async () => {
  try {
    const snapshot = await getDocs(cartCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

export const removeCartItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, "cart", itemId));
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

// ✅ Real-time Cart Listener (for live updates)
export const onCartUpdate = (callback) => {
  return onSnapshot(cartCollection, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  });
};

// ✅ Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = "dm97yk6vr"; // Replace with your Cloud Name
export const CLOUDINARY_UPLOAD_PRESET = "product_shop"; // Replace with your Upload Preset
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default app;
