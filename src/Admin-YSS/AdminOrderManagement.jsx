import React, { useState, useEffect } from 'react';
import { 
  Check, X, Clock, Package, TruckIcon, Archive, 
  RefreshCw, Filter, Search, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Mock data - in a real app, you'd fetch this from Firebase or your backend
const initialOrders = [
  {
    id: 'ORD-001',
    customerName: 'Juan Dela Cruz',
    totalAmount: 4500.00,
    items: [
      { name: 'Classic White T-Shirt', quantity: 2, price: 1500 },
      { name: 'Blue Denim Jeans', quantity: 1, price: 1500 }
    ],
    status: 'Pending',
    date: '2024-03-05',
    shippingAddress: '123 Main St, Manila, Philippines'
  },
  {
    id: 'ORD-002',
    customerName: 'Maria Santos',
    totalAmount: 6000.00,
    items: [
      { name: 'Black Leather Jacket', quantity: 1, price: 4500 },
      { name: 'Graphic Print Hoodie', quantity: 1, price: 1500 }
    ],
    status: 'Processing',
    date: '2024-03-04',
    shippingAddress: '456 Quezon Ave, Makati, Philippines'
  }
];

function AdminOrderManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ordersPerPage = 5;

  // Filter and search orders
  useEffect(() => {
    let result = orders;

    if (selectedStatus !== 'All') {
      result = result.filter(order => order.status === selectedStatus);
    }

    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [selectedStatus, searchTerm, orders]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  // Order status color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // View Order Details Modal
  const OrderDetailsModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Order Information</h3>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Total Amount:</strong> ₱{order.totalAmount.toFixed(2)}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p>{order.shippingAddress}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Order Items</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2 text-center">Quantity</th>
                <th className="border p-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-right">₱{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={() => {
              updateOrderStatus(order.id, 'Processing');
              onClose();
            }} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Process Order
          </button>
          <button 
            onClick={() => {
              updateOrderStatus(order.id, 'Cancelled');
              onClose();
            }} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 font-cousine">ORDER MANAGEMENT</h1>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            {['All', 'Pending', 'Processing', 'Shipped', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-md transition duration-150 ${
                  selectedStatus === status 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex items-center border rounded-md px-2">
            <Search size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 outline-none"
            />
          </div>
        </div>
        
        {/* Order List */}
        <div className="bg-white rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4">₱{order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Archive size={20} />
                    </button>
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Processing')}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Check size={20} />
                      </button>
                    )}
                    {order.status !== 'Cancelled' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {filteredOrders.length > ordersPerPage && (
            <div className="flex justify-between items-center p-4">
              <div>
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="disabled:opacity-50 hover:bg-gray-100 p-2 rounded"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={indexOfLastOrder >= filteredOrders.length}
                  className="disabled:opacity-50 hover:bg-gray-100 p-2 rounded"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}

export default AdminOrderManagement;