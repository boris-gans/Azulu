import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/About.module.css';
import AboutLinks from '../components/AboutLinks';

function About() {
  const [aboutParagraphs, setAboutParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const logoImageRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Get about content from global content store
    if (window.azuluContent && window.azuluContent.aboutPage) {
      const paragraphs = window.azuluContent.aboutPage
        .split('\n\n')
        .filter(p => p.trim() !== '');
      
      setAboutParagraphs(paragraphs);
    }
    setLoading(false);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Direct DOM manipulation for immediate cursor tracking - only in hero section
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e) => {
      // Only track if we're within the hero section
      if (!heroRef.current) return;
      
      const heroRect = heroRef.current.getBoundingClientRect();
      // Check if cursor is inside hero section
      if (
        e.clientY < heroRect.top || 
        e.clientY > heroRect.bottom || 
        e.clientX < heroRect.left || 
        e.clientX > heroRect.right
      ) {
        return;
      }
      
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediately update background position - no smooth delay
      setMousePosition({ x: mouseX, y: mouseY });
      
      // For logo masking, update directly via DOM (bypass React state for speed)
      if (logoRef.current && logoImageRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const currentLogoX = mouseX - logoRect.left;
        const currentLogoY = mouseY - logoRect.top;
        
        // Direct DOM update - much faster than setState
        logoImageRef.current.style.setProperty('--x', `${currentLogoX}px`);
        logoImageRef.current.style.setProperty('--y', `${currentLogoY}px`);
        
        // Detect when cursor is close to logo center for enhanced reveal effect
        const centerX = logoRect.width / 2;
        const centerY = logoRect.height / 2;
        const distance = Math.sqrt(Math.pow(currentLogoX - centerX, 2) + Math.pow(currentLogoY - centerY, 2));
        
        // Fast class toggling for immediate response
        if (distance < 250) {
          logoRef.current.classList.add('activeReveal');
        } else {
          logoRef.current.classList.remove('activeReveal');
        }
      }
    };
    
    // Handle touch moves for mobile devices
    const handleTouchMove = (e) => {
      if (!heroRef.current || !e.touches || !e.touches[0]) return;
      
      const heroRect = heroRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      
      // Check if touch is inside hero section
      if (
        touch.clientY < heroRect.top || 
        touch.clientY > heroRect.bottom || 
        touch.clientX < heroRect.left || 
        touch.clientX > heroRect.right
      ) {
        return;
      }
      
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      
      // Update background position
      setMousePosition({ x: mouseX, y: mouseY });
      
      // For logo masking on touch devices
      if (logoRef.current && logoImageRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const touchX = mouseX - logoRect.left;
        const touchY = mouseY - logoRect.top;
        
        // Update the mask position based on touch
        logoImageRef.current.style.setProperty('--x', `${touchX}px`);
        logoImageRef.current.style.setProperty('--y', `${touchY}px`);
        
        // Always show more of the logo on mobile for better experience
        logoRef.current.classList.add('activeReveal');
      }
    };
    
    // Full reveal for mobile when not actively touching
    const initMobileReveal = () => {
      if (isMobile && logoRef.current && logoImageRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const centerX = logoRect.width / 2;
        const centerY = logoRect.height / 2;
        
        // Center the reveal effect when not touching
        logoImageRef.current.style.setProperty('--x', `${centerX}px`);
        logoImageRef.current.style.setProperty('--y', `${centerY}px`);
        logoRef.current.classList.add('activeReveal');
      }
    };
    
    // Initialize mobile reveal if needed
    if (isMobile) {
      initMobileReveal();
    }
    
    // Use both mouse and touch events
    window.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchend', initMobileReveal, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchend', initMobileReveal);
    };
  }, [isMobile]);

  // Split paragraphs into left and right columns
  const splitParagraphs = () => {
    const leftParagraphs = [];
    const rightParagraphs = [];
    
    aboutParagraphs.forEach((paragraph, index) => {
      if (index % 2 === 0) {
        leftParagraphs.push(paragraph);
      } else {
        rightParagraphs.push(paragraph);
      }
    });
    
    return { leftParagraphs, rightParagraphs };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading content...</div>
      </div>
    );
  }
  
  const { leftParagraphs, rightParagraphs } = splitParagraphs();
  
  return (
    <div className={styles.container}>
      {/* Hero section with interactive effects */}
      <div 
        ref={heroRef}
        className={styles.heroSection}
        style={{
          background: `radial-gradient(
            circle 400px at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(25, 25, 25, 0.7) 0%, 
            rgba(10, 10, 10, 0.5) 40%, 
            rgba(0, 0, 0, 1) 80%
          )`
        }}
      >
        <div className={styles.aboutContent} ref={contentRef}>
          <div className={`${styles.contentColumn} ${styles.leftColumn}`}>
            {leftParagraphs.map((paragraph, index) => (
              <p key={`left-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className={`${styles.contentColumn} ${styles.rightColumn}`}>
            {rightParagraphs.map((paragraph, index) => (
              <p key={`right-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        <div 
          className={styles.logoContainer} 
          ref={logoRef}
        >
          <img 
            ref={logoImageRef}
            src="/assets/icons/logoWhite.svg" 
            alt="Azulu Logo" 
            className={styles.logoImage}
          />
        </div>
      </div>

      {/* Links section - separate from hero */}
      <AboutLinks />
    </div>
  );
}

export default About; 