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
      
      // Get scroll position
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate absolute position (relative to document, not viewport)
      const absoluteMouseX = e.clientX + scrollX;
      const absoluteMouseY = e.clientY + scrollY;
      
      // Calculate absolute position of hero section
      const absoluteHeroTop = heroRect.top + scrollY;
      const absoluteHeroBottom = heroRect.bottom + scrollY;
      const absoluteHeroLeft = heroRect.left + scrollX;
      const absoluteHeroRight = heroRect.right + scrollX;
      
      // Check if cursor is inside hero section (using absolute coordinates)
      if (
        absoluteMouseY < absoluteHeroTop || 
        absoluteMouseY > absoluteHeroBottom || 
        absoluteMouseX < absoluteHeroLeft || 
        absoluteMouseX > absoluteHeroRight
      ) {
        return;
      }
      
      // Use viewport-relative coordinates for the gradient effect
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediately update background position - no smooth delay
      setMousePosition({ x: mouseX, y: mouseY });
      
      // For logo masking, update directly via DOM (bypass React state for speed)
      if (logoRef.current && logoImageRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        
        // These are viewport-relative coordinates
        const currentLogoX = mouseX - logoRect.left;
        const currentLogoY = mouseY - logoRect.top;
        
        // Direct DOM update - much faster than setState
        logoImageRef.current.style.setProperty('--x', `${currentLogoX}px`);
        logoImageRef.current.style.setProperty('--y', `${currentLogoY}px`);
        
        // Adjust visibility based on whether logo is in viewport
        const logoInView = 
          logoRect.top < window.innerHeight &&
          logoRect.bottom > 0 &&
          logoRect.left < window.innerWidth &&
          logoRect.right > 0;
        
        if (!logoInView) {
          // If logo is not in view, don't show the reveal effect
          logoRef.current.classList.remove('activeReveal');
          return;
        }
        
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
      
      // Get scroll position
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate absolute position (relative to document, not viewport)
      const absoluteTouchX = touch.clientX + scrollX;
      const absoluteTouchY = touch.clientY + scrollY;
      
      // Calculate absolute position of hero section
      const absoluteHeroTop = heroRect.top + scrollY;
      const absoluteHeroBottom = heroRect.bottom + scrollY;
      const absoluteHeroLeft = heroRect.left + scrollX;
      const absoluteHeroRight = heroRect.right + scrollX;
      
      // Check if touch is inside hero section (using absolute coordinates)
      if (
        absoluteTouchY < absoluteHeroTop || 
        absoluteTouchY > absoluteHeroBottom || 
        absoluteTouchX < absoluteHeroLeft || 
        absoluteTouchX > absoluteHeroRight
      ) {
        return;
      }
      
      // Use viewport-relative coordinates for visual effects
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
        
        // Adjust visibility based on whether logo is in viewport
        const logoInView = 
          logoRect.top < window.innerHeight &&
          logoRect.bottom > 0 &&
          logoRect.left < window.innerWidth &&
          logoRect.right > 0;
        
        if (!logoInView) {
          // If logo is not in view, don't show the reveal effect
          logoRef.current.classList.remove('activeReveal');
          return;
        }
        
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
          backgroundImage: `radial-gradient(
            circle 400px at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(25, 25, 25, 0.7) 0%, 
            rgba(10, 10, 10, 0.5) 40%, 
            rgba(0, 0, 0, 1) 80%
          )`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }}
      >
        {/* Title header with Azulu text logo */}
        <div className={styles.titleHeader}>
          <img 
            src="/assets/images/Azulu white.png" 
            alt="Azulu" 
            className={styles.titleLogo}
          />
        </div>
        
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