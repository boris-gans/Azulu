import React, { useRef, useEffect } from 'react';

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Import Lenis dynamically to avoid SSR issues
    const initLenis = async () => {
      try {
        const Lenis = (await import('https://cdn.skypack.dev/@studio-freight/lenis')).default;
        
        // Create Lenis instance with optimized settings
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });

        // Find the navbar element
        const navbar = document.querySelector('[data-fixed-navbar]');
        
        // Get the main content wrapper
        const contentWrapper = document.querySelector('.App') || scrollRef.current;
        
        if (navbar && contentWrapper) {
          // Ensure the navbar is excluded from smooth scrolling effects
          lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
            // Keep the navbar in a fixed position
            navbar.style.transform = 'none';
            navbar.style.position = 'fixed';
            navbar.style.top = '0';
            navbar.style.left = '0';
            navbar.style.width = '100%';
            navbar.style.zIndex = '1000';
          });
        }

        // Connect to RAF for optimal performance
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        
        requestAnimationFrame(raf);

        // Recalculate on resize
        const handleResize = () => {
          if (lenis) {
            lenis.resize();
          }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          lenis.destroy();
        };
      } catch (error) {
        console.error("Failed to initialize smooth scrolling:", error);
      }
    };

    initLenis();
  }, []);

  return (
    <div ref={scrollRef} style={{ position: 'relative', width: '100%' }}>
      {children}
    </div>
  );
};

export default SmoothScroll; 