import React from 'react';
import Box from './Box'; 
import './PhotoList.css'; 

const PhotoList = ({ category, onImageClick, onAddPhotosClick }) => {
  if (!category || !category.relatedImages) {
    return null; // Or some loading indicator
  }

  return (
    <>
      {category.relatedImages.map((image, index) => (
        <Box
          key={index}
          mainImage={image}
          onClick={() => onImageClick(category.text, image.split('/').pop(), index)}
        />
      ))}

      <div className="category-box box" onClick={onAddPhotosClick}>
        <div className="plus-symbol"></div>
        <div className="addText">Pridať fotky</div>
      </div>
    </>
  );
};

export default PhotoList;
