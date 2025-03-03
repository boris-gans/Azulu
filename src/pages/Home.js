import React, { useEffect, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Pages.module.css';
import Hero from '../components/home/Hero';

// Lazy load components that aren't immediately visible
const LineUp = lazy(() => import('../components/home/LineUp'));
const Party = lazy(() => import('../components/home/Party'));
const Amsterdam = lazy(() => import('../components/home/Amsterdam'));
const Images = lazy(() => import('../components/home/Images'));
const Azulu = lazy(() => import('../components/home/Azulu'));
const Footer = lazy(() => import('../components/home/Footer'));

// Loading fallback component
const LoadingFallback = () => (
  <div className={styles.componentLoader || "component-loader"}>
    {/* You can add a spinner or placeholder here */}
  </div>
);

function Home() {
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    // Preload components after initial render
    const preloadComponents = async () => {
      if (!hasScrolled) {
        // Preload the next few components
        const importPromises = [
          import('../components/home/LineUp'),
          import('../components/home/Party'),
          import('../components/home/Amsterdam')
        ];
        await Promise.all(importPromises);
      }
    };
    
    preloadComponents();
    
    // Add scroll listener to detect when user starts scrolling
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 100) {
        setHasScrolled(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);
  
  return (
    <motion.div 
      className={styles.homeContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      
      <Suspense fallback={<LoadingFallback />}>
        <LineUp />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Party />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Amsterdam />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Images />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Azulu />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </motion.div>
  );
}

export default Home; 