// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import Box from './components/Box';  // Import the Box component
import dolphinsImage from './images/dolphins.jpg';  // Import the image

function App() {
  const [boxes, setBoxes] = useState([]);
  const [viewingCategory, setViewingCategory] = useState(null);
  const maxBoxesInRow = 4;

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setBoxes([
        {
          id: 0,
          text: "Príroda",
          mainImage: dolphinsImage,
          relatedImages: ['path/to/image1_2.jpg', 'path/to/image1_3.jpg']
        },
        {
          id: 1,
          text: "Architektúra",
          mainImage: dolphinsImage,
          relatedImages: ['path/to/image2_1.jpg', 'path/to/image2_2.jpg']
        },
        {
          id: 2,
          text: "Ľudia",
          mainImage: dolphinsImage,
          relatedImages: ['path/to/image3_1.jpg', 'path/to/image3_2.jpg']
        },
        {
          id: 3,
          text: "Jedlo",
          mainImage: dolphinsImage,
          relatedImages: ['path/to/image4_1.jpg', 'path/to/image4_2.jpg']
        },
        {
          id: 4,
          text: "Abstratkné",
          mainImage: dolphinsImage,
          relatedImages: ['path/to/image5_1.jpg', 'path/to/imag51_2.jpg']
        },
      ]);
    }, 1000);
  }, []);

  const handleCategoryClick = (category) => {
    setViewingCategory(category);
  };

  const goBack = () => {
    setViewingCategory(null);
  };

  return (
    <div className="App">
      <div className="fotogaleria-text">Fotogaléria</div>
      <div
        className="kategorie-text"
        onClick={viewingCategory ? goBack : null}
      >
        {viewingCategory ? "← " + viewingCategory.text : "Kategórie"}
      </div>

      {/* If not viewing a specific category, show all categories */}
      {!viewingCategory && boxes.map((box, index) => (
        <Box
          key={box.id}
          top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
          left={304 + (index % maxBoxesInRow) * (304 + 32)}
          text={box.text}
          mainImage={box.mainImage}  // corrected from box.image
          onClick={() => handleCategoryClick(box)}
        />
      ))}

      {/* If viewing a specific category, show its images */}
      {viewingCategory && viewingCategory.relatedImages.map((image, index) => (  // corrected from viewingCategory.images
        <Box
          key={index}
          top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
          left={304 + (index % maxBoxesInRow) * (304 + 32)}
          mainImage={image}
        />
      ))}

    </div>
  );
}

export default App;