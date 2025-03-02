import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/Hero.module.css';

function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const bannerRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/images/Hero.webp';
    
    if (img.complete) {
      setImageLoaded(true);
    } else {
      img.onload = () => setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Animation for smooth scrolling
    let animationId;
    let position = 0;
    const speed = 0.5; // Adjust speed as needed

    const animate = () => {
      position -= speed;
      // Reset position when first content is scrolled out of view
      if (position <= -50) {
        position = 0;
      }
      banner.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Create a single repeating content array
  const bannerItems = [
    "MARCH 28 2025",
    "AZULU IS BACK",
    "AMSTERDAM"
  ];

  return (
    <div className={`${styles.heroContainer} ${imageLoaded ? styles.loaded : ''}`}>
      <div className={styles.heroOverlay}>
        <div className={styles.logoContainer} ref={logoRef}>
          <img 
            src="/assets/icons/logoWhite.svg" 
            alt="Azulu Logo" 
            className={styles.logo}
            loading="eager"
            priority="true"
            decoding="sync"
          />
        </div>
      </div>
      <div className={styles.eventBannerWrapper}>
        <div className={styles.eventBanner} ref={bannerRef}>
          <div className={styles.bannerContent}>
            {/* Generate banner items with dots between each item */}
            {Array(8).fill(0).map((_, index) => (
              <React.Fragment key={index}>
                {bannerItems.map((item, itemIndex) => (
                  <React.Fragment key={`${index}-${itemIndex}`}>
                    <div className={styles.bannerItem}>{item}</div>
                    <img src="/assets/icons/Dot.svg" alt="•" className={styles.bannerDot} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero; 