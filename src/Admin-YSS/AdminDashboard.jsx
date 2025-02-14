import React from 'react';

const AdminDashboard = () => {
  const bestSellings = [
    { name: 'YSS HOLY SPIRIT', orders: 7, revenue: 2800, image: 'black-shirt-1.png' },
    { name: 'YSS LIMITLESS', orders: 4, revenue: 1600, image: 'black-shirt-2.png' },
    { name: 'YSS REDEEMED', orders: 3, revenue: 1200, image: 'white-shirt.png' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
            
      {/* Best Selling Section */}
      <h2 className="text-center text-lg font-bold my-6">BEST SELLINGS</h2>
      <div className="space-y-4 max-w-4xl mx-auto">
        {bestSellings.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <p className="font-semibold">{item.name}</p>
            </div>
            <div className="text-right">
              <p>Orders: <span className="font-bold">{item.orders}</span></p>
              <p>Revenue: <span className="font-bold">₱ {item.revenue.toLocaleString()}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
