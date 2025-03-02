import React from 'react';
import styles from '../../styles/components/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contactWrapper}>
        <h3 className={styles.contactTitle}>CONTACT US</h3>
        
        <div className={styles.contactInfo}>
          <div className={styles.contactSection}>
            <p>
              Mail:<br />
              <a href="mailto:info@azuluevents.com">info@azuluevents.com</a>
            </p>
            <p>
              Instagram:<br />
              <a href="https://instagram.com/azulu.worldwide" target="_blank" rel="noopener noreferrer">@azulu.worldwide</a>
            </p>
          </div>
          
          <div className={styles.contactSection}>
            <p>
              TikTok:<br />
              <a href="https://tiktok.com/@azuluworldwide" target="_blank" rel="noopener noreferrer">@azuluworldwide</a>
            </p>
          </div>
          
          <div className={styles.contactSection}>
            <p>
              Youtube:<br />
              <a href="https://www.youtube.com/channel/UCgCgPXsocZLWImZ4jz5O1vA" target="_blank" rel="noopener noreferrer">AzuluEvents</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 