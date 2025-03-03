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
    img.decoding = 'async';
    
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/assets/images/Hero.webp';
    preloadLink.as = 'image';
    preloadLink.type = 'image/webp';
    document.head.appendChild(preloadLink);
    
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

    // Preload party-crowd
    const partyCrowdImg = new Image();
    partyCrowdImg.src = '/assets/images/party-crowd.webp';
    partyCrowdImg.loading = 'eager';
    partyCrowdImg.decoding = 'async';
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

// Switch to main app after hero is preloaded
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

// Add this after the existing imports
if ('chrome' in window) {
  // Optimize Chrome's rendering pipeline
  document.documentElement.classList.add('chrome');
  
  // Register performance observer
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.largestContentfulPaint > 2500) {
          // Optimize if LCP is too high
          document.body.style.contain = 'paint';
        }
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // Optimize resource hints
  const hints = [
    { rel: 'preconnect', href: window.location.origin },
    { rel: 'dns-prefetch', href: window.location.origin },
  ];

  hints.forEach(({ rel, href }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  });

  // Optimize paint timing
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      document.body.style.willChange = 'contents';
      requestAnimationFrame(() => {
        document.body.style.willChange = 'auto';
      });
    });
  }
}

