import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    // Detect Firefox browser
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    // If Firefox is detected, don't initialize Lenis
    if (isFirefox) {
      console.log('Firefox detected, disabling custom smooth scrolling');
      return;
    }
    
    // Initialize Lenis with optimized parameters for performance
    const lenis = new Lenis({
      duration: 0.7,  // Reduced from 0.9 for better performance
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85, // Further reduced for better performance
      smoothTouch: false,   // Disable smooth touch to improve performance on mobile
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Connect GSAP ScrollTrigger and Lenis with debounced updates
    let scrollTriggerTimeout;
    lenis.on('scroll', () => {
      clearTimeout(scrollTriggerTimeout);
      scrollTriggerTimeout = setTimeout(() => {
        ScrollTrigger.update();
      }, 16); // 60fps timing
    });

    // Update ScrollTrigger on Lenis scroll with optimized performance
    const scrollFn = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(scrollFn);

    // Use RAF instead of gsap ticker for smoother performance
    gsap.ticker.lagSmoothing(0);

    // Initialize ScrollTrigger with simpler refresh
    ScrollTrigger.refresh();

    // Add a way to detect if scrolling feels too constrained and adjust
    let lastScrollTop = 0;
    let scrollTimeout = null;
    
    const scrollListener = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = Math.abs(scrollTop - lastScrollTop);
      
      // If user is trying to scroll rapidly, temporarily increase responsiveness
      if (scrollDelta > 60) {
        lenis.options.lerp = 0.03; // Faster response when user scrolls quickly (lower is faster)
      } else {
        lenis.options.lerp = 0.07; // Slightly more responsive than before
      }
      
      lastScrollTop = scrollTop;
      
      // Reset lerp after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        lenis.options.lerp = 0.07;
      }, 150);
    };
    
    window.addEventListener('scroll', scrollListener, { passive: true });

    return () => {
      // Clean up the Lenis instance when component unmounts
      lenis.destroy();
      gsap.ticker.remove(scrollFn);
      window.removeEventListener('scroll', scrollListener);
      clearTimeout(scrollTimeout);
      clearTimeout(scrollTriggerTimeout);
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
};

export default SmoothScroll; 