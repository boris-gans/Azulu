import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/components/Party.module.css';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

// Export the image URLs for preloading
export const PARTY_IMAGE_URL = "https://res.cloudinary.com/dsjkhhpbl/image/upload/q_auto,f_auto,w_1200/party-crowd_kgnwom";
export const PARTY_IMAGE_LOW_QUALITY_URL = "https://res.cloudinary.com/dsjkhhpbl/image/upload/q_10,f_auto,w_50,e_blur:1000/party-crowd_kgnwom";

function Party() {
  // State to track if image is preloaded
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  
  // Create animation controls for different elements
  const imageControls = useAnimation();
  const cardControls = useAnimation();
  const brandingControls = useAnimation();
  
  // Set up intersection observers with higher thresholds for better performance
  // Use refs instead of multiple observers for better performance
  const [rootRef, inView] = useInView({ 
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "0px 0px -10% 0px"
  });
  
  // Add reduced motion hook to respect user preferences
  const shouldReduceMotion = useReducedMotion();
  
  // Define image URL and optimization parameters
  const imageUrl = PARTY_IMAGE_URL;
  const lowQualityImageUrl = PARTY_IMAGE_LOW_QUALITY_URL;
  
  // Enhanced preloading strategy
  useEffect(() => {
    // Check if the image is already loaded (could be preloaded during initial load)
    const checkIfAlreadyLoaded = () => {
      const cachedImage = new Image();
      cachedImage.src = imageUrl;
      
      // If image is already in browser cache, we can consider it loaded
      if (cachedImage.complete) {
        setImageLoaded(true);
        if (inView) {
          imageControls.start('visible');
          cardControls.start('visible');
          brandingControls.start('visible');
        }
        return true;
      }
      return false;
    };
    
    // If not already loaded/cached, set up loading
    if (!checkIfAlreadyLoaded()) {
      // Preload the high-quality image
      const preloadImage = new Image();
      preloadImage.src = imageUrl;
      
      // Once the high-quality image is loaded, update state
      preloadImage.onload = () => {
        setImageLoaded(true);
        
        // Start all animations at once for better performance
        if (inView) {
          imageControls.start('visible');
          cardControls.start('visible');
          brandingControls.start('visible');
        }
      };
      
      // Set a fallback timer in case image loading takes too long
      const fallbackTimer = setTimeout(() => {
        if (!imageLoaded) {
          setImageLoaded(true);
          
          // Start animations if in view
          if (inView) {
            imageControls.start('visible');
            cardControls.start('visible');
            brandingControls.start('visible');
          }
        }
      }, 800);
      
      return () => {
        preloadImage.onload = null;
        clearTimeout(fallbackTimer);
      };
    }
  }, [imageControls, cardControls, brandingControls, imageLoaded, inView, imageUrl]);
  
  // Trigger animations when elements come into view - simplified approach
  useEffect(() => {
    if (inView) {
      imageControls.start('visible');
      cardControls.start('visible');
      brandingControls.start('visible');
    }
  }, [inView, imageControls, cardControls, brandingControls]);

  // Optimized animation variants - simplified for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3, // Reduced from 0.4
        ease: "easeOut", // Simplified easing
        when: "beforeChildren",
        staggerChildren: 0.05 // Reduced from 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 }, // Reduced y-offset
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.2, // Reduced from 0.3
        ease: "easeOut"
      }
    }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    tap: { 
      backgroundColor: "#990000",
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className={styles.partyContainer} ref={rootRef}>
      {/* Red accent bar - using CSS instead of motion */}
      <div 
        className={styles.redAccentBar}
        style={{ willChange: 'height' }}
      ></div>
      
      <div className={styles.partyContent}>
        {/* Azulu branding background - simplified animation */}
        <motion.div 
          className={styles.azuluBranding}
          initial="hidden"
          animate={brandingControls}
          variants={containerVariants}
          style={{ willChange: 'opacity' }} // Add will-change for GPU acceleration
        >
          <div className={styles.azuluRepeated}>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
          </div>
        </motion.div>
        
        {/* Party image with overlay card - simplified animation */}
        <div className={styles.partyImageWrapper}>
          {/* Background blur-up image */}
          {!imageLoaded && (
            <img 
              src={lowQualityImageUrl}
              alt="" 
              aria-hidden="true"
              className={styles.partyImage}
              style={{ 
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
        
          <motion.img 
            ref={imageRef}
            initial="hidden"
            animate={imageControls}
            variants={childVariants}
            src={imageUrl} 
            alt="Party crowd" 
            className={styles.partyImage}
            width="1200"
            height="800"
            loading="eager" 
            fetchpriority="high"
            decoding="async"
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              willChange: 'opacity, transform', // Explicitly mark properties that will change
              objectFit: 'cover'
            }}
          />
          
          {/* Overlay card with animation - simplified */}
          <motion.div 
            className={styles.partyOverlayCard}
            initial="hidden"
            animate={cardControls}
            variants={containerVariants}
            style={{ willChange: 'opacity, transform' }} // Add will-change for GPU acceleration
          >
            <div className={styles.cardContent}>
              <h2 className={styles.partyTitle}>
                A PARTY LIKE NOTHING YOU'VE SEEN
              </h2>
              <p className={styles.partyDescription}>
                At Azulu music hits harder, the energy stays higher, and the party never stops. We bring the best artists, the wildest vibes, and a crowd that knows how to move.
              </p>
              <div className={styles.partyAction}>
                <span className={styles.partyLink}>
                  SEE WHERE WE'RE GOING NEXT
                </span>
                <Link to="/events" className={styles.linkWrapper}>
                  <motion.div
                    className={styles.button}
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span className={styles.arrowIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 19L19 5M19 5H12M19 5V12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Party; 