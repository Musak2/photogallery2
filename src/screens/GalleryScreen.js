import React, { useState, useEffect } from 'react';
import GalleryList from '../components/GalleryList';
import AddCategoryPopup from '../components/AddCategoryPopup';
import DeletePopup from '../components/DeletePopup';
import Toast from '../components/Toast';
import { fetchGalleryData, deleteGallery  } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const GalleryScreen = () => {
    const [boxes, setBoxes] = useState([]);
    const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
    const [categoryAdded, setCategoryAdded] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedGalleryForDeletion, setSelectedGalleryForDeletion] = useState(null);
    const [toastInfo, setToastInfo] = useState({
        message: '',
        type: 'success',
        isVisible: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        const refreshGalleryData = () => {
            fetchGalleryData().then(data => {
                setBoxes(data);
            }).catch(error => {
                console.error('Error fetching gallery data:', error);
            });
        };

        refreshGalleryData();
    }, [categoryAdded]);
    

    const handleCategoryClick = (category) => {
        console.log({ encodedCategory: encodeURIComponent(JSON.stringify(category.text)) });
        navigate('/photos', { state: { category } });
    };

    const handleDeleteClick = (galleryName) => {
        setSelectedGalleryForDeletion(galleryName);
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedGalleryForDeletion) return;
    
        try {
            await deleteGallery(selectedGalleryForDeletion);
            setToastInfo({ message: 'Gallery successfully deleted!', type: 'success', isVisible: true });
            setShowDeletePopup(false);
    
            // Fetch gallery data right after deletion
            const updatedData = await fetchGalleryData();
            setBoxes(updatedData);
        } catch (error) {
            setToastInfo({ message: error.message, type: 'error', isVisible: true });
        }
    };
    
    const refreshGalleryData = () => {
        fetchGalleryData().then(data => {
            setBoxes(data);
            console.log("Data refreshed:", data); // Log to confirm data refresh
        }).catch(error => {
            console.error('Error fetching gallery data:', error);
        });
    };

    return (
        <div className="App">
            <div className="fotogaleria-text">Fotogaléria</div>
            <div className="kategorie-text">Kategórie</div>

            <GalleryList
                boxes={boxes}
                onCategoryClick={handleCategoryClick}
                onAddCategoryClick={() => setShowAddCategoryPopup(true)}
                onDelete={handleDeleteClick}
            />

            {showAddCategoryPopup && (
                <AddCategoryPopup
                    onClose={() => setShowAddCategoryPopup(false)}
                    setToastInfo={setToastInfo}
                    onCategoryAdded={() => setCategoryAdded(prev => !prev)}
                />
            )}

            {showDeletePopup && (
                <DeletePopup
                    onClose={() => setShowDeletePopup(false)}
                    onConfirm={handleConfirmDelete}
                    setToastInfo={setToastInfo}
                    galleryName={selectedGalleryForDeletion}
                    onDeletionSuccess={refreshGalleryData}
                />
            )}

            <Toast
                message={toastInfo.message}
                type={toastInfo.type}
                isVisible={toastInfo.isVisible}
                onClose={() => setToastInfo(prev => ({ ...prev, isVisible: false }))}
                onClosed={fetchGalleryData}
            />
        </div>
    );
};

export default GalleryScreen;
