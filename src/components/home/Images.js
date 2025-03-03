import React, { useRef, useEffect } from 'react';
import styles from '../../styles/components/Images.module.css';

function Images() {
  const scrollContainerRef = useRef(null);
  
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
      publicId: 'Azulu_W-hotel-001_ugg2tl',
      alt: "Azulu at W Hotel"
    },
    {
      id: 2,
      publicId: 'Azulu_W-hotel-008_xwl03w',
      alt: "Azulu at W Hotel performance"
    },
    {
      id: 3,
      publicId: 'Azulu_W-hotel-047_a9z32q',
      alt: "Azulu event"
    },
    {
      id: 4,
      publicId: 'DSCF9414_gioiwg',
      alt: "Azulu performance"
    },
    {
      id: 5,
      publicId: 'DSCF9570_tplfue',
      alt: "Azulu event"
    },
    {
      id: 6,
      publicId: 'DSCF9647_i5zgxx',
      alt: "Azulu event"
    },
    {
      id: 7,
      publicId: 'Azulu_W-hotel-022_wvvwac',
      alt: "Azulu event"
    }
  ]);

  // Simplified URL generation using direct Cloudinary URL
  const getOptimizedUrl = (publicId) => {
    return `https://res.cloudinary.com/dsjkhhpbl/image/upload/c_fill,w_800,h_600,q_auto,f_auto/${publicId}`;
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let animationId;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= container.scrollWidth - container.clientWidth) {
        scrollPosition = 0;
      }
      container.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={styles.imagesContainer}>
      <div className={styles.topBar}></div>
      
      <div className={styles.imagesScrollContainer} ref={scrollContainerRef}>
        <div className={styles.imagesGrid}>
          {images.map((image, index) => (
            <div key={image.id} className={styles.imageWrapper}>
              <img 
                src={getOptimizedUrl(image.publicId)}
                alt={image.alt} 
                className={styles.artistImage}
                loading={index < 3 ? "eager" : "lazy"}
                width="800"
                height="600"
              />
            </div>
          ))}
          
          {/* Duplicate images */}
          {images.map((image) => (
            <div key={`dup-${image.id}`} className={styles.imageWrapper}>
              <img 
                src={getOptimizedUrl(image.publicId)}
                alt={image.alt} 
                className={styles.artistImage}
                loading="lazy"
                width="800"
                height="600"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.bottomBar}></div>
    </div>
  );
}

export default Images; 