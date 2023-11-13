// components/AddPhotosPopup.js
import React, { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const AddPhotosPopup = ({ onClose, actualCategory, setToastInfo, fetchPhotosData }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImageNames, setSelectedImageNames] = useState([]);
    const [dragging, setDragging] = useState(false);

    const postImages = () => {
        const formData = new FormData();
        for (let i = 0; i < selectedImages.length; i++) {
            formData.append(`image${i + 1}`, selectedImages[i]);
        }

        const uploadUrl = `http://api.programator.sk/gallery/${encodeURIComponent(actualCategory)}`;
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

    return (
        <div className="preview-overlay" onClick={onClose}>
            <div className="popup-box2" onClick={e => e.stopPropagation()} style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3>Pridať fotky</h3>
                    <span style={{ cursor: 'pointer', fontSize: '30px' }} onClick={onClose}>x</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingBottom: '60px',
                        border: dragging ? 'dashed 3px #000000' : 'dashed 1px #DDDDDD'
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setDragging(false);
                    }}
                    onDrop={handleDrop}
                >
                    <AddPhotoAlternateIcon color="black" fontSize="large" style={{ paddingBottom: '20px', paddingTop: '20px' }} />
                    <div className="addBoxText" style={{ textAlign: 'center', paddingBottom: '20px' }}>Sem presuňte fotky</div>
                    <div className="addBoxMiddleText" style={{ textAlign: 'center', paddingBottom: '20px' }}>alebo</div>
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <div
                        className="addBoxText2"
                        style={{ width: '130px', paddingTop: '5px', paddingBottom: '5px', textAlign: 'center', border: 'solid', borderWidth: '2px', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => document.getElementById('fileInput').click()}
                    >Vyberte súbory</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {selectedImageNames.map((name, index) => (
                            <div key={index}>{name}</div>
                        ))}
                    </div>
                </div>
                <div style={{ paddingTop: '10px' }}>
                    <button
                        type="submit"
                        style={{ height: '60px' }}
                        onClick={() => { postImages(); setSelectedImageNames([]); }}
                    >Pridať</button>
                </div>
            </div>
        </div>
    );
};

export default AddPhotosPopup;