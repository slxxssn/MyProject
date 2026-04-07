// frontend/src/pages/ProductsPage.js
import React, { useState, useEffect } from 'react';
import Products from '../components/Products';

const ProductsPage = () => {
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    if (userId && userName) {
      setUser({ id: userId, name: userName });
    } else {
      setUser(null);
    }
  }, []);

  // Handle login requirement
  const handleRequireLogin = () => {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-8">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Explore Our Products
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse through our latest and most popular tech items
        </p>
      </div>

      {/* Products Component */}
      <div className="max-w-7xl mx-auto">
        <Products
          requireLogin={!user}
          onRequireLogin={handleRequireLogin}
        />
      </div>

      {/* 🔥 Sliding Login Prompt (Tailwind version) */}
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 
        bg-black text-white px-6 py-3 rounded-full shadow-lg text-sm transition-all duration-300
        ${showLoginPrompt ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
      >
        Please log in to add products to your cart!
      </div>

    </div>
  );
};

export default ProductsPage;