// frontend/src/components/Orders.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/${userId}`);
      if (!res.data || res.data.length === 0) {
        setOrders([]);
        setMessage('You have no orders yet');
      } else {
        setOrders(res.data);
        setMessage('');
      }
    } catch (err) {
      console.log(err);
      setMessage('Failed to load orders');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId, fetchOrders]);

  const handleDeleteClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/orders/${selectedOrderId}`);
      setShowConfirm(false);
      fetchOrders();
    } catch (err) {
      console.log(err);
      alert('Failed to delete order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

      {message && (
        <p className="text-gray-500 text-center">{message}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order, index) => {
          const orderNumber = index + 1;
          const totalOrder = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Order Header */}
              <div className="mb-3 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order #{orderNumber}
                </h3>
                <p>Status: <span className="font-bold">{order.status}</span></p>
                <p>Ordered on: {new Date(order.created_at).toLocaleString()}</p>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-gray-50 p-3 rounded-md shadow-inner"
                  >
                    <p className="font-medium text-gray-700">{item.product_name}</p>
                    <p className="text-gray-500 text-sm">Price: ${item.price}</p>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    <p className="text-gray-500 text-sm font-semibold">
                      Total: ${item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col space-y-2">
                <p className="font-bold text-gray-800">Order Total: ${totalOrder}</p>
                <button
                  onClick={() => handleDeleteClick(order.id)}
                  className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  Delete Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ DELETE CONFIRM POPUP */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg space-y-4">
            <p className="text-gray-800 font-semibold">
              Are you sure you want to delete this order?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;