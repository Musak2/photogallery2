import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, isVisible, onClose, onClosed }) => {

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
                if (onClosed) onClosed();
            }, 5000); 

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, onClosed]);

    if (!isVisible) return null;

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
};

export default Toast;
