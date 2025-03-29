import React from 'react';
import UpcomingEvents from '../components/UpcomingEvents';
import PastEvents from '../components/PastEvents';
import styles from '../styles/Events.module.css';

function Events() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.eventsPageContent}>
        <UpcomingEvents />
        <PastEvents />
      </div>
    </div>
  );
}

export default Events; 