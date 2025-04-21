import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import styles from '../../styles/components/LineUp.module.css';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function LineUp() {
  const scrollContainerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  
  // Animation controls
  const headerControls = useAnimation();
  const listControls = useAnimation();
  const cardsControls = useAnimation();
  
  // Set up intersection observers
  const [headerRef, headerInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true,
    rootMargin: "0px 0px -10% 0px" 
  });
  
  const [listRef, listInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true,
    rootMargin: "0px 0px -10% 0px" 
  });
  
  const [cardsRef, cardsInView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true,
    rootMargin: "0px 0px -10% 0px" 
  });
  
  // Trigger animations when elements come into view
  useEffect(() => {
    if (headerInView) headerControls.start('visible');
    if (listInView) listControls.start('visible');
    if (cardsInView) cardsControls.start('visible');
  }, [headerInView, listInView, cardsInView, headerControls, listControls, cardsControls]);
  
  // Animation variants - simplified for better performance
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };
  
  const staggerList = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  const listItem = {
    hidden: { opacity: 0, x: -15 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  const staggerCards = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };
  
  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.97, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  // Simplified container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };
  
  // Simplified item variant
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  // Data structure to hold event information
  const events = useMemo(() => [
    {
      id: 1,
      artist: "BENJA",
      image: "https://res.cloudinary.com/dsjkhhpbl/image/upload/v1/e9dayolv0ssd24f1dqlh_aljcmt",
      socials: {
        instagram: "https://www.instagram.com/benjamusic.dj/",
        tiktok: "https://www.tiktok.com/@benjamusic.dj?lang=en",
        spotify: "https://open.spotify.com/artist/0CX4q2v1TeyeskG7GgAy"
      }
    },
    {
      id: 2,
      artist: "ROMY JANSSEN",
      image: "https://res.cloudinary.com/dsjkhhpbl/image/upload/v1/image_copy_4_wyul9v",
      socials: {
        instagram: "https://www.instagram.com/romyjanssendj/",
        tiktok: "https://www.tiktok.com/@romyjanssendj?lang=en",
        spotify: "https://open.spotify.com/artist/5wizmv8KVwvSrcFyvagn8x?si=IHUZrvrQSNGfbbIxwjBnWQ",
        soundcloud: "https://on.soundcloud.com/5b1jh5BATXwJXdHFA"
      }
    },
    {
      id: 3,
      artist: "FATA MORGANA",
      image: "https://res.cloudinary.com/dsjkhhpbl/image/upload/v1/image_copy_3_ktk8k2",
      socials: {
        instagram: "https://www.instagram.com/fatamorganagroup/",
        spotify: "https://open.spotify.com/artist/7JqRlV02zd5qwCwzn1aQhf?si=HmPXOpcFRjKtDroBHekblQ",
        additionalInstagrams: [
          "https://www.instagram.com/mosymusic/",
          "https://www.instagram.com/iammacks/"
        ]
      }
    }
  ], []); // Empty dependency array since this data is static

  // List of upcoming events for the left side
  const upcomingEvents = useMemo(() => [
    { artist: "BENJA" },
    { artist: "ROMY JANSSEN" },
    { artist: "FATA MORGANA" },
  ], []); // Empty dependency array since this data is static

  // Optimized scroll check using ResizeObserver
  const checkScrollable = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isRightScrollable = container.scrollWidth > container.clientWidth + container.scrollLeft;
    const isLeftScrollable = container.scrollLeft > 0;
    setIsScrollable(isRightScrollable);
    setCanScrollLeft(isLeftScrollable);
  }, []);
  
  // Check scrollability with ResizeObserver
  useEffect(() => {
    // Initial check with a delay
    const initialCheck = setTimeout(checkScrollable, 300);
    
    // Use ResizeObserver for more efficient monitoring
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the check to avoid excessive calculations
      if (window.scrollCheckTimeout) {
        clearTimeout(window.scrollCheckTimeout);
      }
      window.scrollCheckTimeout = setTimeout(checkScrollable, 100);
    });
    
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }
    
    // Also observe the main container in case parent dimensions change
    const container = document.querySelector(`.${styles.lineupContainer}`);
    if (container) {
      resizeObserver.observe(container);
    }
    
    return () => {
      clearTimeout(initialCheck);
      if (window.scrollCheckTimeout) {
        clearTimeout(window.scrollCheckTimeout);
      }
      resizeObserver.disconnect();
    };
  }, [checkScrollable]);
  
  // Add left scroll function
  const scrollLeft = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = Math.min(300, container.clientWidth * 0.8);
    container.scrollBy({ 
      left: -scrollAmount, 
      behavior: 'smooth' 
    });
    
    // Recheck scrollability after animation completes
    setTimeout(checkScrollable, 500);
  }, [checkScrollable]);

  // Update scrollRight to use checkScrollable
  const scrollRight = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = Math.min(300, container.clientWidth * 0.8);
    container.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
    
    // Recheck scrollability after animation completes
    setTimeout(checkScrollable, 500);
  }, [checkScrollable]);

  // Add scroll event listener to check scrollability
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollable);
      return () => container.removeEventListener('scroll', checkScrollable);
    }
  }, [checkScrollable]);

  return (
    <div>
      <div>
        <div>
          {/* Main container - fewer layout animations */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.lineupContainer}
          >
            <div className={styles.lineupContent}>
              {/* Left side - Simple list and header */}
              <div className={styles.lineupList}>
                <motion.div 
                  ref={headerRef}
                  className={styles.lineupHeader}
                  initial="hidden"
                  animate={headerControls}
                  variants={staggerList}
                >
                  <motion.h2 variants={fadeUp}>OUR ARTISTS</motion.h2>
                  <motion.p variants={fadeUp}>AZULU'S CORE GROUP OF ARTISTS WHO EMOBODY THE ESSENCE OF THE BRAND, THESE ARTISTS ARE CENTRAL TO AZULUS IDENTITY AND THE SOUND WE CREATE.</motion.p>
                </motion.div>
                
                <motion.div 
                  ref={listRef}
                  className={styles.upcomingEvents}
                  initial="hidden"
                  animate={listControls}
                  variants={staggerList}
                >
                  {upcomingEvents.map((event, index) => (
                    <motion.div 
                      key={index} 
                      className={styles.upcomingEvent}
                      variants={listItem}
                    >
                      <div className={styles.eventDetails}>
                        <div className={styles.eventArtist}>{event.artist}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              
              {/* Right side - Horizontal scrolling cards with simpler animations */}
              <div className={styles.featuredEventsContainer}>
                {/* Left scroll button */}
                <AnimatePresence>
                  {canScrollLeft && (
                    <motion.button 
                      className={styles.scrollButton} 
                      onClick={scrollLeft}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.2 } }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.95, transition: { duration: 0.05 } }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '45%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.div 
                  className={styles.featuredEvents} 
                  initial="hidden"
                  animate={cardsControls}
                  variants={staggerCards}
                  ref={(node) => {
                    if (node) {
                      scrollContainerRef.current = node;
                      cardsRef(node);
                      
                      // One-time check after initial render
                      setTimeout(checkScrollable, 100);
                    }
                  }}
                  onLoad={checkScrollable}
                >
                  {events.map((event) => (
                    <motion.div 
                      key={event.id} 
                      className={styles.featuredEventCard}
                      variants={cardAnimation}
                    >
                      <div className={styles.cardImageContainer}>
                        <motion.img 
                          src={event.image} 
                          alt={event.artist} 
                          className={styles.cardImage}
                          loading="eager"
                          variants={itemVariants}
                        />
                        <div className={styles.cardArtist}>{event.artist}</div>
                      </div>
                      <motion.div 
                        className={styles.cardSocials}
                        variants={itemVariants}
                      >
                        {event.socials && (
                          <div className={styles.socialLinks}>
                            {event.socials.instagram && (
                              <a 
                                href={event.socials.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.socialIcon}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </a>
                            )}
                            {event.socials.spotify && (
                              <a 
                                href={event.socials.spotify} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.socialIcon}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                              </a>
                            )}
                            {event.socials.tiktok && (
                              <a 
                                href={event.socials.tiktok} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.socialIcon}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                              </a>
                            )}
                            {event.socials.soundcloud && (
                              <a 
                                href={event.socials.soundcloud} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.socialIcon}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Right scroll button */}
                <AnimatePresence>
                  {isScrollable && (
                    <motion.button 
                      className={styles.scrollButton} 
                      onClick={scrollRight}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.2 } }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.95, transition: { duration: 0.05 } }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '45%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LineUp; 