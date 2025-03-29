import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import styles from '../styles/UpcomingEvents.module.css';

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://azulucrm.onrender.com/events/?upcoming=true');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const eventsData = await response.json();
        // Sort events by start_time
        const sortedEvents = eventsData.sort((a, b) => 
          new Date(a.start_time) - new Date(b.start_time)
        );
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

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
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

  // Group events by date
  const groupedEvents = !loading && !error ? events.reduce((groups, event) => {
    const dateKey = new Date(event.start_time).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {}) : {};

  return (
    <div className={styles.eventsSection}>
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleTop}>Upcoming</span>
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
            No upcoming events. Stay tuned!
          </div>
        ) : (
          Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
            <div key={dateKey} className={styles.dateGroup}>
              <div className={styles.dateHeader}>
                {formatDate(dateKey)}
              </div>
              
              <div className={styles.eventsList}>
                {dateEvents.map((event) => (
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

export default UpcomingEvents; 