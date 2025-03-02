import React from 'react';
import styles from '../styles/Pages.module.css';

function Events() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading1}>Our Events</h1>
      <p>Discover our upcoming and past events.</p>
      
      <div className={styles.eventsSection}>
        <h2 className={styles.heading2}>Upcoming Events</h2>
        <div className={styles.eventsGrid}>
          {/* Event cards will go here */}
          <div className={styles.eventCard}>
            <div className={`${styles.eventImage} ${styles.placeholder}`}></div>
            <h3>Event Title</h3>
            <p>Date: TBD</p>
            <p>Location: TBD</p>
            <button className={styles.btn}>Details</button>
          </div>
          <div className={styles.eventCard}>
            <div className={`${styles.eventImage} ${styles.placeholder}`}></div>
            <h3>Event Title</h3>
            <p>Date: TBD</p>
            <p>Location: TBD</p>
            <button className={styles.btn}>Details</button>
          </div>
        </div>
      </div>
      
      <div className={styles.eventsSection}>
        <h2 className={styles.heading2}>Past Events</h2>
        <div className={styles.eventsGrid}>
          {/* Past event cards will go here */}
          <div className={styles.eventCard}>
            <div className={`${styles.eventImage} ${styles.placeholder}`}></div>
            <h3>Past Event</h3>
            <p>Date: Previous</p>
            <p>Location: Venue</p>
            <button className={styles.btn}>Gallery</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events; 