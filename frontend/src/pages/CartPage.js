// frontend/src/pages/CartPage.js
import React from 'react';
import Cart from '../components/Cart';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
        My Cart
      </h1>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto">
        <Cart />
      </div>
    </div>
  );
};

export default CartPage;