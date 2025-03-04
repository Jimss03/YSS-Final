import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToCart, getCartItems, removeCartItem, onCartUpdate } from '../Database/Firebase'; // Import Firebase functions
import { db } from '../Database/Firebase'; // Import Firestore instance from your config
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userUID, setUserUID] = useState(null);  // State for userUID
  const [userInfo, setUserInfo] = useState(null);  // Store user information

  // Fetch the cart items when the user logs in or userUID changes
  useEffect(() => {
    if (userUID) {
      const fetchCartFromFirestore = async () => {
        try {
          const items = await getCartItems(userUID);
          setCartItems(items);  // Set cart items to state
        } catch (error) {
          console.error("Error fetching cart items:", error);
          setCartItems([]);  // Fallback to empty array on error
        }
      };

      fetchCartFromFirestore();
    }
  }, [userUID]);  // Run when userUID changes

  // Fetch user data based on userUID
  useEffect(() => {
    if (userUID) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", userUID);  // Get reference to user
        const userSnap = await getDoc(userRef);  // Fetch user data
        if (userSnap.exists()) {
          setUserInfo(userSnap.data());  // Store user info in state
        }
      };

      fetchUserData();
    }
  }, [userUID]);  // Run when userUID changes

  // Listen for real-time cart updates from Firestore
  useEffect(() => {
    if (userUID) {
      const unsubscribe = onCartUpdate(userUID, setCartItems);  // Real-time cart updates
      return () => unsubscribe();  // Cleanup listener on unmount or UID change
    }
  }, [userUID]);

  // Add to cart function
  const addToCartHandler = (item) => {
    if (userUID) {
      addToCart(userUID, item);  // Add item to Firestore
      setCartItems((prevItems) => [...prevItems, item]);  // Update local state
    } else {
      console.error("User UID is not available.");
    }
  };

  // Remove from cart function
  const removeFromCartHandler = (itemId) => {
    if (userUID) {
      // Call the Firestore function to remove the item from Firestore
      removeCartItem(userUID, itemId);
      // Update the cart state by removing the item from the state
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } else {
      console.error("User UID is not available.");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, userInfo, setUserUID, addToCart: addToCartHandler, removeFromCart: removeFromCartHandler }}>
      {children}
    </CartContext.Provider>
  );
};
