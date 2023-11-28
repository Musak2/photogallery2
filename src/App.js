import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalleryScreen from './screens/GalleryScreen';
import PhotoScreen from './screens/PhotoScreen';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<GalleryScreen />} />
          <Route path="/photos" element={<PhotoScreen />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
