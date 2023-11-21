import React, { useEffect, useCallback } from 'react';
import './ImagePreviewOverlay.css'; // Import the CSS file

const ImagePreviewOverlay = ({ image, onNavigate, onClose }) => {
  // Handle key presses
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      onNavigate('prev');
    } else if (e.key === 'ArrowRight') {
      onNavigate('next');
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [onNavigate, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]); 

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="navigation-circle left" onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}>
        ←
      </div>
      <img className="preview-image" src={image} alt="Full Preview" />
      <div className="navigation-circle right" onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}>
        →
      </div>
    </div>
  );
};

export default ImagePreviewOverlay;
