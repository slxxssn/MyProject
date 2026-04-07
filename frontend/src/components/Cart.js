import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const userId = localStorage.getItem('userId');

  // Fetch Cart
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart/${userId}`);
      setCartItems(res.data);
      setMessage(res.data.length === 0 ? 'Cart is empty' : '');
    } catch (err) {
      console.log(err);
      setMessage('Failed to load cart');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId, fetchCart]);

  const handleRemoveClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${selectedId}`);
      setShowConfirm(false);
      fetchCart();
    } catch (err) {
      console.log(err);
      alert('Error removing item');
    }
  };

  const checkout = async () => {
    if (cartItems.length === 0) return;

    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        user_id: userId,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });

      setCheckoutSuccess(true);
      await axios.delete(`${BASE_URL}/api/cart/clear/${userId}`);
      fetchCart();
      setTimeout(() => setCheckoutSuccess(false), 2000);
    } catch (err) {
      console.log(err);
      alert('Checkout failed');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-6">

      {message && (
        <p className={`text-center font-medium ${cartItems.length === 0 ? 'text-gray-500' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between
                  transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="w-full h-48 bg-gray-100 rounded-md mb-3 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3 className="text-gray-800 font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.description || ''}</p>
                  <p className="text-primary font-bold text-md">${item.price}</p>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  <p className="text-gray-800 font-semibold">Total: ${item.price * item.quantity}</p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveClick(item.id)}
                  className="mt-3 w-full py-2 bg-red-600 text-white rounded-md font-medium text-sm
                    hover:bg-red-700 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Checkout section */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-md">
            <p className="text-lg font-semibold text-gray-800">Grand Total: ${total}</p>
            <button
              onClick={checkout}
              className="mt-3 md:mt-0 px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Checkout
            </button>
          </div>
        </>
      )}

      {/* Popup confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <p className="font-medium text-gray-800 mb-4">Are you sure you want to remove this item?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmRemove} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Yes</button>
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout success */}
      {checkoutSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-xl">&#10004;</span>
          <span>Order Placed Successfully!</span>
        </div>
      )}

    </div>
  );
};

export default Cart;