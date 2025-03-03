import React, { useEffect, useState } from 'react';
import styles from '../../styles/components/Party.module.css';
import { motion, useAnimation } from 'framer-motion';
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
  const [locationRef, locationInView] = useInView({ 
    threshold: 0.05, 
    triggerOnce: true,
    rootMargin: "0px 0px -5% 0px" 
  });
  
  // Preload image as soon as component mounts
  useEffect(() => {
    const img = new Image();
    img.src = "https://res.cloudinary.com/dsjkhhpbl/image/upload/v1/party-crowd_kgnwom";
    
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
    
    return () => clearTimeout(fallbackTimer);
  }, [imageControls, imageLoaded]);
  
  // Trigger animations when elements come into view
  useEffect(() => {
    if (imageInView) imageControls.start('visible');
    if (cardInView) cardControls.start('visible');
    if (brandingInView) brandingControls.start('visible');
    if (locationInView) locationControls.start('visible');
  }, [imageInView, cardInView, brandingInView, locationInView, 
      imageControls, cardControls, brandingControls, locationControls]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  };
  
  const slideIn = {
    hidden: { x: -20, opacity: 0, scale: 0.98 },
    visible: { 
      x: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.35, 
        ease: [0.16, 0.01, 0.15, 1],
        opacity: { duration: 0.25 },
        x: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    }
  };
  
  const imageAppear = {
    hidden: { opacity: 0.3 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
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
          variants={fadeIn}
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
            variants={imageAppear}
            src={`https://res.cloudinary.com/dsjkhhpbl/image/upload/party-crowd_kgnwom`} 
            alt="Party crowd" 
            className={styles.partyImage}
            loading="eager" 
            fetchpriority="high"
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              willChange: 'opacity'
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
            variants={slideIn}
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
                <Link to="/events">
                  <motion.div 
                    className={styles.arrowContainer}
                    whileHover={{ backgroundColor: "#cc0000" }}
                    whileTap={{ backgroundColor: "#990000" }}
                    transition={{ duration: 0.2 }}
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