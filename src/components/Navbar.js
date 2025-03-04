import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // Throttle function to limit how often the scroll handler fires
  const throttle = (callback, delay) => {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return callback(...args);
    };
  };

  // Use useCallback to memoize the scroll handler
  const handleScroll = useCallback(() => {
    throttle(() => {
      const currentScrollPos = window.pageYOffset;
      
      // Determine if we should show or hide the navbar
      // Show when scrolling up or at the top of the page
      // Hide when scrolling down and not at the top
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 70;
      
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    }, 100)();
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <nav 
      className={`${styles.navbar} ${visible ? styles.navbarVisible : styles.navbarHidden}`} 
      data-fixed-navbar
    >
      <div className={styles.leftSection}>
        <div className={styles.navbarLogo}>
          <Link to="/">
            <img src="/assets/icons/logoWhite.svg" alt="Azulu" className={styles.logo} />
          </Link>
        </div>
        <ul className={styles.leftNavLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <div className={styles.rightSection}>
        <ul className={styles.rightNavLinks}>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar; 