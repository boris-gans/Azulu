import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import styles from '../styles/PastEvents.module.css';

function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // const response = await fetch('https://azulucms.onrender.com/events/?upcoming=false');
        // const response = await fetch('http://0.0.0.0:8000/events/?upcoming=false');
        const response = await fetch('https://azulucms-pr-1.onrender.com/events/?upcoming=false');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const eventsData = await response.json();
        
        // Modify all past events to have 'Sold Out' status and null ticket link
        const modifiedEvents = eventsData.map(event => ({
          ...event,
          ticket_status: 'Sold Out',
          ticket_link: null
        }));

        // Sort events by combined start_date and start_time in descending order (newest first)
        const sortedEvents = modifiedEvents.sort((a, b) => {
          // Combine date and time for comparison
          const dateA = new Date(`${a.start_date}T${a.start_time}`);
          const dateB = new Date(`${b.start_date}T${b.start_time}`);
          return dateB - dateA; // Descending order
        });
        
        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNum = date.getDate();
    
    return (
      <div className={styles.formattedDate}>
        <span className={styles.dayText}>{day},</span>{' '}
        <span className={styles.monthText}>{month}</span>{' '}
        <span className={styles.dateNum}>{dayNum}</span>
      </div>
    );
  };

  const formatTime = (timeString, timeZone) => {
    if (!timeString || !timeZone) return '';
    
    // Format time with timezone indicator
    const formattedTime = timeString.toUpperCase();
    
    // Get timezone abbreviation
    const now = new Date();
    const tzAbbr = new Intl.DateTimeFormat('en', {
      timeZoneName: 'short',
      timeZone: timeZone
    }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || timeZone;
    
    return `${formattedTime} ${tzAbbr}`;
  };

  const getCurrencySymbol = (currencyCode) => {
    switch(currencyCode) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': return '$';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      case 'JPY': return '¥';
      case 'CHF': return 'Fr';
      default: return currencyCode;
    }
  };

  const toggleExpand = (id) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  // Group events by date while maintaining sorted order
  const groupedEvents = !loading && !error ? events.reduce((groups, event) => {
    const dateKey = event.start_date;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {}) : {};

  // Sort the groups by date in descending order
  const sortedGroupKeys = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  return (
    <div className={styles.eventsSection}>
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleTop}>Previous</span>
          <span className={styles.titleBottom}>Events</span>
        </h2>
        <div className={styles.lineContainer}>
          <div className={styles.whiteLine}></div>
          <div className={styles.redLine}></div>
        </div>
      </div>
      <div className={styles.eventsContainer}>
        {loading ? (
          <div className={styles.loadingState}>LOADING<span>.</span><span>.</span><span>.</span></div>
        ) : error ? (
          <div className={styles.errorState}>ERROR: {error}</div>
        ) : Object.keys(groupedEvents).length === 0 ? (
          <div className={styles.noEventsMessage}>
            No previous events to display.
          </div>
        ) : (
          sortedGroupKeys.map((dateKey) => (
            <div key={dateKey} className={styles.dateGroup}>
              <div className={styles.dateHeader}>
                {formatDate(dateKey)}
              </div>
              
              <div className={styles.eventsList}>
                {groupedEvents[dateKey].map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onToggleExpand={toggleExpand}
                    isExpanded={expandedEvent === event.id}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PastEvents; 