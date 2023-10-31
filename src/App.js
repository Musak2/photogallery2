// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Box from './components/Box';
import TextField from '@mui/material/TextField';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';



function App() {
  const [boxes, setBoxes] = useState([]);
  const [viewingCategory, setViewingCategory] = useState(null);
  const maxBoxesInRow = 4;
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {

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

  }, []);

  const handleCategoryClick = (category) => {
    setViewingCategory(category);
  };

  const goBack = () => {
    setViewingCategory(null);
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
  };

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
              display: 'flex',  // Added this line
              flexDirection: 'column',
              justifyContent: 'center', // Added this line
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
                />
                <div style={{ paddingTop: '40px' }}>
                  <button type="submit" style={{ height: '60px' }}>Pridať</button>
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '60px', border: 'dashed', borderWidth: '1px', borderColor: '#DDDDDD'}}>
                    <AddPhotoAlternateIcon color="black" fontSize="large" style={{paddingBottom: '20px', paddingTop: '20px'}}/>
                    <div className="addBoxText" style={{ textAlign: 'center', paddingBottom: '20px' }}>Sem presuňte fotky</div>
                    <div className="addBoxMiddleText" style={{ textAlign: 'center', paddingBottom: '20px'  }}>alebo</div>
                    <div className="addBoxText" style={{width: '130px', paddingTop: '5px', paddingBottom: '5px', textAlign: 'center', border: 'solid', borderWidth: '2px', borderRadius: '4px' }}>Vyberte súbory</div>
                  </div>
                  <div style={{ paddingTop: '40px' }}>
                    <button type="submit" style={{ height: '60px' }}>Pridať</button>
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

    </div>
  );
}

export default App;
