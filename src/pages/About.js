import React from 'react';
import styles from '../styles/Pages.module.css';

function About() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading1}>About Azulu</h1>
      <div className={styles.aboutContent}>
        <div className={styles.placeholder}></div>
        <div className={styles.aboutText}>
          <p>
            Azulu is a premier events company dedicated to creating memorable experiences.
            Founded in [year], we have been bringing people together through innovative and
            exciting events.
          </p>
          <p>
            Our team of experienced professionals is committed to excellence in event planning,
            management, and execution. We pride ourselves on attention to detail and creating
            customized experiences that exceed expectations.
          </p>
          <h2 className={styles.heading2}>Our Mission</h2>
          <p>
            To create unforgettable events that inspire, connect, and entertain people while
            delivering exceptional value to our clients and partners.
          </p>
        </div>
      </div>
      
      <div className={styles.teamSection}>
        <h2 className={styles.heading2}>Our Team</h2>
        <div className={styles.teamGrid}>
          {/* Team member cards will go here */}
          <div className={styles.teamCard}>
            <div className={styles.placeholder}></div>
            <h3>Team Member</h3>
            <p>Position</p>
          </div>
          <div className={styles.teamCard}>
            <div className={styles.placeholder}></div>
            <h3>Team Member</h3>
            <p>Position</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 