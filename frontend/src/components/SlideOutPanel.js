import React, { forwardRef, useRef, useEffect } from 'react';

const SlideOutPanel = forwardRef(({ open, title, children, onClose }, _ref) => {
  const panelRef = useRef();

  // Merge forwarded ref (optional)
  useEffect(() => {
    if (!_ref) return;
    if (typeof _ref === 'function') _ref(panelRef.current);
    else _ref.current = panelRef.current;
  }, [_ref]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30"></div>

      {/* Panel */}
      <div
        ref={panelRef}
        className="ml-auto w-80 max-w-full bg-white h-full shadow-lg p-6 overflow-y-auto transform transition-transform"
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
});

export default SlideOutPanel;