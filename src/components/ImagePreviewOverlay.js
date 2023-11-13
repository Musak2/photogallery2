import React from 'react';

const ImagePreviewOverlay = ({ image, onNavigate, onClose }) => {
  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="navigation-circle" style={{ left: '10%' }} onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}>
        ←
      </div>
      <img className="preview-image" src={image} alt="Full Preview" />
      <div className="navigation-circle" style={{ right: '10%' }} onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}>
        →
      </div>
    </div>
  );
};

export default ImagePreviewOverlay;
