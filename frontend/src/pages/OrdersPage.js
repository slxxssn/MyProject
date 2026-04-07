// frontend/src/pages/OrdersPage.js
import React from 'react';
import Orders from '../components/Orders';

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Orders
      </h1>

      {/* Orders Content */}
      <div className="max-w-7xl mx-auto">
        <Orders />
      </div>
    </div>
  );
};

export default OrdersPage;