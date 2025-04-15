import React, { useEffect } from 'react';
import styles from '../../styles/components/Images.module.css';

function Images() {
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const images = shuffleArray([
    {
      id: 1,
      publicId: 'banner_1_m7kuhm',
      alt: "Azulu at W Hotel"
    },
    {
      id: 2,
      publicId: 'banner_2_qjlmml',
      alt: "Azulu at W Hotel performance"
    },
    {
      id: 3,
      publicId: 'banner_3_fwcqkx',
      alt: "Azulu event"
    },
    {
      id: 4,
      publicId: 'banner_4_szgwor',
      alt: "Azulu performance"
    },
    {
      id: 5,
      publicId: 'banner_5_zvxwn9',
      alt: "Azulu event"
    },
    {
      id: 6,
      publicId: 'banner_6_f3svxw',
      alt: "Azulu event"
    },
    {
      id: 7,
      publicId: 'banner_7_vdkcwm',
      alt: "Azulu event"
    }
  ]);

  // Simplified URL generation using direct Cloudinary URL
  const getOptimizedUrl = (publicId) => {
    return `https://res.cloudinary.com/dg5vgikh5/image/upload/c_fill,w_800,h_600,q_auto,f_auto/${publicId}`;
  }; //dsjkhhpbl
  // dg5vgikh5

  // Add a function to preload all images
  useEffect(() => {
    const preloadAllImages = () => {
      // Extract all publicIds from your images array
      const publicIds = images.map(image => image.publicId);
      
      // console.log('Preloading gallery images:', publicIds);
      
      // Use your existing getOptimizedUrl function
      const preloadPromises = publicIds.map(publicId => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(publicId);
          img.onerror = () => resolve(publicId); // Resolve anyway to not block
          img.src = getOptimizedUrl(publicId);
        });
      });
      
      // Preload all images in parallel
      Promise.all(preloadPromises)
        .then(() => console.log('All gallery images preloaded'))
        .catch(err => console.warn('Error preloading images:', err));
    };
    
    preloadAllImages();
  }, [images]); // Dependency on images array
  
  // Set images for potential global preloading
  window.galleryImageIds = images.map(image => image.publicId);

  return (
    <div className={styles.imagesContainer}>
      <div className={styles.topBar}></div>
      
      {/* Use CSS-based animation for a single row of images */}
      <div 
        className={styles.imagesScrollContainer}
        style={{ 
          pointerEvents: 'none', // Disable all pointer events
          userSelect: 'none' // Prevent text selection
        }}
      >
        {/* Single track with all images */}
        <div className={`${styles.imagesTrack} ${styles.animateTrack1}`}>
          {images.map((image, index) => (
            <div key={image.id} className={styles.imageWrapper}>
              <img 
                src={getOptimizedUrl(image.publicId)}
                alt={image.alt} 
                className={styles.artistImage}
                loading={index < 3 ? "eager" : "lazy"}
                width="800"
                height="600"
                draggable="false"
              />
            </div>
          ))}
          
          {/* Duplicate images in the same track for seamless looping */}
          {images.map((image) => (
            <div key={`dup-${image.id}`} className={styles.imageWrapper}>
              <img 
                src={getOptimizedUrl(image.publicId)}
                alt={image.alt} 
                className={styles.artistImage}
                loading="lazy"
                width="800"
                height="600"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.bottomBar}></div>
      
      {/* Add inline styles for the animation */}
      <style jsx="true">{`
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .${styles.animateTrack1} {
          animation: slideLeft 50s linear infinite;
        }
        
        /* Pause animations when reduced motion is preferred */
        @media (prefers-reduced-motion) {
          .${styles.animateTrack1} {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
}

export default Images; 