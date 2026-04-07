// frontend/src/components/TrendingNow.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrendingNow = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/trending/all');
        setTrendingProducts(res.data);
      } catch (err) {
        console.error('Error fetching trending products:', err);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800">🔥 Trending Now</h2>

      <div className="overflow-hidden">
        <div className="flex gap-8 animate-[scroll_25s_linear_infinite]">

          {trendingProducts.length === 0 && (
            <p className="text-gray-500 text-center w-full">
              No trending products yet
            </p>
          )}

          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[260px] bg-white rounded-xl shadow-md overflow-hidden 
                         hover:shadow-xl hover:scale-105 transition cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Bigger Image */}
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover"
              />

              {/* Info */}
              <div className="p-3 text-center space-y-1">
                <p className="text-base font-semibold text-gray-800">
                  {product.name}
                </p>

                <p className="text-primary font-bold text-lg">
                  KES {product.price?.toLocaleString() ?? 'N/A'}
                </p>

                {/* Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${product.id}`);
                  }}
                  className="w-full mt-2 bg-primary text-white py-2 rounded-lg 
                             hover:bg-primary-dark transition text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default TrendingNow;