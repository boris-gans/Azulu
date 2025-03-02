import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const LoadingScreen = ({ onHeroPreload }) => {
  // Preload the hero image during loading screen
  React.useEffect(() => {
    const img = new Image();
    img.src = '/assets/images/Hero.webp';
    img.fetchPriority = 'high';
    img.decoding = 'sync';
    
    const preloadHero = async () => {
      try {
        if (img.decode) {
          await img.decode();
        }
        onHeroPreload();
      } catch (error) {
        console.error('Error preloading hero:', error);
        onHeroPreload(); // Continue anyway
      }
    };

    if (img.complete) {
      preloadHero();
    } else {
      img.onload = preloadHero;
    }
  }, [onHeroPreload]);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
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
};

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
    // First, ensure Hero image is loaded
    const heroImage = criticalAssets.find(asset => 
      asset.src === '/assets/images/Hero.webp' && 
      asset.priority === 'highest'
    );
    
    if (heroImage) {
      await loadImage(heroImage);
    }

    // Then load remaining high priority assets
    const remainingHighPriority = criticalAssets.filter(asset => 
      asset.src !== '/assets/images/Hero.webp' && 
      asset.priority === 'high'
    );
    await Promise.all(remainingHighPriority.map(loadImage));

    // Load non-critical assets in parallel but don't wait for completion
    Promise.all([
      ...nonCriticalAssets.map(src => loadImage({ src, priority: 'low' })),
      ...iconAssets.map(src => loadImage({ src, priority: 'low' }))
    ]).catch(error => console.warn('Non-critical assets loading error:', error));
    
    // Add a small delay to ensure smooth transition
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error('Error preloading assets:', error);
    return false;
  }
};

// Render loading screen first
const root = ReactDOM.createRoot(document.getElementById('root'));

let heroPreloaded = false;
const handleHeroPreload = () => {
  heroPreloaded = true;
};

root.render(
  <React.StrictMode>
    <LoadingScreen onHeroPreload={handleHeroPreload} />
  </React.StrictMode>
);

// Then preload assets and switch to main app
preloadAssets().then(() => {
  // Only proceed if hero is preloaded
  if (!heroPreloaded) {
    const checkPreload = () => {
      if (heroPreloaded) {
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
      } else {
        setTimeout(checkPreload, 10);
      }
    };
    checkPreload();
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});

