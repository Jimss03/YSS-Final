import React, { useState, useEffect } from 'react';
import { Truck, Edit, X, Save, ShoppingCart, Minus, Plus, BanknoteIcon, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { updateUserAddress, getUserAddress } from '../Database/Firebase'; // Assuming you have an updateUserAddress function in Firebase

function Checkout() {
  const location = useLocation();
  const { cartItems, userUID } = location.state || { cartItems: [], userUID: '' };  // Get cart items and userUID from Navbar
  
  // Get today's date in the correct format (yyyy-mm-dd)
  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    deliveryDate: getTodayDate(), // Initialize with today's date by default
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(address);
  const [cartItemsState, setCartItems] = useState(cartItems); // Add state for cart items
  useEffect(() => {
    // Fetch user address when the component mounts
    const fetchUserAddress = async () => {
      if (userUID) {
        try {
          const userAddress = await getUserAddress(userUID);
          // If no delivery date is set in the user's address, set it to today
          const addressWithDefaultDate = {
            ...userAddress,
            deliveryDate: userAddress.deliveryDate || getTodayDate()
          };
          setAddress(addressWithDefaultDate);
          setNewAddress(addressWithDefaultDate);
        } catch (error) {
          console.error('Error fetching user address:', error);
          // If there's an error, still make sure we have a default date
          setAddress(prev => ({...prev, deliveryDate: getTodayDate()}));
          setNewAddress(prev => ({...prev, deliveryDate: getTodayDate()}));
        }
      }
    };
    fetchUserAddress();
  }, [userUID]);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewAddress({ ...address });
  };

  const handleSaveClick = async () => {
    try {
      // Make sure deliveryDate is never empty, use today's date as fallback
      const updatedAddress = {
        ...newAddress,
        deliveryDate: newAddress.deliveryDate || getTodayDate()
      };
      await updateUserAddress(userUID, updatedAddress); // Update user address in Firestore
      setAddress(updatedAddress); // Update address state
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user address:', error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const incrementQuantity = (itemId) => {
    const updatedCart = cartItemsState.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const decrementQuantity = (itemId) => {
    const updatedCart = cartItemsState.map(item =>
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
  };

  const subtotal = cartItemsState.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // Handle checkout process (e.g., save order, process payment)
    console.log("Checkout successfully placed!");
  };

  // Format date as "Month day, year" (e.g., February 20, 2025)
  const formatDeliveryDate = (date) => {
    if (!date) return 'Not specified';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 mt-10">
      <div className="container mx-auto px-4 max-w-6xl mt-8">
        <h1 className="text-2xl font-bold mb-4 font-cousine">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg flex items-center">
                  <Truck className="mr-2 text-gray-600" size={20} /> SHIPPING ADDRESS
                </h2>
                <button 
                  onClick={handleEditClick}
                  className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition duration-150"
                >
                  <Edit className="mr-1" size={16} /> EDIT
                </button>
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold text-lg">{address.name}</p>
                <p className="text-gray-700">{address.phone}</p>
                <p className="text-gray-700">{address.email}</p>
                <p className="text-gray-700">{address.street}</p>
                <p className="text-gray-700">{address.city}</p>
                {/* Always display the delivery date - it will always have at least today's date */}
                <p className="text-gray-700">Delivery Date: {formatDeliveryDate(address.deliveryDate)}</p>
              </div>
            </div>

            {/* Order Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center">
                <ShoppingCart className="mr-2 text-gray-600" size={20} /> ORDER DETAILS
              </h2>
              <div className="border-t pt-4">
                {cartItemsState.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-20 w-20 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                        <img 
                          src={item.image || item.imageUrl}
                          alt={item.name}
                          className="object-cover h-full w-full rounded-md"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-lg font-semibold">₱{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => decrementQuantity(item.id)} 
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => incrementQuantity(item.id)} 
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center">
                <BanknoteIcon className="mr-2 text-gray-600" size={20} /> PAYMENT METHOD
              </h2>
              <div className="border-t pt-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-md border-2 border-black">
                  <div className="h-5 w-5 rounded-full bg-black mr-3 flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex items-center">
                    <BanknoteIcon className="mr-2 text-black" size={18} /> 
                    <span className="font-medium">CASH ON DELIVERY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-4">ORDER SUMMARY</h2>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">RETAIL PRICE:</p>
                  <p>₱{cartItemsState.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-medium">
                  <p>SUBTOTAL ({cartItemsState.length} ITEM{cartItemsState.length > 1 ? 'S' : ''}):</p>
                  <p>₱{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">COD FEE:</p>
                  <p className="text-green-600 font-medium">FREE</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">SHIPPING FEE:</p>
                  <p className="text-green-600 font-medium">FREE</p>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <p>ORDER TOTAL:</p>
                    <p>₱{subtotal.toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-md mt-4 transition duration-150"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Editing Address */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">EDIT ADDRESS</h3>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newAddress.name} 
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none" 
                  placeholder="Full Name" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={newAddress.phone} 
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none" 
                  placeholder="Phone Number" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newAddress.email} 
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none" 
                  placeholder="Email Address" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                  type="text" 
                  value={newAddress.street} 
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none" 
                  placeholder="Street Address" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  type="text" 
                  value={newAddress.city} 
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none" 
                  placeholder="City, Country Postal Code" 
                />
              </div>
              
              {/* Date Picker for Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input 
                  type="date" 
                  value={newAddress.deliveryDate || getTodayDate()} 
                  onChange={(e) => setNewAddress({ ...newAddress, deliveryDate: e.target.value })} 
                  min={getTodayDate()} // Setting the minimum date to today
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none" 
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                onClick={handleClose} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveClick} 
                className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition duration-150"
              >
                <Save className="mr-2" size={18} /> Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;