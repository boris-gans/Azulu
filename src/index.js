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
    // Add connection preload hint
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preconnect';
    preloadLink.href = new URL(img.src, window.location.origin).origin;
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
    
    if (asset.priority === 'highest') {
      img.fetchPriority = 'high';
      img.loading = 'eager';
      img.decoding = 'sync';
    } else {
      img.loading = 'lazy';
      img.decoding = 'async';
      // Use Intersection Observer for non-critical assets
      if ('IntersectionObserver' in window && asset.priority === 'low') {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = asset.src;
              observer.disconnect();
            }
          });
        }, {
          rootMargin: '50px 0px', // Start loading 50px before entering viewport
          threshold: 0.01
        });
        observer.observe(img);
      }
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
      resolve(asset.src);
    };

    // Enhanced preload for highest priority images
    if (asset.priority === 'highest') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = asset.src;
      link.type = 'image/webp';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      // Add connection preload hint
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = new URL(asset.src, window.location.origin).origin;
      document.head.appendChild(preconnectLink);
    }

    if (!('IntersectionObserver' in window) || asset.priority !== 'low') {
      img.src = asset.src;
    }
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
    // Load remaining high priority assets in chunks
    const remainingHighPriority = criticalAssets.filter(asset => 
      asset.src !== '/assets/images/Hero.webp' && 
      asset.priority === 'high'
    );
    
    // Load in chunks of 3
    const chunkSize = 3;
    for (let i = 0; i < remainingHighPriority.length; i += chunkSize) {
      const chunk = remainingHighPriority.slice(i, i + chunkSize);
      await Promise.all(chunk.map(loadImage));
      // Small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Load non-critical assets with requestIdleCallback
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const nonCriticalLoading = [...nonCriticalAssets, ...iconAssets].map(src => 
          loadImage({ src, priority: 'low' })
        );
        Promise.all(nonCriticalLoading).catch(error => 
          console.warn('Non-critical assets loading error:', error)
        );
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        const nonCriticalLoading = [...nonCriticalAssets, ...iconAssets].map(src => 
          loadImage({ src, priority: 'low' })
        );
        Promise.all(nonCriticalLoading).catch(error => 
          console.warn('Non-critical assets loading error:', error)
        );
      }, 1000);
    }

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

