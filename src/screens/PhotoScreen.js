import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PhotoList from '../components/PhotoList';
import AddPhotosPopup from '../components/AddPhotosPopup';
import ImagePreviewOverlay from '../components/ImagePreviewOverlay';
import Toast from '../components/Toast';
import { fetchPhotosData } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const PhotoScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showAddPhotosPopup, setShowAddPhotosPopup] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [category, setCategory] = useState(location.state?.category);
    const [toastInfo, setToastInfo] = useState({
        message: '',
        type: 'success',
        isVisible: false
    });

    useEffect(() => {
        if (category && category.text) {
            fetchPhotosData(category.text).then(data => {
                // Update the category object to include the fetched photos
                setCategory(prevCategory => ({
                    ...prevCategory,
                    relatedImages: data
                }));
            }).catch(error => {
                console.error(`Error fetching photos for category ${category.text}:`, error);
            });
        }
    }, [category]);
    

    const openPreview = (category, imageName, index = 0) => {
        const fullSizeImageUrl = `http://api.programator.sk/images/300x200/${category}/${imageName}`;
        setCurrentImageIndex(index);
        setPreviewImage(fullSizeImageUrl);
        console.log(imageName);
    };

    const closePreview = () => {
        setPreviewImage(null);
    };

    const navigateGallery = (direction) => {

        if (!category || !category.relatedImages) return;
    
        let newIndex = currentImageIndex;
        if (direction === 'prev') {
          newIndex = (newIndex - 1 + category.relatedImages.length) % category.relatedImages.length;
        } else if (direction === 'next') {
          newIndex = (newIndex + 1) % category.relatedImages.length;
        }
    
        if (category.relatedImages[newIndex]) {
          const newImageName = category.relatedImages[newIndex].split('/').pop();
          openPreview(category.text, newImageName, newIndex);
        }
      };

      const handlePhotoAdded = () => {
        if (category) {
            fetchPhotosData(category.text).then(data => {
                setCategory(prevCategory => ({
                    ...prevCategory,
                    relatedImages: data
                }));
            }).catch(error => {
                console.error(`Error refetching photos for category ${category.text}:`, error);
            });
        }
    };
    

    const getCategoryText = () => {
        if (category && category.text) {
            // console.log("Kategoria: " + category + "Kategoria.text: " + category.text);
            return `← ${category.text}`;
        }
        return "Kategórie";
    };

    const navigateBack = () => {
        navigate('/');
    };

    const updatePhotosData = async (category) => {
        try {
          const images = await fetchPhotosData(category);
          setCategory(boxes => boxes.map(box => {
            if (box.text === category) {
              return { ...box, relatedImages: images, numberOfImages: images.length };
            }
            return box;
          }));
        } catch (error) {
          console.error(`Error fetching photos for category ${category}:`, error);
        }
      };

    return (
        <div className="App">
            <div className="fotogaleria-text">Fotogaléria</div>
            <div className="kategorie-text" onClick={navigateBack}>{getCategoryText()}</div>

            <PhotoList
                category={category}
                onImageClick={openPreview}
                onAddPhotosClick={() => setShowAddPhotosPopup(true)}
            />

            {showAddPhotosPopup && (
                <AddPhotosPopup
                    onClose={() => setShowAddPhotosPopup(false)}
                    actualCategory={category}
                    setToastInfo={setToastInfo}
                    fetchPhotosData={updatePhotosData}
                    onPhotoAdded={handlePhotoAdded}
                />
            )}

            {previewImage && (
                <ImagePreviewOverlay
                    image={previewImage}
                    onNavigate={navigateGallery}
                    onClose={closePreview}
                />
            )}

            <Toast
                message={toastInfo.message}
                type={toastInfo.type}
                isVisible={toastInfo.isVisible}
                onClose={() => setToastInfo(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default PhotoScreen;
