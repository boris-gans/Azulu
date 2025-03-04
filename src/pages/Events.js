import React, { useEffect, useState } from 'react';
import { createClient } from '@sanity/client';
import { PortableText } from '@portabletext/react';
import styles from '../styles/Events.module.css';

// Initialize Sanity Client
const client = createClient({
  projectId: '924kpawb',
  dataset: 'events',
  useCdn: true,
  apiVersion: '2024-01-01'
});

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = `*[_type == "event"] {
          _id,
          name,
          venue,
          date,
          ticketLink,
          lineup,
          genres,
          description,
          "posterUrl": poster.asset->url,
          price {
            amount,
            currency
          }
        } | order(date asc)`;
        
        const results = await client.fetch(query);
        setEvents(results);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).toUpperCase();
  };

  const getCurrencySymbol = (currencyCode) => {
    const currencySymbols = {
      'EUR': '€',
      'GBP': '£',
      'USD': '$',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'Fr'
    };
    return currencySymbols[currencyCode] || currencyCode;
  };

  if (loading) return <div className={styles.loading}>LOADING<span>.</span><span>.</span><span>.</span></div>;
  if (error) return <div className={styles.error}>ERROR: {error}</div>;

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const dateKey = new Date(event.date).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {});

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Upcoming Events</h1>
      </div>
      
      <div className={styles.eventsContainer}>
        {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
          <div key={dateKey} className={styles.dateSection}>
            <div className={styles.dateHeader}>
              <span className={styles.slash}>/</span>
              <span className={styles.dateText}>{formatDate(dateKey)}</span>
            </div>
            
            {dateEvents.map((event) => (
              <div key={event._id} className={styles.eventCard}>
                <div className={styles.eventImageWrapper}>
                  <div className={styles.eventImage}>
                    {event.posterUrl && (
                      <img src={event.posterUrl} alt={event.name} loading="lazy" />
                    )}
                  </div>
                </div>
                
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{event.name}</h3>
                  
                  <div className={styles.venueRow}>
                    {event.venue && (
                      <div className={styles.venueInfo}>
                        <span className={styles.venueDash}>⸺</span>
                        <div className={styles.venueDetails}>
                          <span className={styles.venueName}>{event.venue.name}</span>
                          {event.venue.address && (
                            <span className={styles.venueAddress}>{event.venue.address}</span>
                          )}
                        </div>
                        
                        {event.price && event.price.amount && (
                          <span className={styles.priceInfo}>
                            {getCurrencySymbol(event.price.currency)}{event.price.amount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {event.lineup && event.lineup.length > 0 && (
                    <div className={styles.lineupContainer}>
                      <h4 className={styles.lineupHeading}>LINEUP</h4>
                      <div className={styles.lineupList}>
                        {event.lineup.map((item, index) => (
                          <span key={item._key} className={styles.lineupArtist}>
                            {item.artist}
                            {index < event.lineup.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {event.genres && event.genres.length > 0 && (
                    <div className={styles.genreContainer}>
                      {event.genres.map((genre, index) => (
                        <span key={index} className={styles.genre}>{genre}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <div className={styles.eventDescriptionColumn}>
                    <div className={styles.eventDescription}>
                      <PortableText 
                        value={event.description}
                        components={{
                          block: ({children}) => <p>{children}</p>
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className={styles.eventActions}>
                  {event.ticketLink && (
                    <a 
                      href={event.ticketLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.ticketButton}
                    >
                      TICKETS
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events; 