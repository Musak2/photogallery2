import React, { useEffect } from 'react';
import './DeletePopup.css';
import { deleteGallery } from '../services/apiService';

const DeletePopup = ({ onClose, galleryName, setToastInfo, onDeletionSuccess }) => {

    const handleDelete = () => {
        deleteGallery(galleryName)
            .then(() => {
                setToastInfo({
                    message: 'Gallery successfully deleted!',
                    type: 'success',
                    isVisible: true
                });
                onClose();
                if (onDeletionSuccess) {
                    onDeletionSuccess();
                }
            })
            .catch(error => {
                setToastInfo({
                    message: error.message,
                    type: 'error',
                    isVisible: true
                });
            });
    };

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [onClose]);

    return (
        <div className="preview-overlay" onClick={onClose}>
            <div className="delete-popup-box" onClick={e => e.stopPropagation()}>
                <div className="popup-header">
                    <h3>Ste si istý?</h3>
                    <span className="close-button" onClick={onClose}>x</span>
                </div>
                <div className="popup-content">
                    <p>Vážne chcete vymazať galériu "{galleryName}"?</p>
                </div>
                <div className="popup-actions">
                    <button className="submit-button2" onClick={handleDelete}>Áno</button>
                    <button className="cancel-button2" onClick={onClose}>Nie</button>
                </div>
            </div>
        </div>
    );
};

export default DeletePopup;
