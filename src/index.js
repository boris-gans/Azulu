import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { animate } from 'framer-motion';
import { PARTY_IMAGE_URL, PARTY_IMAGE_LOW_QUALITY_URL } from './components/home/Party';

// Global content store
window.azuluContent = {
  movingBanner: ["MARCH 28 2025", "AZULU IS BACK", "AMSTERDAM"], // Default values
  aboutPage: "" // Will be populated from API
};

// Function to fetch content from API
const fetchContent = async () => {
  try {
    console.log('Fetching content from API...');
    const response = await fetch('https://azulucms.onrender.com');
    
    if (!response.ok) {
      throw new Error(`Content API error: ${response.status}`);
    }
    
    const contentData = await response.json();
    console.log('Content loaded successfully');
    
    // Parse and store content data
    contentData.forEach(item => {
      if (item.key === 'movingBanner' && item.string_collection && item.string_collection.length > 0) {
        window.azuluContent.movingBanner = item.string_collection;
      }
      else if (item.key === 'aboutPage' && item.big_string) {
        window.azuluContent.aboutPage = item.big_string;
      }
    });
    
    return true;
  } catch (err) {
    console.error('Error fetching content:', err);
    // Keep default values on error
    return false;
  }
};

// No need for plugin registration with Framer Motion

const LoadingScreen = ({ onHeroPreload }) => {
  const [animationComplete, setAnimationComplete] = React.useState(false);

  React.useEffect(() => {
    // Set up animation end detection
    const logoElement = document.querySelector('.loading-logo');
    logoElement?.addEventListener('animationend', () => {
      setAnimationComplete(true);
    });

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
let contentLoaded = false;

const handleHeroPreload = () => {
  heroPreloaded = true;
  animateGrowLogo();
};

// Initialize the app
const initApp = async () => {
  // Fetch content in parallel with other loading
  contentLoaded = await fetchContent();
  
  // Continue with existing preload logic
  // ...
};

// Start initialization
initApp();

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

// Update the animateGrowLogo function with Framer Motion
const animateGrowLogo = () => {
  const logo = document.querySelector('.grow-logo'); // Update selector to match your logo element
  
  if (!logo) return;
  
  // Set initial state
  logo.style.transform = 'scale(0.2) rotate(-8deg)';
  logo.style.opacity = '0';
  
  // Create a natural "sprouting" effect using Framer Motion's animate function
  
  // First movement: sprout up with a slight bounce
  animate(logo, {
    scale: 1,
    opacity: 1,
    y: -40,
    rotate: 0
  }, {
    duration: 1.2,
    type: "spring",
    stiffness: 100,
    damping: 10
  }).then(() => {
    // Second movement: small spiral bloom effect
    const path = [
      {x: 0, y: 0},
      {x: 15, y: -15},
      {x: 5, y: -30},
      {x: -8, y: -40},
      {x: 0, y: -50}
    ];
    
    // Animate along path
    let i = 0;
    const pathAnimation = setInterval(() => {
      if (i >= path.length) {
        clearInterval(pathAnimation);
        
        // Final settling with slight overshoot
        animate(logo, {
          scale: 1,
          y: -70
        }, {
          duration: 0.7,
          type: "spring",
          stiffness: 200,
          damping: 15,
          onComplete: () => {
            // Add a subtle breathing effect
            animate(logo, 
              { scale: 1.03 }, 
              { 
                duration: 2.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }
            );
          }
        });
      } else {
        animate(logo, {
          x: path[i].x,
          y: path[i].y - 90, // Adjust for the -90 in the original
          scale: i === path.length - 1 ? 1.15 : 1 + (i * 0.03)
        }, {
          duration: 0.2,
          ease: "easeOut"
        });
        i++;
      }
    }, 160); // Distribute the 0.8s over the path points
  });
};

// Define getOptimizedUrl in index.js directly
const getOptimizedUrl = (publicId) => {
  const cloudName = 'dsjkhhpbl'; // Replace with your actual Cloudinary cloud name
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:good/${publicId}`;
};

// Define the preloadImage function
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(`Failed to load image: ${src}`);
    img.src = src;
  });
};

// Define preloadAllImages function
const preloadAllImages = async () => {
  // Critical images that should load first
  const criticalImages = [
    PARTY_IMAGE_URL, // Use the exported constant directly
    getOptimizedUrl('image_copy_3_ktk8k2'),
    getOptimizedUrl('image_copy_4_wyul9v'),
    getOptimizedUrl('image_copy_5_yq0z0y')
  ];

  // Add link preload tags for all critical images
  criticalImages.forEach(src => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.href = src;
    linkElement.as = 'image';
    document.head.appendChild(linkElement);
  });
  
  console.log('Starting image preload...');
  
  try {
    // Load critical images
    await Promise.all(criticalImages.map(src => preloadImage(src)));
    
    // Also preload the low quality image for blur-up effect
    await preloadImage(PARTY_IMAGE_LOW_QUALITY_URL);
    
    console.log('Critical images preloaded successfully');
    return true;
  } catch (err) {
    console.warn('Error preloading critical images:', err);
    return true;
  }
};

// Modify your existing preloadHero function
const preloadHero = async () => {
  // Your existing code...
  
  // Call preloadAllImages
  await preloadAllImages();
  
  // Rest of your existing code...
};

// Option B: Export it so it can be used elsewhere
export { preloadHero };


