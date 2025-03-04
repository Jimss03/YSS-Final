import React, { useState } from 'react';
import { 
  Truck, 
  Edit, 
  X, 
  Save, 
  ShoppingCart, 
  Minus, 
  Plus,
  BanknoteIcon,
  Lock
} from 'lucide-react';

function Checkout() {
  const [address, setAddress] = useState({
    name: 'JUAN DELA CRUZ',
    phone: '0917-123-4567',
    email: 'juan@example.com',
    street: 'Urgello Street',
    city: 'Cebu, Philippines 6000'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(address);
  const [quantity, setQuantity] = useState(1);
  const [product] = useState({
    name: 'Premium T-Shirt',
    price: 400
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setNewAddress({...address});
  };

  const handleSaveClick = () => {
    setAddress(newAddress);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const subtotal = product.price * quantity;
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - 2/3 width on large screens */}
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
              </div>
            </div>

            {/* Order Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center">
                <ShoppingCart className="mr-2 text-gray-600" size={20} /> ORDER DETAILS
              </h2>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-20 w-20 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                      <span className="text-2xl">👕</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-lg font-semibold">₱{product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center border rounded-md">
                    <button 
                      onClick={decrementQuantity} 
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 font-medium">{quantity}</span>
                    <button 
                      onClick={incrementQuantity} 
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center">
                <BanknoteIcon className="mr-2 text-gray-600" size={20} /> PAYMENT METHOD
              </h2>
              <div className="border-t pt-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-md border-2 border-blue-500">
                  <div className="h-5 w-5 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex items-center">
                    <BanknoteIcon className="mr-2 text-green-600" size={18} /> 
                    <span className="font-medium">CASH ON DELIVERY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-4">ORDER SUMMARY</h2>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">RETAIL PRICE:</p>
                  <p>₱{product.price.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-medium">
                  <p>SUBTOTAL ({quantity} ITEM{quantity > 1 ? 'S' : ''}):</p>
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
                <button className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-md mt-4 transition duration-150">
                  Place Order
                </button>
              </div>
            </div>

            {/* Payment Security Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-2 flex items-center">
                <Lock className="mr-2 text-green-600" size={20} /> PAYMENT SECURITY
              </h2>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-700">
                  <span className="text-green-600 font-medium">YOUNG SOUL SEEKERS</span> is committed to protecting your privacy and securing the details and logistics of your orders. When choosing Cash on Delivery (COD), you can be assured that your personal information is not shared with any third-party payment processors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Edit Modal */}
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
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="Full Name" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={newAddress.phone} 
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="Phone Number" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newAddress.email} 
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="Email Address" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <select 
                  value={newAddress.street} 
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option>Urgello Street</option>
                  <option>Mango Avenue</option>
                  <option>Osmena Boulevard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select 
                  value={newAddress.city} 
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} 
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option>Cebu, Philippines 6000</option>
                  <option>Mactan, Philippines 6015</option>
                  <option>Mandaue, Philippines 6014</option>
                </select>
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
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
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