import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { getOptimizedUrl } from './components/home/Images';

// Register the plugin
gsap.registerPlugin(MotionPathPlugin);

const LoadingScreen = ({ onHeroPreload }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  React.useEffect(() => {
    // Set up animation end detection
    const logoElement = document.querySelector('.loading-logo');
    logoElement?.addEventListener('animationend', () => {
      setAnimationComplete(true);
    });

    // Preload hero image
    const img = new Image();
    img.src = '/assets/images/Hero.avif';
    img.fetchPriority = 'high';
    img.decoding = 'async';
    
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/assets/images/Hero.avif';
    preloadLink.as = 'image';
    preloadLink.type = 'image/avif';
    document.head.appendChild(preloadLink);
    
    const preloadHero = async () => {
      try {
        if (img.decode) {
          await img.decode();
        }
        // Only trigger hero preload if animation is complete
        if (animationComplete) {
          onHeroPreload();
        }
      } catch (error) {
        console.error('Error preloading hero:', error);
        if (animationComplete) {
          onHeroPreload();
        }
      }
    };

    if (img.complete) {
      preloadHero();
    } else {
      img.onload = preloadHero;
    }

  }, [onHeroPreload, animationComplete]);

  // Watch for animation completion
  React.useEffect(() => {
    if (animationComplete) {
      onHeroPreload();
    }
  }, [animationComplete, onHeroPreload]);

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
          className="loading-logo"
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
  animateGrowLogo();
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

// Update the animateGrowLogo function with a more natural growth pattern
const animateGrowLogo = () => {
  const logo = document.querySelector('.grow-logo'); // Update selector to match your logo element
  
  if (!logo) return;
  
  // Set initial state
  gsap.set(logo, {
    scale: 0.2,
    opacity: 0,
    rotation: -8
  });
  
  // Create a natural "sprouting" effect
  const tl = gsap.timeline();
  
  // First movement: sprout up with a slight bounce
  tl.to(logo, {
    duration: 1.2,
    scale: 1,
    opacity: 1,
    y: -40,
    rotation: 0,
    ease: "elastic.out(1, 0.4)",
  })
  
  // Second movement: small spiral bloom effect
  .to(logo, {
    duration: 0.8,
    y: -90,
    scale: 1.15,
    ease: "power2.out",
    motionPath: {
      path: [
        {x: 0, y: 0},
        {x: 15, y: -15},
        {x: 5, y: -30},
        {x: -8, y: -40},
        {x: 0, y: -50}
      ],
      curviness: 1.6
    }
  })
  
  // Final settling with slight overshoot
  .to(logo, {
    duration: 0.7,
    scale: 1,
    ease: "back.out(1.7)",
    y: -70,
    onComplete: () => {
      // Add a subtle breathing effect
      gsap.to(logo, {
        scale: 1.03,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  });
};

// Enhanced preload function after animateGrowLogo
const preloadAllImages = async () => {
  // Now getOptimizedUrl is defined and can be used
  const criticalImages = [
    getOptimizedUrl('party-crowd_kgnwom')
  ];
  
  // Get gallery images if available
  const galleryImages = window.galleryImageIds || [];
  
  // Secondary images - include gallery images and other known images
  const secondaryImages = [
    ...galleryImages.map(id => getOptimizedUrl(id)),
    getOptimizedUrl('FataMorgana'),
    getOptimizedUrl('Benjaa'),
    getOptimizedUrl('Romy')
  ];
  
  console.log('Starting image preload...');
  
  try {
    // Load critical images first
    await Promise.all(criticalImages.map(src => preloadImage(src)));
    console.log('Critical images preloaded successfully');
    
    // Then load secondary images (non-blocking)
    Promise.all(secondaryImages.map(src => preloadImage(src)))
      .then(() => console.log('All secondary images preloaded successfully'))
      .catch(err => console.warn('Some secondary images failed to preload:', err));
      
    return true;
  } catch (err) {
    console.warn('Error preloading critical images:', err);
    // Continue anyway even if some images fail
    return true;
  }
};

// Modify the existing preloadHero function to use our new comprehensive preloader
const preloadHero = async () => {
  // ... existing code ...
  
  // Add call to comprehensive preloader
  await preloadAllImages();
  
  // ... rest of your existing code ...
};

// After animateGrowLogo function
// You can also trigger secondary preloading after the initial load is complete
const initializeSecondaryLoading = () => {
  // Preload remaining non-critical images after the app is interactive
  setTimeout(() => {
    const nonCriticalImages = [
      // Background images, decorative elements, etc.
      getOptimizedUrl('background-1'),
      getOptimizedUrl('decoration-1'),
      // Add more as needed
    ];
    
    // Preload in the background after app is interactive
    nonCriticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, 3000); // Delay to ensure main app is running smoothly first
};

