import React from 'react';
import './Box.css';
import defaultImage from '../images/default-image.avif';

function Box({ top, left, text, mainImage, onClick }) {
  const imageToDisplay = mainImage || defaultImage;
  
  return (
    <div className="box" style={{ top: `${top}px`, left: `${left}px` }} onClick={onClick}>
      <div className="box-image" style={{ backgroundImage: `url(${imageToDisplay})` }}></div>
      {text && <div className="box-text">{text}</div>}
    </div>
  );
}

export default Box;
