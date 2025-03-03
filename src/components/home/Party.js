import React, { useEffect, useState } from 'react';
import styles from '../../styles/components/Party.module.css';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

function Party() {
  // State to track if image is preloaded
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Create animation controls for different elements
  const imageControls = useAnimation();
  const cardControls = useAnimation();
  const brandingControls = useAnimation();
  const locationControls = useAnimation();
  
  // Set up intersection observers with lower thresholds for earlier triggering
  const [imageRef, imageInView] = useInView({ 
    threshold: 0.05,
    triggerOnce: true,
    rootMargin: "0px 0px -5% 0px"
  });
  const [cardRef, cardInView] = useInView({ 
    threshold: 0.05, 
    triggerOnce: true,
    rootMargin: "0px 0px -5% 0px" 
  });
  const [brandingRef, brandingInView] = useInView({ 
    threshold: 0.05, 
    triggerOnce: true,
    rootMargin: "0px 0px -5% 0px" 
  });
  // eslint-disable-next-line no-unused-vars
  const [locationRef, locationInView] = useInView({ 
    threshold: 0.05, 
    triggerOnce: true,
    rootMargin: "0px 0px -5% 0px" 
  });
  
  // Add reduced motion hook to respect user preferences
  const shouldReduceMotion = useReducedMotion();
  
  // Add image preloading with useEffect
  useEffect(() => {
    const preloadImages = () => {
      // The confirmed public ID
      const publicId = 'party-crowd_kgnwom';
      
      // Helper function to get optimized Cloudinary URL
      const getOptimizedUrl = (publicId) => {
          return `https://res.cloudinary.com/dsjkhhpbl/image/upload/f_auto,q_auto:good/${publicId}`;
        };
      
      // Create Image object to preload
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = getOptimizedUrl(publicId);
      });
    };
    
    // Start preloading
    preloadImages()
      .then(() => console.log('Party crowd image preloaded successfully'))
      .catch(err => console.warn('Error preloading party crowd image:', err));
      
  }, []); // Empty dependency array means this runs once on mount
  
  // Preload image as soon as component mounts
  useEffect(() => {
    // Preload the party crowd image with lower priority
    const img = new Image();
    img.src = `https://res.cloudinary.com/dsjkhhpbl/image/upload/f_auto,q_auto:good/party-crowd_kgnwom`;
    
    img.onload = () => {
      setImageLoaded(true);
      imageControls.start('visible');
    };
    
    const fallbackTimer = setTimeout(() => {
      if (!imageLoaded) {
        setImageLoaded(true);
        imageControls.start('visible');
      }
    }, 500);
    
    return () => {
      img.onload = null;
      img.onerror = null;
      clearTimeout(fallbackTimer);
    };
  }, [imageControls, imageLoaded]);
  
  // Trigger animations when elements come into view
  useEffect(() => {
    if (imageInView) imageControls.start('visible');
    if (cardInView) cardControls.start('visible');
    if (brandingInView) brandingControls.start('visible');
    if (locationInView) locationControls.start('visible');
  }, [imageInView, cardInView, brandingInView, locationInView, 
      imageControls, cardControls, brandingControls, locationControls]);

  // Optimized animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for smoother motion
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
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
    <div className={styles.partyContainer}>
      {/* Red accent bar positioned independently */}
      <motion.div 
        className={styles.redAccentBar}
        initial={{ height: 0 }}
        animate={imageControls}
        variants={{
          hidden: { height: 0 },
          visible: { 
            height: "100%",
            transition: { duration: 0.35, ease: "easeOut", delay: 0.15 }
          }
        }}
      ></motion.div>
      
      <div className={styles.partyContent}>
        {/* Azulu branding background */}
        <motion.div 
          ref={brandingRef}
          className={styles.azuluBranding}
          initial="hidden"
          animate={brandingControls}
          variants={containerVariants}
        >
          <div className={styles.azuluRepeated}>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
            <span className={styles.azuluRepeatedText}>AZULU.NL</span>
          </div>
        </motion.div>
        
        
        {/* Party image with overlay card */}
        <div className={styles.partyImageWrapper} ref={imageRef}>
          <motion.img 
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
              willChange: 'opacity, transform'
            }}
          />
          
          <link 
            rel="preload" 
            href="/assets/images/party-crowd.webp" 
            as="image" 
            type="image/webp"
            style={{ display: 'none' }}
          />
          
          {/* Overlay card with animation */}
          <motion.div 
            ref={cardRef}
            className={styles.partyOverlayCard}
            initial="hidden"
            animate={cardControls}
            variants={containerVariants}
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