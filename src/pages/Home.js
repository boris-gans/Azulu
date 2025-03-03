import React, { useEffect, useState, Suspense, lazy, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Pages.module.css';
import Hero from '../components/home/Hero';

// Simple components load immediately
const LineUp = lazy(() => import('../components/home/LineUp'));
const Party = lazy(() => import('../components/home/Party'));

// Secondary components with slight delay to prioritize critical content
const Amsterdam = lazy(() => {
  // Small delay for less important components
  return new Promise(resolve => {
    // Shorter delay for better UX
    setTimeout(() => resolve(import('../components/home/Amsterdam')), 100);
  });
});

// Lowest priority components load last
const Images = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('../components/home/Images')), 150);
  });
});

const Azulu = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('../components/home/Azulu')), 200);
  });
});

const Footer = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(import('../components/home/Footer')), 250);
  });
});

// Optimized loading fallback component
const LoadingFallback = () => (
  <div className={styles.componentLoader || "component-loader"} 
       style={{ 
         height: '300px', 
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center' 
       }}>
    {/* Simple loading indicator */}
    <div className={styles.loadingDot || "loading-dot"}></div>
  </div>
);

function Home() {
  const [hasScrolled, setHasScrolled] = useState(false);
  // Use refs to observe when components come into view
  const sectionRefs = useRef({
    lineup: null,
    party: null,
    amsterdam: null,
    images: null,
    azulu: null,
    footer: null
  });
  
  useEffect(() => {
    // Use enhanced intersection observer for smarter component loading
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get section ID to identify which component to preload
          const sectionId = entry.target.dataset.section;
          if (sectionId) {
            // Once in view, we no longer need to observe
            observer.unobserve(entry.target);
          }
        }
      });
    };
    
    // Create intersection observer with a more generous threshold
    // to start animations earlier
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '150px 0px', // Reduced from 200px for better performance
      threshold: 0.05 // More sensitive to detect elements sooner
    });
    
    // Start observing section containers
    Object.keys(sectionRefs.current).forEach(key => {
      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]);
      }
    });
    
    // More efficient scroll listener with passive flag and minimal work
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 50) { // Reduced threshold
        setHasScrolled(true);
        
        // Preload only essential components when scrolling starts
        if (typeof window !== 'undefined') {
          // Use requestIdleCallback if available for better performance
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
              import('../components/home/LineUp');
              import('../components/home/Party');
            });
          } else {
            // Fallback to setTimeout with a small delay
            setTimeout(() => {
              import('../components/home/LineUp');
              import('../components/home/Party');
            }, 50);
          }
        }
      }
    };
    
    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [hasScrolled]);
  
  return (
    <motion.div 
      className={styles.homeContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }} // Reduced from 0.4 for better performance
      style={{ willChange: 'opacity' }}
    >
      <Hero />
      
      <div 
        ref={el => sectionRefs.current.lineup = el} 
        data-section="lineup"
      >
        <Suspense fallback={<LoadingFallback />}>
          <LineUp />
        </Suspense>
      </div>
      
      <div 
        ref={el => sectionRefs.current.party = el} 
        data-section="party"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Party />
        </Suspense>
      </div>
      
      <div 
        ref={el => sectionRefs.current.amsterdam = el} 
        data-section="amsterdam"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Amsterdam />
        </Suspense>
      </div>
      
      <div 
        ref={el => sectionRefs.current.images = el} 
        data-section="images"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Images />
        </Suspense>
      </div>
      
      <div 
        ref={el => sectionRefs.current.azulu = el} 
        data-section="azulu"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Azulu />
        </Suspense>
      </div>
      
      <div 
        ref={el => sectionRefs.current.footer = el} 
        data-section="footer"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Footer />
        </Suspense>
      </div>
    </motion.div>
  );
}

export default Home; 