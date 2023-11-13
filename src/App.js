// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Toast from './components/Toast';
import AddCategoryPopup from './components/AddCategoryPopup';
import AddPhotosPopup from './components/AddPhotosPopup';
import GalleryList from './components/GalleryList';
import ImagePreviewOverlay from './components/ImagePreviewOverlay';
import CategoryList from './components/CategoryList';
import { fetchGalleryData, fetchPhotosData } from './services/apiService';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actualCategory, setActualCategory] = useState(null);
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [showAddPhotosPopup, setShowAddPhotosPopup] = useState(false);
  const [categoryAdded, setCategoryAdded] = useState(false);

  const maxBoxesInRow = 4;
  const viewingCategoryText = viewingCategory ? viewingCategory.text : null;

  useEffect(() => {
    fetchGalleryData().then(data => {
      setBoxes(data);
    }).catch(error => {
      console.error('Error fetching gallery data:', error);
      // Handle error (e.g., show notification)
    });
  }, [categoryAdded]);

  const updatePhotosData = async (category) => {
    try {
      const images = await fetchPhotosData(category);
      setBoxes(boxes => boxes.map(box => {
        if (box.text === category) {
          return { ...box, relatedImages: images, numberOfImages: images.length };
        }
        return box;
      }));
    } catch (error) {
      console.error(`Error fetching photos for category ${category}:`, error);
      // Handle error (e.g., show notification)
    }
  };

  useEffect(() => {
    if (viewingCategoryText) {
      const updatedCategory = boxes.find(box => box.text === viewingCategoryText);
      if (updatedCategory) {
        setViewingCategory(updatedCategory);
      }
    }
  }, [boxes, viewingCategoryText]);

  const handlePhotoAdded = () => {
    fetchGalleryData().then(data => {
      setBoxes(data);
    }).catch(error => {
      console.error('Error refetching gallery data:', error);
      // Handle error (e.g., show notification)
    });
  };

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
          onCategoryAdded={() => setCategoryAdded(prev => !prev)}
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
          fetchPhotosData={updatePhotosData}
          onPhotoAdded={handlePhotoAdded}
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
