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
  // Separate critical and non-critical assets
  const criticalAssets = [
    '/assets/icons/logoWhite.svg',
    '/assets/images/party-crowd.webp',
    '/assets/images/FataMorgana.png',
    '/assets/images/Hero.webp',
    '/assets/images/Benjaa.png',
    '/assets/images/Romy.png',
  ];

  const nonCriticalAssets = [
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
  ];

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        resolve(src); // Resolve anyway to prevent blocking
      };
    });
  };

  try {
    // Load critical assets first
    await Promise.all(criticalAssets.map(loadImage));
    
    // Load non-critical assets in parallel but don't wait for completion
    Promise.all([
      ...nonCriticalAssets.map(loadImage),
      ...iconAssets.map(loadImage)
    ]).catch(error => console.warn('Non-critical assets loading error:', error));
    
    return true;
  } catch (error) {
    console.error('Error preloading critical assets:', error);
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

