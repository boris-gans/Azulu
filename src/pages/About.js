import React from 'react';
import styles from '../styles/About.module.css';

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.aboutContent}>
        <p>
          Azulu is more than an event—it's an immersive journey into the heart of Afro and Deep House, 
          where music, fashion, and art collide to create something truly transformative.
        </p>
        
        <p>
          Curated by Benja, the rising force in the Afro/Deep House scene and the mind behind 
          the hit record Yamore in collaboration with MoBlack Records, Azulu is a global movement 
          redefining the nightlife experience.
        </p>
        
        <p>
          From electrifying live sets to unforgettable party's in the world's most extraordinary 
          locations, Azulu is where rhythm meets artistry. Every event is a carefully crafted blend 
          of sound, culture, and visual storytelling, bringing together a community of music lovers 
          and creatives.
        </p>
        
        <p>
          Beyond the music, we support emerging artists, shaping the next generation of talent 
          while constantly evolving our concept to new heights.
        </p>
        
        <p className={styles.quote}>
          Azulu is not just a party—it's an experience, a moment, a revolution.
        </p>
        
        <p>
          Welcome to the future of sound. Welcome to Azulu.
        </p>

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