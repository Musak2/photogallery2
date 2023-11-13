// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Toast from './components/Toast';
import AddCategoryPopup from './components/AddCategoryPopup';
import AddPhotosPopup from './components/AddPhotosPopup';
import GalleryList from './components/GalleryList';
import ImagePreviewOverlay from './components/ImagePreviewOverlay';
import CategoryList from './components/CategoryList';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actualCategory, setActualCategory] = useState(null);
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [showAddPhotosPopup, setShowAddPhotosPopup] = useState(false);

  const maxBoxesInRow = 4;
  const viewingCategoryText = viewingCategory ? viewingCategory.text : null;

  useEffect(() => {

    fetchGalleryData();

  }, []);

  const fetchGalleryData = () => {
    fetch('http://api.programator.sk/gallery')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.galleries) {
          console.error("Unexpected data structure:", data);
          return;
        }

        const mappedData = data.galleries.map((gallery, index) => ({
          id: index, // Assuming each gallery has a unique index. Modify as needed.
          text: decodeURIComponent(gallery.name),
          mainImage: gallery.image ? `http://api.programator.sk/images/300x200/${gallery.image.fullpath}` : null,
          relatedImages: [],
          numberOfImages: 0
        }));

        return Promise.all(mappedData.map(box => {
          if (!box.mainImage) {
            return Promise.resolve(box);
          }

          const encodedCategory = encodeURIComponent(box.text);
          return fetch(`http://api.programator.sk/gallery/${encodedCategory}`)
            .then(response => response.json())
            .then(data => {
              if (data && data.images) {
                box.relatedImages = data.images.map(image => `http://api.programator.sk/images/300x200/${image.fullpath}`);
                box.numberOfImages = data.images.length;
              }
              return box;
            });
        }));
      })
      .then(updatedBoxes => {
        if (updatedBoxes) {
          setBoxes(updatedBoxes);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const fetchPhotosData = (category) => {
    const encodedCategory = encodeURIComponent(category);

    console.log(`Fetching photos for category: ${category}`);
    console.log('Before fetching, boxes:', boxes);

    fetch(`http://api.programator.sk/gallery/${encodedCategory}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.images) {
          console.error("Unexpected data structure:", data);
          return;
        }

        console.log(`Received data for category ${category}:`, data);

        const updatedBoxes = boxes.map(box => {
          if (box.text === category) {
            console.log(`Updating box for category ${category}`);
            return {
              ...box,
              relatedImages: data.images.map(image => `http://api.programator.sk/images/300x200/${image.fullpath}?timestamp=${new Date().getTime()}`),
              numberOfImages: data.images.length
            };
          }
          return box;
        });

        setBoxes(updatedBoxes);
      })
      .catch(error => {
        console.error('Error fetching photos data:', error);
      });
  };

  useEffect(() => {
    if (viewingCategoryText) {
      const updatedCategory = boxes.find(box => box.text === viewingCategoryText);
      if (updatedCategory) {
        setViewingCategory(updatedCategory);
      }
    }
  }, [boxes, viewingCategoryText]);


  const setCategory = (category) => {
    setActualCategory(category);  // Update the state variable
  };

  const handleCategoryClick = (category) => {
    setViewingCategory(category);
    // console.log("Category: " + category.text);
    setCategory(category.text);
  };

  const goBack = () => {
    setViewingCategory(null);
    fetchGalleryData();
  };

  const openPreview = (category, imageName, index = 0) => {
    const fullSizeImageUrl = `http://api.programator.sk/images/300x200/${category}/${imageName}`;
    setCurrentImageIndex(index);
    setPreviewImage(fullSizeImageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const navigateGallery = (direction) => {

    if (!viewingCategory || !viewingCategory.relatedImages) return;

    let newIndex = currentImageIndex;
    if (direction === 'prev') {
      newIndex = (newIndex - 1 + viewingCategory.relatedImages.length) % viewingCategory.relatedImages.length;
    } else if (direction === 'next') {
      newIndex = (newIndex + 1) % viewingCategory.relatedImages.length;
    }

    // console.log("New Index:", newIndex);

    if (viewingCategory.relatedImages[newIndex]) {
      const newImageName = viewingCategory.relatedImages[newIndex].split('/').pop();
      openPreview(viewingCategory.text, newImageName, newIndex);
    }
  };

  const [toastInfo, setToastInfo] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });


  return (
    <div className="App">
      <div className="fotogaleria-text">Fotogaléria</div>

      <div className="kategorie-text" onClick={viewingCategory ? goBack : null}>
        {viewingCategory ? "← " + viewingCategory.text : "Kategórie"}
      </div>

      {!viewingCategory && (
        <GalleryList
          boxes={boxes}
          maxBoxesInRow={maxBoxesInRow}
          onCategoryClick={handleCategoryClick}
          onAddCategoryClick={() => setShowAddCategoryPopup(true)}
        />
      )}

      {showAddCategoryPopup && (
        <AddCategoryPopup
          onClose={() => setShowAddCategoryPopup(false)}
          setToastInfo={setToastInfo}
          fetchGalleryData={fetchGalleryData}
        />
      )}

      {viewingCategory && (
        <CategoryList
          category={viewingCategory}
          onImageClick={openPreview}
          onAddPhotosClick={() => setShowAddPhotosPopup(true)}
          maxBoxesInRow={maxBoxesInRow}
        />
      )}

      {showAddPhotosPopup && (
        <AddPhotosPopup
          onClose={() => setShowAddPhotosPopup(false)}
          actualCategory={actualCategory}
          setToastInfo={setToastInfo}
          fetchPhotosData={fetchPhotosData}
        />
      )}

      {
        previewImage && (
          <ImagePreviewOverlay
            image={previewImage}
            onNavigate={navigateGallery}
            onClose={closePreview}
          />
        )
      }

      <Toast
        message={toastInfo.message}
        type={toastInfo.type}
        isVisible={toastInfo.isVisible}
        onClose={() => setToastInfo(prev => ({ ...prev, isVisible: false }))}
        onClosed={fetchGalleryData}
      />

    </div >
  );
}

export default App;
