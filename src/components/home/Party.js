import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/components/Party.module.css';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

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
  
  // Preload image with a more efficient approach
  useEffect(() => {
    // Single preloading strategy to avoid duplicate efforts
    if (imageRef.current && !imageLoaded) {
      // Use native loading attribute on the image element
      imageRef.current.onload = () => {
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
        if (imageRef.current) {
          imageRef.current.onload = null;
        }
        clearTimeout(fallbackTimer);
      };
    }
  }, [imageControls, cardControls, brandingControls, imageLoaded, inView]);
  
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
      {/* Red accent bar positioned independently - simplified animation */}
      <motion.div 
        className={styles.redAccentBar}
        initial={{ height: 0 }}
        animate={imageControls}
        variants={{
          hidden: { height: 0 },
          visible: { 
            height: "100%",
            transition: { duration: 0.3, ease: "easeOut", delay: 0.1 } // Reduced delay and duration
          }
        }}
        style={{ willChange: 'height' }} // Add will-change for GPU acceleration
      ></motion.div>
      
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
          <motion.img 
            ref={imageRef}
            initial="hidden"
            animate={imageControls}
            variants={childVariants}
            src={`https://res.cloudinary.com/dsjkhhpbl/image/upload/party-crowd_kgnwom`} 
            alt="Party crowd" 
            className={styles.partyImage}
            loading="eager" 
            fetchpriority="high"
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              willChange: 'opacity, transform' // Explicitly mark properties that will change
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