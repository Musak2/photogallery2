// components/AddCategoryPopup.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const AddCategoryPopup = ({ onClose, setToastInfo, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');

  const postCategory = (categoryName) => {
    fetch('http://api.programator.sk/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: categoryName })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // Handle specific error codes
        switch (response.status) {
          case 400:
            throw new Error('Invalid request');
          case 409:
            throw new Error('Gallery with this name already exists');
          case 500:
            throw new Error('Unknown error');
          default:
            throw new Error('Failed to add category');
        }
      }
    })
    .then(data => {
      console.log('Successfully added a category:', data);
      onCategoryAdded();
      setToastInfo({
        message: 'Successfully added a category!',
        type: 'success',
        isVisible: true
      });
      onClose();
    })
    .catch(error => {
      console.error('Error:', error);
      setToastInfo({
        message: error.message, // Use the specific error message thrown earlier
        type: 'error',
        isVisible: true
      });
    });
  };

  const handleAddCategory = () => {
    postCategory(categoryName);
  };

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="popup-box" onClick={e => e.stopPropagation()} style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3>Pridať kategóriu</h3>
          <span style={{ cursor: 'pointer', fontSize: '30px' }} onClick={onClose}>x</span>
        </div>
        <TextField
          label="Názov kategórie"
          variant="outlined"
          fullWidth
          className='textfield'
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
        />
        <div style={{ paddingTop: '40px' }}>
          <button type="submit" style={{ height: '60px' }} onClick={handleAddCategory}>Pridať</button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPopup;
