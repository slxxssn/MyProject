import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, addedItems, onAddToCart }) => {
  const navigate = useNavigate();
  const isAdded = addedItems.includes(product.id);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-4 flex flex-col justify-between
        transition-all duration-300 transform
        hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
        ${isAdded ? 'opacity-80' : ''}`}
    >
      {/* Image */}
      <div className="w-full h-36 bg-gray-100 rounded-md mb-3 overflow-hidden">
        {product.image ? (
          <img
            src={product.image} // make sure this matches your backend field
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-gray-800 font-semibold text-sm">{product.name}</h3>
        <p className="text-gray-500 text-xs line-clamp-2">{product.description || 'No description available'}</p>
        <p className="text-primary font-bold text-sm">Ksh {product.price?.toLocaleString()}</p>
      </div>

      {/* Buttons */}
      <div className="mt-3 space-y-2">
        {/* View Details */}
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="w-full py-2 rounded-md border border-blue-600 text-blue-600 text-sm font-medium
                     transition-all duration-200
                     hover:bg-blue-600 hover:text-white hover:scale-[1.03]"
        >
          View Details
        </button>

        {/* Add to Cart */}
        <button
          onClick={() => onAddToCart(product.id)}
          className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200
            ${isAdded
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.03]'
            }`}
        >
          {isAdded ? '✔ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;