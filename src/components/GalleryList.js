import React from 'react';
import Box from './Box'; // Adjust the import path as necessary

const GalleryList = ({ boxes, maxBoxesInRow, onCategoryClick, onAddCategoryClick }) => {
    return (
        <>
            {boxes.map((box, index) => (
                <Box
                    key={box.id}
                    top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
                    left={304 + (index % maxBoxesInRow) * (304 + 32)}
                    text={box.text}
                    mainImage={box.mainImage}
                    onClick={() => onCategoryClick(box)}
                    imageCount={box.numberOfImages}
                />
            ))}

            <div
                className="box"
                style={{
                    top: `${225 + Math.floor(boxes.length / maxBoxesInRow) * (295 + 32)}px`,
                    left: `${304 + (boxes.length % maxBoxesInRow) * (304 + 32)}px`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={onAddCategoryClick}
            >
                <div className="plus-symbol" style={{ display: 'flex', fontSize: '24px', justifyContent: 'center', alignItems: 'center' }}>
                </div>
                <div className="addText" style={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Pridať kategóriu
                </div>
            </div>
        </>
    );
};

export default GalleryList;
