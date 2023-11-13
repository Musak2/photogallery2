import React from 'react';
import Box from './Box'; // Make sure the path is correct based on your project structure

const CategoryView = ({ category, onImageClick, onAddPhotosClick, maxBoxesInRow }) => {
  return (
    <>
      {category.relatedImages.map((image, index) => (
        <Box
          key={image.id || image.filename || index}
          top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
          left={304 + (index % maxBoxesInRow) * (304 + 32)}
          mainImage={image}
          onClick={() => onImageClick(category.text, image.split('/').pop(), index)}
        />
      ))}

      <div
        className="box"
        style={{
          top: `${225 + Math.floor(category.relatedImages.length / maxBoxesInRow) * (295 + 32)}px`,
          left: `${304 + (category.relatedImages.length % maxBoxesInRow) * (304 + 32)}px`,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onAddPhotosClick}
      >
        <div className="plus-symbol" style={{ display: 'flex', fontSize: '24px', justifyContent: 'center', alignItems: 'center' }}>
        </div>
        <div className="addText" style={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Pridať fotky
        </div>
      </div>
    </>
  );
};

export default CategoryView;
