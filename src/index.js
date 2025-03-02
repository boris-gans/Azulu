import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const LoadingScreen = () => (
  <div style={{
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <img 
        src="/assets/icons/logoWhite.svg" 
        alt="Logo" 
        style={{
          width: '150px',
          marginBottom: '20px',
          animation: 'growLogo 2s ease-in-out forwards'
        }}
      />
      <style>
        {`
          @keyframes growLogo {
            from {
              width: 150px;
            }
            to {
              width: 450px;
            }
          }
        `}
      </style>
    </div>
  </div>
);

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

// Render loading screen first
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoadingScreen />
  </React.StrictMode>
);

// Then preload assets and switch to main app
preloadAssets().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

