import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    };
    fetchSuggestions();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between bg-[#0a0f2f] rounded-full p-2 gap-2 shadow-md"
      >
        {/* Left inner rectangle (input) */}
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 text-sm rounded-full bg-[#1a1f4f] placeholder-gray-400 text-white outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Right inner rectangle (button) */}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
        >
          Search
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-[#1a1f4f] border border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto text-sm text-white">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 cursor-pointer hover:bg-blue-700 transition"
              onClick={() => handleSuggestionClick(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;