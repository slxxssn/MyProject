// frontend/src/components/Cart.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api';
import { FaMobileAlt, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'info' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInput, setPaymentInput] = useState({
    phone: '',       // for M-Pesa
    cardNumber: '',  // 16-digit card
    cardName: '',    // cardholder name
    expiry: '',      // MM/YY
    cvv: '',         // 3 digits
  });
  const [paymentError, setPaymentError] = useState('');

  const userId = localStorage.getItem('userId');

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.log(err);
      showPopup('Failed to load cart', 'error');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId, fetchCart]);

  // Show popup helper
  const showPopup = (message, type = 'info') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: 'info' });
    }, 2500);
  };

  // Remove item
  const handleRemoveClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${selectedId}`);
      setShowConfirm(false);
      fetchCart();
      showPopup('Item removed', 'success');
    } catch (err) {
      console.log(err);
      showPopup('Error removing item', 'error');
    }
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  // Place order function
  const placeOrder = async (paymentValue = null) => {
    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        user_id: userId,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        payment_method: paymentMethod,
        payment_value: paymentValue
      });

      await axios.delete(`${BASE_URL}/api/cart/clear/${userId}`);
      fetchCart();
      setShowPaymentModal(false);

      if (paymentMethod === 'mpesa') {
        showPopup(`STK Push simulated for ${paymentValue.phone} KES ${total}`, 'success');
      } else if (paymentMethod === 'card') {
        showPopup('Card Payment Successful!', 'success');
      } else if (paymentMethod === 'cod') {
        showPopup('Order Placed Successfully!', 'success');
      }

    } catch (err) {
      console.log(err);
      showPopup('Checkout failed', 'error');
    }
  };

  // Checkout click handler
  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;

    if (paymentMethod === 'cod') {
      placeOrder(); // Cash: immediate
    } else {
      setPaymentInput({ phone:'', cardNumber:'', cardName:'', expiry:'', cvv:'' });
      setPaymentError('');
      setShowPaymentModal(true); // M-Pesa or Card: open modal
    }
  };

  // M-Pesa confirm (no backend call, just simulate success)
  const handleMpesaConfirm = async () => {
    // Validate local format
    if (!paymentInput.phone.match(/^07\d{8}$/)) {
      setPaymentError('Enter a valid Kenyan phone number (07XXXXXXXX)');
      return;
    }

    if (total <= 0) {
      setPaymentError('Cart total must be greater than 0');
      return;
    }

    setPaymentError('');

    // Simulate STK Push success
    showPopup(`STK Push simulated to ${paymentInput.phone}`, 'success');
    await placeOrder({ phone: paymentInput.phone });
  };

  // Card confirm
  const handleCardConfirm = () => {
    const { cardNumber, cardName, expiry, cvv } = paymentInput;
    if (!cardName.trim()) { setPaymentError('Enter cardholder name'); return; }
    if (!cardNumber.match(/^\d{16}$/)) { setPaymentError('Enter a valid 16-digit card number'); return; }
    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) { setPaymentError('Enter expiry in MM/YY'); return; }
    if (!cvv.match(/^\d{3}$/)) { setPaymentError('Enter a valid 3-digit CVV'); return; }

    setPaymentError('');
    showPopup('Card Payment Successful!', 'success');

    placeOrder({ cardNumber, cardName, expiry, cvv });
  };

  return (
    <div className="space-y-6 relative min-h-screen">
      {/* Cart Empty Message */}
      {cartItems.length === 0 && (
        <div className="flex items-center justify-center min-h-[50vh] text-center">
          <p className="text-gray-500 text-xl md:text-2xl font-semibold">Cart is empty</p>
        </div>
      )}

      {/* Cart Items */}
      {cartItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between transition hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
                <div className="w-full h-48 bg-gray-100 rounded-md mb-3 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition hover:scale-105" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-gray-800 font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.description || ''}</p>
                  <p className="text-primary font-bold text-md">${item.price}</p>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  <p className="text-gray-800 font-semibold">Total: ${item.price * item.quantity}</p>
                </div>
                <button onClick={() => handleRemoveClick(item.id)} className="mt-3 w-full py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">Remove</button>
              </div>
            ))}
          </div>

          {/* Payment & Checkout Section */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl shadow-md space-y-4 md:space-y-0">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800 mb-2">Grand Total: ${total}</p>

              {/* Payment Options */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* M-Pesa */}
                <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:border-green-500 transition ${paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="mpesa" className="hidden" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} />
                  <FaMobileAlt className="text-green-600 text-2xl"/>
                  <div>
                    <p className="font-semibold text-gray-800">M-Pesa</p>
                    <p className="text-gray-500 text-sm">Simulated STK Push</p>
                  </div>
                </label>

                {/* Card */}
                <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:border-blue-500 transition ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="card" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <FaCreditCard className="text-blue-600 text-2xl"/>
                  <div>
                    <p className="font-semibold text-gray-800">Card Payment</p>
                    <p className="text-gray-500 text-sm">Visa, Mastercard, etc.</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:border-yellow-500 transition ${paymentMethod === 'cod' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="cod" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <FaMoneyBillWave className="text-yellow-600 text-2xl"/>
                  <div>
                    <p className="font-semibold text-gray-800">Cash on Delivery</p>
                    <p className="text-gray-500 text-sm">Pay when delivery arrives</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Checkout Button */}
            <button onClick={handleCheckoutClick} className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200">
              Checkout
            </button>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              {paymentMethod === 'mpesa' ? 'M-Pesa Payment' : 'Card Payment'}
            </h2>

            {paymentError && (
              <div className="mb-2 text-sm text-red-600 bg-red-100 p-2 rounded">{paymentError}</div>
            )}

            {paymentMethod === 'mpesa' ? (
              <input
                type="text"
                placeholder="07XXXXXXXX"
                className="w-full border p-2 rounded mb-4 text-center"
                value={paymentInput.phone}
                onChange={(e) => setPaymentInput(prev => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <div className="space-y-2 text-left">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full border p-2 rounded"
                  value={paymentInput.cardName}
                  onChange={(e) => setPaymentInput(prev => ({ ...prev, cardName: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border p-2 rounded"
                  value={paymentInput.cardNumber}
                  onChange={(e) => setPaymentInput(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-1/2 border p-2 rounded"
                    value={paymentInput.expiry}
                    onChange={(e) => setPaymentInput(prev => ({ ...prev, expiry: e.target.value }))}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-1/2 border p-2 rounded"
                    value={paymentInput.cvv}
                    onChange={(e) => setPaymentInput(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <button
              onClick={paymentMethod === 'mpesa' ? handleMpesaConfirm : handleCardConfirm}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
            >
              Pay Now
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <p className="font-medium text-gray-800 mb-4">Are you sure you want to remove this item?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmRemove} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Yes</button>
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Popup */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`flex items-center gap-2 p-4 rounded-lg shadow-lg pointer-events-auto
            ${popup.type === 'success' ? 'bg-green-600 text-white' : popup.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
            {popup.type === 'success' && <FaCheckCircle />}
            {popup.type === 'error' && <FaExclamationCircle />}
            <span>{popup.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;