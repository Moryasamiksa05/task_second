import { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import ImageGallery from './ImageGallery';
import './App.css';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('images')) || [];
    setImages(stored);
  }, []);

  const handleUpload = (newImages) => {
    const updated = [...images, ...newImages];
    setImages(updated);
    localStorage.setItem('images', JSON.stringify(updated));
  };

  return (
    <div className="app">
      <ImageUploader onUpload={handleUpload} />
      <ImageGallery images={images} />
    </div>
  );
}

export default App;
