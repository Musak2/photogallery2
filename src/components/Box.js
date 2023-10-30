import React from 'react';
import './Box.css';
import defaultImage from '../images/default-image.jpg';  // Import a default image

function Box({ top, left, text, mainImage, onClick }) {
  const imageToDisplay = mainImage || defaultImage; // Use mainImage if available, otherwise use defaultImage
  
  return (
    <div className="box" style={{ top: `${top}px`, left: `${left}px` }} onClick={onClick}>
      <div className="box-image" style={{ backgroundImage: `url(${imageToDisplay})` }}></div>
      {text && <div className="box-text">{text}</div>}
    </div>
  );
}

export default Box;
