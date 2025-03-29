import React, { useState, useEffect } from 'react';
import styles from '../styles/About.module.css';

function About() {
  const [aboutParagraphs, setAboutParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get about content from global content store
    if (window.azuluContent && window.azuluContent.aboutPage) {
      const paragraphs = window.azuluContent.aboutPage
        .split('\n\n')
        .filter(p => p.trim() !== '');
      
      setAboutParagraphs(paragraphs);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading content...</div>
      </div>
    );
  }

  // Extract quote paragraph (5th paragraph or last if fewer paragraphs)
  const quoteIndex = aboutParagraphs.length >= 5 ? 4 : aboutParagraphs.length - 1;
  
  return (
    <div className={styles.container}>
      <div className={styles.aboutContent}>
        {aboutParagraphs.map((paragraph, index) => {
          if (index === quoteIndex) {
            return (
              <p key={index} className={styles.quote}>
                {paragraph}
              </p>
            );
          } else {
            return <p key={index}>{paragraph}</p>;
          }
        })}

        <div className={styles.logoContainer}>
          <img 
            src="/assets/icons/logoWhite.svg" 
            alt="Azulu Logo" 
            className={styles.logoImage} 
          />
        </div>
      </div>
    </div>
  );
}

export default About; 