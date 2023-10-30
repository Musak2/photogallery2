import React from 'react';
import './Box.css';

function Box({ top, left, text, mainImage, onClick }) {
  return (
    <div className="box" style={{ top: `${top}px`, left: `${left}px` }} onClick={onClick}>
      <div className="box-image" style={{ backgroundImage: `url(${mainImage})` }}></div>
      {text && <div className="box-text">{text}</div>}
    </div>
  );
}

export default Box;
