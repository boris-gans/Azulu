import React, { useRef, useEffect } from 'react';
import styles from '../../styles/components/Images.module.css';

function Images() {
  const scrollContainerRef = useRef(null);
  
  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Array of DJ/artist images from your homepage grid folder
  const images = shuffleArray([
    {
      id: 1,
      src: "/assets/images/homepage grid/Azulu@W-hotel-001.webp",
      alt: "Azulu at W Hotel"
    },
    {
      id: 2,
      src: "/assets/images/homepage grid/Azulu@W-hotel-008.webp",
      alt: "Azulu at W Hotel performance"
    },
    {
      id: 3,
      src: "/assets/images/homepage grid/Azulu@W-hotel-047.webp",
      alt: "Azulu event"
    },
    {
      id: 4,
      src: "/assets/images/homepage grid/DSCF9414.webp",
      alt: "Azulu performance"
    },
    {
      id: 5,
      src: "/assets/images/homepage grid/DSCF9570.webp",
      alt: "Azulu event"
    },
    {
      id: 6,
      src: "/assets/images/homepage grid/DSCF9647.webp",
      alt: "Azulu event"
    }
  ]);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Adjust for faster/slower scrolling
    let animationId;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset when we've scrolled through all images
      if (scrollPosition >= container.scrollWidth - container.clientWidth) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    // Start scrolling
    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={styles.imagesContainer}>
      {/* Top black bar */}
      <div className={styles.topBar}></div>
      
      <div className={styles.imagesScrollContainer} ref={scrollContainerRef}>
        <div className={styles.imagesGrid}>
          {images.map((image) => (
            <div key={image.id} className={styles.imageWrapper}>
              <img 
                src={image.src} 
                alt={image.alt} 
                className={styles.artistImage}
              />
            </div>
          ))}
          
          {/* Duplicate the images to create a seamless loop */}
          {images.map((image) => (
            <div key={`dup-${image.id}`} className={styles.imageWrapper}>
              <img 
                src={image.src} 
                alt={image.alt} 
                className={styles.artistImage}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom black bar */}
      <div className={styles.bottomBar}></div>
    </div>
  );
}

export default Images; 