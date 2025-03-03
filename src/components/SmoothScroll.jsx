import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    // Initialize Lenis with balanced parameters for smoothness and control
    const lenis = new Lenis({
      duration: 0.9,  // Balanced duration - not too quick, not too slow
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Effective exponential easing
      direction: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, // Reduced for better control feeling
      smoothTouch: true,   // Enable smooth touch with reasonable values
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Connect GSAP ScrollTrigger and Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Update ScrollTrigger on Lenis scroll
    const scrollFn = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(scrollFn);

    // Set up automatic refresh of ScrollTrigger when window size changes
    gsap.ticker.lagSmoothing(false);

    // Initialize ScrollTrigger
    ScrollTrigger.refresh();

    // Add a way to detect if scrolling feels too constrained and adjust
    let lastScrollTop = 0;
    let scrollTimeout = null;
    
    const scrollListener = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = Math.abs(scrollTop - lastScrollTop);
      
      // If user is trying to scroll rapidly, temporarily increase responsiveness
      if (scrollDelta > 60) {
        lenis.options.lerp = 0.05; // Faster response when user scrolls quickly
      } else {
        lenis.options.lerp = 0.1; // Normal smoothness otherwise
      }
      
      lastScrollTop = scrollTop;
      
      // Reset lerp after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        lenis.options.lerp = 0.1;
      }, 150);
    };
    
    window.addEventListener('scroll', scrollListener, { passive: true });

    return () => {
      // Clean up the Lenis instance when component unmounts
      lenis.destroy();
      gsap.ticker.remove(scrollFn);
      window.removeEventListener('scroll', scrollListener);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
};

export default SmoothScroll; 