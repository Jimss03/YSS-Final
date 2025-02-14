
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAylHJpHDOhK_5uUK4J73tifBauOZwILQc",
  authDomain: "yss-final.firebaseapp.com",
  projectId: "yss-final",
  storageBucket: "yss-final.appspot.com",
  messagingSenderId: "111711921902",
  appId: "1:111711921902:web:e7b23f006ea8bfff6635ff",
  measurementId: "G-G6ZGZV101S"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Firebase Services
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore Database

// ✅ Firestore Collections
export const lookbookCollection = collection(db, "lookbook"); // Lookbook Firestore Collection
export const shopCollection = collection(db, "shop"); // Shop Firestore Collection

// ✅ Cloudinary Configuration (for reference)
export const CLOUDINARY_CLOUD_NAME = "dm97yk6vr"; // Replace with your Cloud Name
export const CLOUDINARY_UPLOAD_PRESET = "product_shop"; // Replace with your Upload Preset
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default app;
