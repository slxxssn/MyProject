// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import BackForwardButtons from './components/BackForwardButtons';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import GoogleSuccessPage from './pages/GoogleSuccessPage';

import OTPVerificationPage from './pages/OtpVerificationPage';
import SetPasswordPage from './pages/SetPasswordPage';

const Layout = ({ children }) => {
  const location = useLocation();
  const [resetKey, setResetKey] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const noGlobalSearchPages = ['/', '/login', '/register', '/profile'];
  const showGlobalSearch = !noGlobalSearchPages.includes(location.pathname);

  const resetHistory = () => setResetKey(prev => prev + 1);

  return (
    <>
      <Header
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        resetHistory={resetHistory}
      />

      <BackForwardButtons
        key={resetKey}
        onLogoutRequest={() => setShowLogoutModal(true)}
        resetHistory={resetHistory}
      />

      {showGlobalSearch && <SearchBar />}
      {children}
      <Footer />
    </>
  );
};

function App() {
  // ---------- Shared cart state ----------
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (productId) => {
    if (!cartItems.includes(productId)) {
      setCartItems([...cartItems, productId]);
    }
  };
  // ---------------------------------------

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage onAddToCart={handleAddToCart} addedItems={cartItems} />} />

          {/* Registration flow */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/register/create-pass" element={<SetPasswordPage />} />

          <Route path="/login" element={<LoginPage />} />

          {/* Products list pages */}
          <Route path="/products" element={<ProductsPage onAddToCart={handleAddToCart} addedItems={cartItems} />} />

          {/* Product details page */}
          <Route path="/products/:id" element={
            <ProductDetailsPage onAddToCart={handleAddToCart} addedItems={cartItems} />
          } />

          <Route path="/cart" element={<CartPage cartItems={cartItems} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />

          {/* Google login */}
          <Route path="/google-success" element={<GoogleSuccessPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;