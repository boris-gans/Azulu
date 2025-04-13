import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/Hero.module.css';

// Export the video ID and URL for preloading
export const HERO_VIDEO_ID = '20241021_HERO_VID';
export const HERO_VIDEO_URL = `https://res.cloudinary.com/dg5vgikh5/video/upload/v1744573660/${HERO_VIDEO_ID}`;

function Hero() {
  const bannerRef = useRef(null);
  const logoRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [bannerItems, setBannerItems] = useState(["LOADING..."]);
  
  // Get banner items from global content store
  useEffect(() => {
    if (window.azuluContent && window.azuluContent.movingBanner) {
      setBannerItems(window.azuluContent.movingBanner);
    }
  }, []);
  
  // Cloudinary video URL
  const cloudinaryVideoId = HERO_VIDEO_ID;

  // Handle video loading events
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Handle when enough of the video has loaded to play without buffering
      const handleCanPlay = () => {
        // console.log('Hero video can play now');
        setVideoLoaded(true);
      };
      
      // Set up event listeners
      videoElement.addEventListener('canplay', handleCanPlay);
      
      // If video is already loaded/cached
      if (videoElement.readyState >= 3) {
        setVideoLoaded(true);
      }
      
      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);
  
  useEffect(() => {
    // Create preconnect hint for Cloudinary
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://res.cloudinary.com'; // Connect to Cloudinary
    document.head.appendChild(preconnectLink);

    // Cleanup
    return () => {
      document.head.removeChild(preconnectLink);
    };
  }, []);

  // Banner animation
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    let animationId;
    let position = 0;
    const speed = 3.5;

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

  return (
    <div className={`${styles.heroContainer} ${styles.loaded}`}>
      <div className={styles.videoBackground}>
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className={styles.heroVideo}
          preload="auto"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
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

// Create a preload function that can be called before rendering
export const preloadHeroVideo = () => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    
    const source = document.createElement('source');
    source.src = HERO_VIDEO_URL;
    source.type = 'video/mp4';
    console.log(source.src)
    
    video.appendChild(source);
    
    // Handle successful loading
    const handleCanPlay = () => {
      // console.log('Hero video preloaded successfully');
      video.removeEventListener('canplay', handleCanPlay);
      resolve(true);
    };
    
    // Handle loading error - resolve anyway to not block the app
    const handleError = (err) => {
      console.warn('Error preloading hero video:', err);
      video.removeEventListener('error', handleError);
      resolve(false);
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Handle if already loaded from cache
    if (video.readyState >= 3) {
      handleCanPlay();
    }
    
    // Start loading
    video.load();
    
    // Set a timeout to prevent indefinite waiting
    setTimeout(() => {
      if (video.readyState < 3) {
        console.warn('Video preload timeout - continuing anyway');
        resolve(false);
      }
    }, 10000); // 10-second timeout
  });
};

export default Hero; 