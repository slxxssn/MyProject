// frontend/src/pages/SearchResultsPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../api';
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [addedProducts, setAddedProducts] = useState([]); // track added products
  const [showLoginToast, setShowLoginToast] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q');

  const [isLoggedIn] = useState(true); // simulated login

  // Function to fetch results
  const fetchResults = useCallback(async () => {
    setLoading(true);

    // Check if saved results exist for this query
    const saved = sessionStorage.getItem(`search-${query}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProducts(parsed);
      setMessage(parsed.length === 0 ? `No results for "${query}"` : '');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/products/search?q=${query}`);
      setProducts(res.data);
      setMessage(res.data.length === 0 ? `No results for "${query}"` : '');
      // Save results to sessionStorage
      sessionStorage.setItem(`search-${query}`, JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch search results');
    }
    setLoading(false);
  }, [query]);

  // Fetch when query changes
  useEffect(() => {
    if (query) fetchResults();
  }, [query, fetchResults]);

  const handleAddToCart = (productId) => {
    if (!isLoggedIn) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3000);
      return;
    }

    if (!addedProducts.includes(productId)) {
      setAddedProducts([...addedProducts, productId]);
    }

    console.log('Added to cart:', productId);
  };

  return (
    <div className="w-full px-4 md:px-10 py-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Search Results {query && `for "${query}"`}
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : message ? (
        <p className="text-gray-500">{message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addedItems={addedProducts}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {showLoginToast && (
        <div className="fixed bottom-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded shadow-md animate-slide-in">
          Please login to add to cart
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;