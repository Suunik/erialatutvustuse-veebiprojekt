import React, { useEffect, useRef } from 'react';

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, children }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null; // Don't render anything if not visible

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div ref={popupRef} className="bg-white rounded-lg p-6 shadow-lg relative w-auto min-w-0">
        {children}
      </div>
    </div>
  );
};

export default Popup;