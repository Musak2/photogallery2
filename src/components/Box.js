import React from 'react';
import './Box.css';
import defaultImage from '../images/default-image.avif';

function Box({ top, left, text, mainImage, onClick, imageCount }) {
  const imageToDisplay = mainImage || defaultImage;
  const photoText = imageCount === 1 ? "fotka" : (imageCount === 0 || imageCount > 4 ? "fotiek" : "fotky");


  // Determine if the image should be full height based on the existence of text
  const imageClass = text ? 'box-image' : 'box-image full-height-image';

  return (
    <div className="box" style={{ top: `${top}px`, left: `${left}px` }} onClick={onClick}>
      <div className={imageClass} style={{ backgroundImage: `url(${imageToDisplay})` }}>
        {imageCount !== undefined && <div className="photo-count">{imageCount + " " + photoText}</div>}

      </div>
      {text && <div className="box-text">{text}</div>}
    </div>
  );
}

export default Box;
