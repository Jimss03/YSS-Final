import { Outlet, NavLink, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Footer from './FooterLayout';
import { useCart } from '../Layout/CartContext'; // Import the custom CartContext hook
import CloseIcon from '../assets/Shop-Images/Multiply.png'; 
import { ShoppingCart, User } from "lucide-react";

function NavBar() {
  const location = useLocation(); // Hook to track the current location
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();  // Access cartItems and functions
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check if the current location is either /about, /contact, or /FAQ
  const isAboutActive = location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/FAQ';

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    updateCartItemQuantity(itemId, quantity);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-20">
        <nav className="container mx-auto flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" className="flex items-center">
              <img
                src="src/assets/YSS LOGO PNG 2.png"
                alt="Logo"
                className="h-12 w-auto"
              />
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isActive ? 'text-gray-700 border-b-2 border-gray-700' : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`
              }
            >
              HOME
            </NavLink>

            <NavLink
              to="/Shop"
              className={({ isActive }) =>
                `nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isActive ? 'text-gray-700 border-b-2 border-gray-700' : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`
              }
            >
              SHOP
            </NavLink>

            {/* About Us with Dropdown */}
            <div className="relative group">
              <NavLink
                to="/about"
                className={`nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isAboutActive ? 'text-gray-700 border-b-2 border-gray-700' : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`}
              >
                ABOUT US
              </NavLink>

              {/* Dropdown Menu */}
              <ul className="absolute left-0 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto font-cousine bg-[#FAFAFA]">
                <li>
                  <NavLink
                    to="/contact"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/FAQ"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    FAQ
                  </NavLink>
                </li>
              </ul>
            </div>

            <NavLink
              to="/lookbook"
              className={({ isActive }) =>
                `nav-link flex items-center justify-center h-16 px-4 font-cousine font-bold text-center transition-all ease-in-out duration-300 ${
                  isActive ? 'text-gray-700 border-b-2 border-gray-700' : 'hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700'
                }`
              }
            >
              LOOKBOOK
            </NavLink>
          </div>

          <div className="flex items-center">
      {/* Cart Icon with Hover Effect */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex items-center justify-center h-16 px-4 relative transition-all ease-in-out duration-300 hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700"
      >
        <ShoppingCart size={24} className="text-black" />
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Account Icon with Hover Effect */}
      <NavLink
        to="/UserSignIn"
        className="flex items-center justify-center h-16 px-4 relative transition-all ease-in-out duration-300 hover:text-gray-500 border-b-2 border-transparent hover:border-gray-700"
      >
        <User size={24} className="text-black" />
      </NavLink>
    </div>
        </nav>
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-[400px] bg-white h-full shadow-lg p-6 flex flex-col relative">
            <button onClick={() => setIsCartOpen(false)} className="absolute top-4 right-4">
              <img src={CloseIcon} alt="Close" className="w-8 h-8 cursor-pointer" />
            </button>
            <h2 className="text-xl font-bold tracking-wider mb-6 font-cousine">Your Cart</h2>
            <hr className="mb-4" />
            
            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <p className="text-gray-600 text-center">Your cart is empty.</p>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-6">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1 px-4">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-500">₱{item.price}</p>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                    </div>
                    <div className="flex items-center border rounded-md px-2">
                      <button
                        className="text-lg text-gray-700 px-2"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold px-2">{item.quantity}</span>
                      <button
                        className="text-lg text-gray-700 px-2"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-red-500 p-3">Remove</button>
                  </div>
                ))}
              </div>
            )}
            
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>ESTIMATED TOTAL:</span>
              <span>₱{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} PHP</span>
            </div>

            {/* Checkout Button */}
            {cartItems.length > 0 && (
              <button className="bg-black text-white text-center w-full py-3 mt-6 uppercase tracking-wide font-bold text-sm">
                CHECK OUT
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pt-50">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}

export default NavBar;
