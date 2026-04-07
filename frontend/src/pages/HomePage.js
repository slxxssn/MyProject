// frontend/src/pages/Homepage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';
import TrendingNow from '../components/TrendingNow';
import SearchBar from '../components/SearchBar';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 md:px-10 py-6 space-y-12">

      {/* 🔥 Announcement Bar */}
      <div className="w-full bg-black text-white text-sm text-center py-2 rounded-md">
        🚀 Free Delivery on orders above KES 5,000 | Pay on Delivery Available
      </div>

      {/* 🔥 Hero Section */}
      <div className="text-center space-y-4 mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold italic tracking-tight bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
          Welcome to Elite Techs
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Your premium destination for phones, laptops, and cutting-edge tech
        </p>
      </div>

      {/* 🔥 Search Bar + WhatsApp */}
      <div className="flex justify-center items-center gap-4 max-w-2xl mx-auto">
        <SearchBar />
        <a
          href="https://wa.me/254700000000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition transform"
        >
          <FaWhatsapp className="text-lg" />
          Chat us on WhatsApp
        </a>
      </div>

      {/* ✅ VIEW ALL PRODUCTS BUTTON */}
      <div className="text-center">
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          View All Products
        </button>
      </div>

      {/* 🔥 Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { icon: 'verified', title: '100% Original', desc: 'Authentic products guaranteed' },
          { icon: 'local_shipping', title: 'Fast Delivery', desc: 'Quick & reliable shipping' },
          { icon: 'payments', title: 'Pay on Delivery', desc: 'Cash on delivery available' },
          { icon: 'shield', title: 'Full Warranty', desc: 'Covered with official warranty' },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
            <span className="material-icons text-3xl text-primary">{item.icon}</span>
            <p className="text-gray-800 font-semibold text-sm">{item.title}</p>
            <p className="text-gray-500 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 🔥 Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { name: 'Phones', path: '/category/phones', icon: 'smartphone' },
            { name: 'Laptops', path: '/category/laptops', icon: 'laptop' },
            { name: 'Accessories', path: '/category/accessories', icon: 'headphones' },
            { name: 'Smart Watches', path: '/category/smartwatches', icon: 'watch' },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(cat.path)}
              className="group cursor-pointer rounded-xl border border-gray-200 p-6 text-center bg-white
                         hover:shadow-xl hover:-translate-y-1 hover:scale-[1.04] transition-all duration-300"
            >
              <span className="material-icons text-3xl text-gray-500 group-hover:text-primary">
                {cat.icon}
              </span>
              <h3 className="mt-2 font-semibold text-gray-700 group-hover:text-primary">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 Flash Deals */}
      <div className="bg-gray-50 p-5 rounded-lg space-y-3">
        <h2 className="text-lg font-semibold">🔥 Flash Deals</h2>
        <p className="text-sm text-gray-600">Limited time offers on selected items</p>
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-[scroll_25s_linear_infinite]">
            {[
              { name: 'iPhone Deals', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
              { name: 'Laptop Sale', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
              { name: 'Smart Watches', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12' },
              { name: 'Accessories', img: 'https://images.unsplash.com/photo-1580894908361-967195033215' },
            ].map((item, i) => (
              <div
                key={i}
                className="min-w-[300px] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <p className="text-base text-center py-3 font-medium text-gray-700">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="text-primary font-medium hover:underline"
        >
          View Deals →
        </button>
      </div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* 🔥 Trending Now */}
      <TrendingNow />

      {/* 🔥 Customer Reviews */}
      <div className="space-y-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">What our customers say</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { text: 'Amazing service and fast delivery! My laptop arrived in perfect condition.', name: 'Sarah K.' },
            { text: 'The products are 100% genuine. I bought a smartphone and it exceeded my expectations!', name: 'David M.' },
            { text: 'Customer support was very helpful. They guided me through my purchase smoothly.', name: 'Aisha N.' },
          ].map((review, i) => (
            <div key={i} className="p-3 border rounded-lg bg-white shadow-md hover:shadow-lg transition flex flex-col items-center text-center space-y-2">
              <span className="material-icons text-3xl text-primary">format_quote</span>
              <p className="text-gray-700 text-sm">"{review.text}"</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="material-icons text-2xl text-gray-400">person</span>
                <p className="text-gray-800 font-semibold text-sm">{review.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 Social Media */}
        <div className="mt-6 space-y-3">
          <p className="text-sm md:text-base text-gray-600 font-medium">Reach us out on</p>
          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="https://www.tiktok.com/@yourpage"
              target="_blank"
              rel="noreferrer"
              className="w-20 h-20 flex items-center justify-center rounded-full bg-black text-white text-6xl shadow-lg hover:scale-110 transition"
            >
              <FaTiktok />
            </a>
            <a
              href="https://www.instagram.com/yourpage"
              target="_blank"
              rel="noreferrer"
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white text-6xl shadow-lg hover:scale-110 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noreferrer"
              className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-600 text-white text-6xl shadow-lg hover:scale-110 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noreferrer"
              className="w-20 h-20 flex items-center justify-center rounded-full bg-green-600 text-white text-6xl shadow-lg hover:scale-110 transition"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-900 text-white p-6 rounded-lg text-center space-y-3">
        <h2 className="text-lg font-semibold">Stay Updated</h2>
        <p className="text-sm text-gray-300">Get latest deals and offers</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="px-3 py-2 rounded text-black w-64"
        />
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold">
          Discover the latest tech at unbeatable prices!
        </h2>
      </div>

    </div>
  );
};

export default Homepage;