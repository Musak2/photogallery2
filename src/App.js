// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Box from './components/Box';
import Toast from './components/Toast';
import TextField from '@mui/material/TextField';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [viewingCategory, setViewingCategory] = useState(null);
  const maxBoxesInRow = 4;
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [actualCategory, setActualCategory] = useState(null);
  const [selectedImageNames, setSelectedImageNames] = useState([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {

    fetchGalleryData();

  }, []);

  const fetchGalleryData = () => {
    fetch('http://api.programator.sk/gallery')
      .then(response => response.json())
      .then(data => {
        if (!data || !data.galleries) {
          console.error("Unexpected data structure:", data);
          return;
        }

        const mappedData = data.galleries.map((gallery, index) => ({
          id: index,
          text: decodeURIComponent(gallery.name),
          mainImage: gallery.image ? `http://api.programator.sk/images/300x200/${gallery.image.fullpath}` : null,
          relatedImages: [],
          numberOfImages: 0
        }));

        return Promise.all(
          mappedData.map((box) => {

            if (!box.mainImage) {
              return Promise.resolve(box);
            }

            const encodedCategory = encodeURIComponent(box.text);
            return fetch(`http://api.programator.sk/gallery/${encodedCategory}`)
              .then(response => {
                if (!response.ok) {
                  console.error(`Failed to fetch related images for ${box.text}, status: ${response.status}`);
                  return box;
                }
                return response.json();
              })
              .then(data => {
                if (data && data.images) {
                  box.relatedImages = data.images.map(image => `http://api.programator.sk/images/0x0/${image.fullpath}`);
                  box.numberOfImages = data.images.length;
                }
                return box;
              });
          })
        );
      })
      .then(updatedBoxes => {
        if (updatedBoxes) {
          setBoxes(updatedBoxes);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

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
    const fullSizeImageUrl = `http://api.programator.sk/images/0x0/${category}/${imageName}`;
    setCurrentImageIndex(index);
    setPreviewImage(fullSizeImageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const navigateGallery = (direction) => {

    if (!viewingCategory || !viewingCategory.relatedImages) return;

    // console.log("Current Image Index:", currentImageIndex);
    // console.log("Viewing Category Related Images Length:", viewingCategory.relatedImages.length);
    // console.log("Type of currentImageIndex:", typeof currentImageIndex);
    // console.log("Type of viewingCategory.relatedImages.length:", typeof viewingCategory.relatedImages.length);

    if (isNaN(currentImageIndex) || isNaN(viewingCategory.relatedImages.length)) {
      console.error("Either currentImageIndex or relatedImages.length is not a number.");
      return;
    }

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

  const handleBoxClick = () => {
    setShowPopup(true);  // Show the popup when the box is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup
    setSelectedImageNames([]);    
  };

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
        setShowPopup(false);
        setToastInfo({
          message: 'Successfully added a category!',
          type: 'success',
          isVisible: true
        });
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


  const postImages = () => {
    // FormData to handle the file uploads.
    const formData = new FormData();

    // Append each image with a unique name
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append(`image${i + 1}`, selectedImages[i]);
    }

    fetch(`http://api.programator.sk/gallery/${encodeURIComponent(actualCategory)}`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          // Handle specific error codes
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
      })
      .then(data => {
        console.log('Successfully uploaded images:', data);
        setShowPopup(false);
        setSelectedImages([]);  // Clear the selected images
        setToastInfo({
          message: 'Successfully uploaded images!',
          type: 'success',
          isVisible: true
        });
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

      {/* If not viewing a specific category, show all categories */}
      {!viewingCategory && (
        <>
          {boxes.map((box, index) => {
            return (
              <Box
                key={box.id}
                top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
                left={304 + (index % maxBoxesInRow) * (304 + 32)}
                text={box.text}
                mainImage={box.mainImage}
                onClick={() => { handleCategoryClick(box); }}
                imageCount={box.numberOfImages}
              />
            );
          })}

          <div
            className="box"
            style={{
              top: `${225 + Math.floor(boxes.length / maxBoxesInRow) * (295 + 32)}px`,
              left: `${304 + (boxes.length % maxBoxesInRow) * (304 + 32)}px`,
              cursor: 'pointer',
              display: 'flex',  
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
            }}
            onClick={handleBoxClick}
          >
            <div className="plus-symbol" style={{ display: 'flex', fontSize: '24px', justifyContent: 'center', alignItems: 'center' }}>
            </div>
            <div className="addText" style={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Pridať kategóriu
            </div>
          </div>

          {showPopup && (
            <div className="preview-overlay" onClick={handleClosePopup}>
              <div className="popup-box" onClick={e => e.stopPropagation()} style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h3>Pridať kategóriu</h3>
                  <span style={{ cursor: 'pointer', fontSize: '30px', }} onClick={handleClosePopup}>x</span>
                </div>
                <TextField
                  label="Názov kategórie"
                  variant="outlined"
                  fullWidth
                  className='textfield'
                  onChange={e => setCategoryName(e.target.value)}
                />
                <div style={{ paddingTop: '40px' }}>
                  <button type="submit" style={{ height: '60px' }} onClick={handleAddCategory}>Pridať</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* If viewing a specific category, show its images */}
      {
        viewingCategory && (
          <>
            {viewingCategory.relatedImages.map((image, index) => (
              <Box
                key={index}
                top={225 + Math.floor(index / maxBoxesInRow) * (295 + 32)}
                left={304 + (index % maxBoxesInRow) * (304 + 32)}
                mainImage={image}
                onClick={() => openPreview(viewingCategory.text, image.split('/').pop(), index)}
              />
            ))}

            <div
              className="box"
              style={{
                top: `${225 + Math.floor(viewingCategory.relatedImages.length / maxBoxesInRow) * (295 + 32)}px`,
                left: `${304 + (viewingCategory.relatedImages.length % maxBoxesInRow) * (304 + 32)}px`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={handleBoxClick}
            >
              <div className="plus-symbol" style={{ display: 'flex', fontSize: '24px', justifyContent: 'center', alignItems: 'center' }}>
              </div>
              <div className="addText" style={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Pridať fotky
              </div>
            </div>

            {showPopup && (
              <div className="preview-overlay" onClick={handleClosePopup}>
                <div className="popup-box2" onClick={e => e.stopPropagation()} style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3>Pridať fotky</h3>
                    <span style={{ cursor: 'pointer', fontSize: '30px', }} onClick={handleClosePopup}>x</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingBottom: '60px',
                      border: dragging ? 'dashed 3px #000000' : 'dashed 1px #DDDDDD' // Change style based on dragging state
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
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);  
                      const files = e.dataTransfer.files;
                      setSelectedImages(files);
                      const fileNames = Array.from(files).map(file => file.name);
                      setSelectedImageNames(fileNames);
                    }}
                  >
                    <AddPhotoAlternateIcon color="black" fontSize="large" style={{ paddingBottom: '20px', paddingTop: '20px' }} />
                    <div className="addBoxText" style={{ textAlign: 'center', paddingBottom: '20px' }}>Sem presuňte fotky</div>
                    <div className="addBoxMiddleText" style={{ textAlign: 'center', paddingBottom: '20px' }}>alebo</div>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      onChange={e => {
                        setSelectedImages(e.target.files);
                        // Extract file names and update the state
                        const fileNames = Array.from(e.target.files).map(file => file.name);
                        setSelectedImageNames(fileNames);
                      }}
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
                      onClick={() => {postImages(); setSelectedImageNames([]);}}
                    >Pridať</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      {/* Simple image preview */}
      {previewImage && (
        <div className="preview-overlay" onClick={closePreview}>
          <div className="navigation-circle" style={{ left: '10%' }} onClick={(e) => { e.stopPropagation(); navigateGallery('prev'); }}>
            ←
          </div>
          <img className="preview-image" src={previewImage} alt="Full Preview" />
          <div className="navigation-circle" style={{ right: '10%' }} onClick={(e) => { e.stopPropagation(); navigateGallery('next'); }}>
            →
          </div>
        </div>
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
}

export default App;
