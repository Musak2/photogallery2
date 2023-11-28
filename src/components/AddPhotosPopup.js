// components/AddPhotosPopup.js
import React, { useState, useEffect } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import './AddPhotosPopup.css';

const AddPhotosPopup = ({ onClose, actualCategory, setToastInfo, fetchPhotosData, onPhotoAdded }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImageNames, setSelectedImageNames] = useState([]);
    const [dragging, setDragging] = useState(false);

    const postImages = () => {
        console.log("Posted images: ", selectedImages);

        const formData = new FormData();
        for (let i = 0; i < selectedImages.length; i++) {
            formData.append(`image${i + 1}`, selectedImages[i]);
        }

        const uploadUrl = `http://api.programator.sk/gallery/${encodeURIComponent(actualCategory.text)}`;
        console.log('Uploading to:', uploadUrl);

        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    // Handling specific error codes
                    switch (response.status) {
                        case 400:
                            throw new Error('Invalid request - file not found.');
                        case 404:
                            throw new Error('Gallery not found');
                        case 500:
                            throw new Error('Unknown error');
                        default:
                            throw new Error('Failed to upload images');
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('Successfully uploaded images:', data);
                setSelectedImages([]); // Clear the selected images
                setToastInfo({
                    message: 'Successfully uploaded images!',
                    type: 'success',
                    isVisible: true
                });
                onClose();
                fetchPhotosData(actualCategory);
                onPhotoAdded();
            })
            .then(() => {
                console.log('Gallery data refreshed after image upload');
            })
            .catch(error => {
                console.error('Error:', error);
                setToastInfo({
                    message: error.message,
                    type: 'error',
                    isVisible: true
                });
            });
    };

    const handleFileSelect = (event) => {
        const files = event.target.files;
        console.log("Selected files: ", files)
        setSelectedImages(files);
        setSelectedImageNames(Array.from(files).map(file => file.name));
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const files = event.dataTransfer.files;
        setSelectedImages(files);
        setSelectedImageNames(Array.from(files).map(file => file.name));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    return (
        <div className="preview-overlay" onClick={onClose}>
            <div className="popup-box2" onClick={e => e.stopPropagation()}>
                <div className="popup-header">
                    <h3>Pridať fotky</h3>
                    <span className="close-button" onClick={onClose}>x</span>
                </div>
                <div
                    className={`drag-area ${dragging ? 'drag-area-dragging' : 'drag-area-default'}`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <AddPhotoAlternateIcon color="black" fontSize="large" className="icon-large" />
                    <div className="addBoxText">Sem presuňte fotky</div>
                    <div className="addBoxMiddleText">alebo</div>
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        onChange={handleFileSelect}
                        className="file-input"
                    />
                    <div
                        className="addBoxText2"
                        onClick={() => document.getElementById('fileInput').click()}
                    >Vyberte súbory</div>
                    {selectedImageNames.map((name, index) => (
                        <div key={index}>{name}</div>
                    ))}
                </div>
                <div className="submit-button-container">
                    <button className="submit-button" onClick={postImages}>Pridať</button>
                </div>
            </div>
        </div>
    );
};

export default AddPhotosPopup;