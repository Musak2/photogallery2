import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, isVisible, onClose, onClosed }) => {

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
                if (onClosed) onClosed();
            }, 3000); // Toast will disappear after 5 seconds

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
