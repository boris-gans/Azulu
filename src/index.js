import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const preloadAssets = async () => {
  const imageAssets = [
    '/assets/images/Benjaa.png',
    '/assets/images/FataMorgana.png',
    '/assets/images/Hero.jpg',
    '/assets/images/Romy.png',
    '/assets/images/party-crowd.webp',
    '/assets/images/homepage grid/Azulu@W-hotel-001.webp',
    '/assets/images/homepage grid/Azulu@W-hotel-008.webp',
    '/assets/images/homepage grid/Azulu@W-hotel-047.webp',
    '/assets/images/homepage grid/DSCF9414.webp',
    '/assets/images/homepage grid/DSCF9570.webp',
    '/assets/images/homepage grid/DSCF9647.webp',
  ];

  const iconAssets = [
    '/assets/icons/Amsterdam.svg',
    '/assets/icons/Dot.svg',
    '/assets/icons/logoBlack.svg',
    '/assets/icons/logoWhite.png',
    '/assets/icons/logoWhite.svg',
  ];

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject(`Failed to load image: ${src}`);
    });
  };

  try {
    await Promise.all([
      ...imageAssets.map(loadImage),
      ...iconAssets.map(loadImage)
    ]);
    return true;
  } catch (error) {
    console.error('Error preloading assets:', error);
    return false;
  }
};

// Preload assets before rendering the app
preloadAssets().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

