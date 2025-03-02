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
              height: auto;
            }
            to {
              width: 450px;
              height: auto;
            }
          }
        `}
      </style>
    </div>
  </div>
);

const criticalAssets = [
  {
    src: '/assets/images/Hero.webp',
    priority: 'highest'  // Custom priority level
  },
  // Other assets moved to secondary priority
  {
    src: '/assets/icons/logoWhite.svg',
    priority: 'high'
  },
  {
    src: '/assets/images/party-crowd.webp',
    priority: 'high'
  },
  {
    src: '/assets/images/FataMorgana.png',
    priority: 'high'
  },
  {
    src: '/assets/images/Benjaa.png',
    priority: 'high'
  },
  {
    src: '/assets/images/Romy.png',
    priority: 'high'
  },
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

const loadImage = (asset) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set loading attributes based on priority
    if (asset.priority === 'highest') {
      img.fetchPriority = 'high';
      img.loading = 'eager';
      img.decoding = 'sync';
    }

    img.onload = async () => {
      if (asset.priority === 'highest' && img.decode) {
        try {
          await img.decode();
        } catch {}
      }
      resolve(asset.src);
    };

    img.onerror = () => {
      console.warn(`Failed to load image: ${asset.src}`);
      resolve(asset.src); // Resolve anyway to prevent blocking
    };

    // Add preload link for highest priority image
    if (asset.priority === 'highest') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = asset.src;
      link.type = 'image/webp';
      document.head.appendChild(link);
    }

    img.src = asset.src;
  });
};

const preloadAssets = async () => {
  try {
    // First, load highest priority assets
    const highestPriorityAssets = criticalAssets.filter(asset => asset.priority === 'highest');
    await Promise.all(highestPriorityAssets.map(loadImage));

    // Then load high priority assets
    const highPriorityAssets = criticalAssets.filter(asset => asset.priority === 'high');
    await Promise.all(highPriorityAssets.map(loadImage));

    // Load non-critical assets in parallel but don't wait for completion
    Promise.all([
      ...nonCriticalAssets.map(src => loadImage({ src, priority: 'low' })),
      ...iconAssets.map(src => loadImage({ src, priority: 'low' }))
    ]).catch(error => console.warn('Non-critical assets loading error:', error));
    
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

