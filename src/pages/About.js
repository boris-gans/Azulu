import React, { useState, useEffect } from 'react';
import styles from '../styles/About.module.css';
import AboutLinks from '../components/AboutLinks';

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

  // Handle grid cell interactions
  const handleGridCellEnter = (index) => {
    const cell = document.querySelector(`.${styles.grid_cell}[data-index="${index}"]`);
    if (cell) {
      // Clear any existing animations
      cell.classList.remove(styles.trail);
      // Force a reflow
      void cell.offsetWidth;
      cell.classList.add(styles.hover);
    }
  };

  const handleGridCellLeave = (index) => {
    const cell = document.querySelector(`.${styles.grid_cell}[data-index="${index}"]`);
    if (cell) {
      cell.classList.remove(styles.hover);
      // Force a reflow
      void cell.offsetWidth;
      cell.classList.add(styles.trail);
      
      // Cleanup after animation
      const cleanup = () => {
        cell.classList.remove(styles.trail);
        cell.removeEventListener('animationend', cleanup);
      };
      
      cell.addEventListener('animationend', cleanup);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading content...</div>
      </div>
    );
  }

  return (
    <div className={styles.page_container}>
      <div className={styles.about_page}>
        <div className={styles.about_content}>
          <div className={styles.content_wrapper}>
            <div className={styles.main_content}>

              
              <div className={styles.paragraphs_container}>
                {aboutParagraphs.map((paragraph, index) => (
                  <p key={`para-${index}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.decorative_grid}>
          <img 
            src="/assets/images/Azulu PF White.png" 
            alt="Azulu Logo" 
            className={styles.grid_logo}
          />
          {[...Array(100)].map((_, index) => (
            <div 
              key={index} 
              className={styles.grid_cell} 
              data-index={index}
              onMouseEnter={() => handleGridCellEnter(index)}
              onMouseLeave={() => handleGridCellLeave(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Links section - separate from both content and grid */}
      <div className={styles.links_section}>
        <AboutLinks />
      </div>
    </div>
  );
}

export default About; 