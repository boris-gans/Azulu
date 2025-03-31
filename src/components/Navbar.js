import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import { useState, useCallback, useEffect } from 'react';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent scrolling when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.classList.remove('menu-open');
    }
  }, [mobileMenuOpen]);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
    document.documentElement.classList.remove('menu-open');
  }, []);

  useEffect(() => {
    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
      document.documentElement.classList.remove('menu-open');
    };
  }, [mobileMenuOpen, closeMenu]);

  return (
    <>
      <nav 
        className={`${styles.navbar} ${mobileMenuOpen ? styles.open : ''}`}
        data-fixed-navbar
      >
        <div className={styles.leftSection}>
          <div className={styles.navbarLogo}>
            <Link to="/">
              <img src="/assets/icons/logoWhite.svg" alt="Azulu" className={styles.logo} />
            </Link>
          </div>
          <ul className={`${styles.leftNavLinks} ${styles.desktopOnly}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div className={styles.rightSection}>
          <ul className={`${styles.rightNavLinks} ${styles.desktopOnly}`}>
            <li><Link to="/pre-register">Join Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - separate from navbar to avoid layout issues */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileMenuLinks}>
          <li><Link to="/" onClick={closeMenu}>HOME</Link></li>
          <li><Link to="/events" onClick={closeMenu}>EVENTS</Link></li>
          <li><Link to="/about" onClick={closeMenu}>ABOUT</Link></li>
          <li><Link to="/pre-register" onClick={closeMenu}>JOIN US</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>CONTACT</Link></li>
        </ul>
      </div>
    </>
  );
}

export default Navbar; 