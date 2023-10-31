// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Box from './components/Box';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [viewingCategory, setViewingCategory] = useState(null);
  const maxBoxesInRow = 4;
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {

    fetch('http://api.programator.sk/gallery')
      .then(response => response.json())
      .then(data => {
        if (!data || !data.galleries) {
          console.error("Unexpected data structure:", data);
          return;
        }

        const mappedData = data.galleries.map((gallery, index) => ({
          id: index,
          text: decodeURIComponent(gallery.name),
          mainImage: gallery.image ? `http://api.programator.sk/images/300x200/${gallery.image.fullpath}` : null,
          relatedImages: []
        }));

        return Promise.all(
          mappedData.map((box) => {

            if (!box.mainImage) {
              return Promise.resolve(box);
            }

            const encodedCategory = encodeURIComponent(box.text);
            return fetch(`http://api.programator.sk/gallery/${encodedCategory}`)
              .then(response => {
                if (!response.ok) {
                  console.error(`Failed to fetch related images for ${box.text}, status: ${response.status}`);
                  return box;
                }
                return response.json();
              })
              .then(data => {
                if (data && data.images) {
                  box.relatedImages = data.images.map(image => `http://api.programator.sk/images/300x200/${image.fullpath}`);
                }
                return box;
              });
          })
        );
      })
      .then(updatedBoxes => {
        if (updatedBoxes) {
          setBoxes(updatedBoxes);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

  }, []);

  const handleCategoryClick = (category) => {
    setViewingCategory(category);
  };

  const goBack = () => {
    setViewingCategory(null);
  };

  const openPreview = (category, imageName, index = 0) => {
    const fullSizeImageUrl = `http://api.programator.sk/images/800x600/${category}/${imageName}`;
    setCurrentImageIndex(index);
    setPreviewImage(fullSizeImageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const navigateGallery = (direction) => {

    if (!viewingCategory || !viewingCategory.relatedImages) return;

    console.log("Current Image Index:", currentImageIndex);
    console.log("Viewing Category Related Images Length:", viewingCategory.relatedImages.length);
    console.log("Type of currentImageIndex:", typeof currentImageIndex);
    console.log("Type of viewingCategory.relatedImages.length:", typeof viewingCategory.relatedImages.length);

    if (isNaN(currentImageIndex) || isNaN(viewingCategory.relatedImages.length)) {
      console.error("Either currentImageIndex or relatedImages.length is not a number.");
      return;
    }

    let newIndex = currentImageIndex;
    if (direction === 'prev') {
      newIndex = (newIndex - 1 + viewingCategory.relatedImages.length) % viewingCategory.relatedImages.length;
    } else if (direction === 'next') {
      newIndex = (newIndex + 1) % viewingCategory.relatedImages.length;
    }

    console.log("New Index:", newIndex);

    if (viewingCategory.relatedImages[newIndex]) {
      const newImageName = viewingCategory.relatedImages[newIndex].split('/').pop();
      openPreview(viewingCategory.text, newImageName, newIndex);
    }
  };



  return (
    <div className="App">
      <div className="fotogaleria-text">Fotogaléria</div>

      <div className="kategorie-text" onClick={viewingCategory ? goBack : null}>
        {viewingCategory ? "← " + viewingCategory.text : "Kategórie"}
      </div>

      {/* If not viewing a specific category, show all categories */}
      {!viewingCategory && boxes.map((box, index) => {
        console.log("Box image: ", box.mainImage)
        return (
          <Box
            key={box.id}
            top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
            left={304 + (index % maxBoxesInRow) * (304 + 32)}
            text={box.text}
            mainImage={box.mainImage}
            onClick={() => {
              handleCategoryClick(box);
            }}
          />
        );
      })}

      {/* If viewing a specific category, show its images */}
      {viewingCategory && viewingCategory.relatedImages.map((image, index) => (
        <Box
          key={index}
          top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
          left={304 + (index % maxBoxesInRow) * (304 + 32)}
          mainImage={image}
          onClick={() => openPreview(viewingCategory.text, image.split('/').pop(), index)}
        />
      ))}

      {/* Simple image preview */}
      {previewImage && (
        <div className="preview-overlay" onClick={closePreview}>
          <div className="navigation-circle" style={{ left: '18%' }} onClick={(e) => { e.stopPropagation(); navigateGallery('prev'); }}>
            ←
          </div>
          <img className="preview-image" src={previewImage} alt="Full Preview" />
          <div className="navigation-circle" style={{ right: '18%' }} onClick={(e) => { e.stopPropagation(); navigateGallery('next'); }}>
            →
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
