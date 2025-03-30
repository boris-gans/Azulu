import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/AboutLinks.module.css';

const AboutLinks = () => {
  return (
    <div className={styles.linksContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.linkSection}>
          <h3 className={styles.sectionTitle}>NEXT STEPS</h3>
          <div className={styles.linksGrid}>
            <Link to="/pre-register" className={styles.pageLink}>
              <span className={styles.linkNumber}>01.</span>
              <div className={styles.linkContent}>
                <span className={styles.linkText}>PRE-REGISTER</span>
                <span className={styles.linkDescription}>Join the waitlist</span>
              </div>
              <span className={styles.linkArrow}>→</span>
            </Link>
            <Link to="/contact" className={styles.pageLink}>
              <span className={styles.linkNumber}>02.</span>
              <div className={styles.linkContent}>
                <span className={styles.linkText}>CONTACT</span>
                <span className={styles.linkDescription}>Get in touch</span>
              </div>
              <span className={styles.linkArrow}>→</span>
            </Link>
          </div>
        </div>

        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>CONNECT</h3>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>MAIL</span>
              <a href="mailto:info@azuluevents.com" className={styles.contactLink}>
                info@azuluevents.com
              </a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>INSTAGRAM</span>
              <a 
                href="https://instagram.com/azulu.worldwide" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.contactLink}
              >
                @azulu.worldwide
              </a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>TIKTOK</span>
              <a 
                href="https://tiktok.com/@azuluworldwide" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.contactLink}
              >
                @azuluworldwide
              </a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>YOUTUBE</span>
              <a 
                href="https://www.youtube.com/channel/UCgCgPXsocZLWImZ4jz5O1vA" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.contactLink}
              >
                AzuluEvents
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLinks; 