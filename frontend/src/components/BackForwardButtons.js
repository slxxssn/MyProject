// frontend/src/components/BackForwardButtons.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BackForwardButtons = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [historyStack, setHistoryStack] = useState([]);
  const [forwardStack, setForwardStack] = useState([]);

  useEffect(() => {
    if (historyStack[historyStack.length - 1] !== location.pathname) {
      setHistoryStack((prev) => [...prev, location.pathname]);
      setForwardStack([]);
    }
  }, [location.pathname]);

  const handleBack = () => {
    if (historyStack.length > 1) {
      const newHistory = [...historyStack];
      const last = newHistory.pop();
      const prev = newHistory[newHistory.length - 1];

      setHistoryStack(newHistory);
      setForwardStack((prevForward) => [...prevForward, last]);
      navigate(prev);
    }
  };

  const handleNext = () => {
    if (forwardStack.length > 0) {
      const newForward = [...forwardStack];
      const next = newForward.pop();
      setForwardStack(newForward);
      setHistoryStack((prevHistory) => [...prevHistory, next]);
      navigate(next);
    }
  };

  return (
    <>
      {/* Back button */}
      <button
        onClick={handleBack}
        disabled={historyStack.length <= 1}
        className={`fixed left-4 top-1/4 transform -translate-y-1/2 flex items-center justify-center w-20 h-8 rounded-md bg-white/90 shadow-md space-x-1 px-2 transition-all duration-200 cursor-pointer
          ${historyStack.length <= 1 ? 'opacity-30' : 'hover:bg-white'}
        `}
      >
        <span className="material-icons text-gray-600 text-sm">arrow_back</span>
        <span className="text-gray-700 font-medium text-xs">Back</span>
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={forwardStack.length === 0}
        className={`fixed right-4 top-1/4 transform -translate-y-1/2 flex items-center justify-center w-20 h-8 rounded-md bg-white/90 shadow-md space-x-1 px-2 transition-all duration-200 cursor-pointer
          ${forwardStack.length === 0 ? 'opacity-30' : 'hover:bg-white'}
        `}
      >
        <span className="text-gray-700 font-medium text-xs">Next</span>
        <span className="material-icons text-gray-600 text-sm">arrow_forward</span>
      </button>
    </>
  );
};

export default BackForwardButtons;