import React from 'react';
import Box from './Box';
import './GalleryList.css';

const GalleryList = ({ boxes, onCategoryClick, onAddCategoryClick }) => {
    return (
        <>
            {boxes.map((box) => (
                <Box
                    key={box.id}
                    text={box.text}
                    mainImage={box.mainImage}
                    onClick={() => onCategoryClick(box)}
                    imageCount={box.numberOfImages}
                />
            ))}

            <div
                className="add-category-box box"
                onClick={onAddCategoryClick}
            >
                <div className="plus-symbol">
                </div>
                <div className="add-text">
                    Pridať kategóriu
                </div>
            </div>
        </>
    );
};

export default GalleryList;
