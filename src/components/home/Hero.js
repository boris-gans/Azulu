import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/Hero.module.css';

function Hero() {
  const bannerRef = useRef(null);
  const logoRef = useRef(null);
  
  // Cloudinary image URL
  const cloudinaryImageUrl = 'https://res.cloudinary.com/dsjkhhpbl/image/upload/c_fill,w_800,h_600,q_auto,f_auto/Hero_uukgl4';
  
  useEffect(() => {
    // Create preload link
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = cloudinaryImageUrl; // Use Cloudinary URL instead
    preloadLink.type = 'image/webp';
    document.head.appendChild(preloadLink);

    // Create connection preload hint
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://res.cloudinary.com'; // Connect to Cloudinary
    document.head.appendChild(preconnectLink);

    // Preload image with high priority
    const img = new Image();
    img.src = cloudinaryImageUrl; // Use Cloudinary URL instead
    img.fetchPriority = 'high';
    img.decoding = 'async';

    const loadImage = async () => {
      try {
        if (img.decode) {
          await img.decode();
          document.documentElement.style.setProperty('--hero-image', `url(${img.src})`);
        }
      } catch (error) {
        console.error('Error decoding hero image:', error);
      }
    };

    if (img.complete) {
      loadImage();
    } else {
      img.onload = loadImage;
    }

    // Cleanup
    return () => {
      document.head.removeChild(preloadLink);
      document.head.removeChild(preconnectLink);
    };
  }, []);

  // Banner animation
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    let animationId;
    let position = 0;
    const speed = 0.5;

    const animate = () => {
      position -= speed;
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

  const bannerItems = [
    "MARCH 28 2025",
    "AZULU IS BACK",
    "AMSTERDAM"
  ];

  return (
    <div className={`${styles.heroContainer} ${styles.loaded}`}>
      <div className={styles.heroOverlay}>
        <div className={styles.logoContainer} ref={logoRef}>
          <img 
            src="/assets/icons/logoWhite.svg" 
            alt="Azulu Logo" 
            className={styles.logo}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </div>
      </div>
      <div className={styles.eventBannerWrapper}>
        <div className={styles.eventBanner} ref={bannerRef}>
          <div className={styles.bannerContent}>
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