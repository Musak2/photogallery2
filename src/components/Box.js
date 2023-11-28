import React from 'react';
import './Box.css';
import defaultImage from '../images/default-image.avif';


function Box({ text, mainImage, onClick, imageCount, onDelete }) {
  const imageToDisplay = mainImage || defaultImage;
  const photoText = imageCount === 1 ? "fotka" : (imageCount === 0 || imageCount > 4 ? "fotiek" : "fotky");
  const imageClass = text ? 'box-image' : 'box-image full-height-image';

  const handleDeleteIconClick = (e) => {
    e.stopPropagation();
    onDelete(text);
};

  return (
    <div className="box" onClick={onClick}>
      <div className={imageClass} style={{ backgroundImage: `url(${imageToDisplay})` }}>
        {imageCount !== undefined && <div className="photo-count">{imageCount + " " + photoText}</div>}
        {text && <div className="delete-icon" onClick={handleDeleteIconClick}>X</div>}
      </div>
      {text && <div className="box-text">{text}</div>}

    </div>
  );
}

export default Box;
