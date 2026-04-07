// frontend/src/pages/ProductDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaWhatsapp, FaTruck, FaHeart } from 'react-icons/fa';
import axios from 'axios';

const ProductDetailsPage = ({ onAddToCart, addedItems }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const data = res.data;
        const details = data.details || {};

        let imagesArray = [];
        if (details.images?.length) {
          imagesArray = details.images.slice(0, 3);
        } else if (data.image_url) {
          imagesArray = [data.image_url];
        }
        while (imagesArray.length < 3) imagesArray.push('/images/placeholder.jpg');

        setProduct({
          ...data,
          images: imagesArray,
          keyFeatures: details.keyFeatures || null,
          rating: details.rating ?? null,
          reviews: details.reviews ?? null,
          oldPrice: details.oldPrice ?? null,
          stock: details.stock ?? null,
          delivery: details.delivery ?? null,
        });
        setSelectedImage(imagesArray[0]);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading product...</div>;

  const savings =
    product.oldPrice && product.price ? product.oldPrice - product.price : null;

  const handleThumbnailClick = (idx) => {
    if (idx === 0) return;
    const newImages = [...product.images];
    [newImages[0], newImages[idx]] = [newImages[idx], newImages[0]];
    setProduct({ ...product, images: newImages });
    setSelectedImage(newImages[0]);
  };

  const isAdded = addedItems?.includes(product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left: Images */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg border border-gray-200 mb-4"
          />
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={`w-24 h-24 object-cover rounded-lg border-2 cursor-pointer transition-transform hover:scale-105 ${
                  selectedImage === img ? 'border-primary' : 'border-gray-200'
                }`}
                onClick={() => handleThumbnailClick(idx)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`${product.rating && i + 0.5 < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {product.reviews !== null ? `${product.reviews} verified reviews` : 'Not provided'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-2xl font-bold text-primary">
                Ksh {product.price?.toLocaleString() ?? 'Not provided'}
              </span>
              <span className="text-gray-400 line-through">
                {product.oldPrice ? `Ksh ${product.oldPrice.toLocaleString()}` : 'Not provided'}
              </span>
              {savings !== null && (
                <span className="text-green-600 font-semibold">
                  You save Ksh {savings.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock & Delivery */}
            <div className="flex items-center gap-4 mb-4 text-gray-700">
              <FaTruck className="text-primary" />
              <span>{product.delivery ?? 'Not provided'}</span>
            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">Key Features:</h2>
              {product.keyFeatures ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {product.keyFeatures.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Not provided</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* WhatsApp Order */}
            <a
              href={`https://wa.me/254000000000?text=Hi! I'm interested in ${product.name} for Ksh ${product.price}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              Order via WhatsApp
            </a>

            {/* Add to Cart */}
            <button
              onClick={() => onAddToCart(product.id)}
              className={`flex-1 px-6 py-3 rounded-lg text-white transition flex items-center justify-center gap-2 ${
                isAdded ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAdded ? '✔ Added' : 'Add to Cart (Pay on Delivery)'}
            </button>

            <button className="p-3 bg-gray-100 text-red-500 rounded-lg hover:bg-gray-200 transition self-start">
              <FaHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;