import React from 'react';
import Box from './Box';
import './GalleryList.css';

const GalleryList = ({ boxes, onCategoryClick, onAddCategoryClick, onDelete }) => {
    return (
        <>
            {boxes.map((box) => (
                <Box
                    key={box.id}
                    text={box.text}
                    mainImage={box.mainImage}
                    onClick={() => onCategoryClick(box)}
                    imageCount={box.numberOfImages}
                    onDelete={() => onDelete(box.text)}
                />
            ))}

            <div
                className="add-category-box box"
                onClick={onAddCategoryClick}
            >
                <div className="plus-symbol">
                </div>
                <div className="addText">
                    Pridať kategóriu
                </div>
            </div>
        </>
    );
};

export default GalleryList;
