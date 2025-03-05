import React, { useEffect, useState } from 'react';
import { createClient } from '@sanity/client';
import { PortableText } from '@portabletext/react';
import styles from '../styles/Events.module.css';

// Sanity client setup
const client = createClient({
  projectId: '924kpawb',
  dataset: 'events',
  useCdn: true,
  apiVersion: '2024-01-01'
});

// Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoidG9ydGVvdXM0NCIsImEiOiJjbTd2cmxxcGwwMnViMnhzN2Z6a3pvdDFnIn0.3cXA7HjBAVWaFC2uSjPQjQ';

// Global map component showing all venues
function GlobalVenueMap({ venues, selectedAddress }) {
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0); // Add a key to force re-render and trigger transition
  
  useEffect(() => {
    // Function to geocode all venues and create a map with all pins
    const geocodeVenues = async () => {
      try {
        if (!venues || venues.length === 0) {
          // Default world map if no venues - show entire world with zoom 0
          const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,0,0/600x600@2x?access_token=${MAPBOX_TOKEN}`;
          setMapUrl(mapUrl);
          setLoading(false);
          return;
        }

        // Store all geocoded coordinates
        const coordinates = [];
        let selectedCoord = null;
        
        // Geocode each venue
        for (const venue of venues) {
          if (venue && venue.address) {
            try {
              const encodedAddress = encodeURIComponent(venue.address);
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}`
              );
              
              if (response.ok) {
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                  const [longitude, latitude] = data.features[0].center;
                  const isSelected = venue.address === selectedAddress;
                  
                  const coord = { 
                    longitude, 
                    latitude, 
                    name: venue.name || '',
                    address: venue.address,
                    isSelected
                  };
                  
                  if (isSelected) {
                    selectedCoord = coord;
                  }
                  
                  coordinates.push(coord);
                }
              }
            } catch (err) {
              console.error(`Error geocoding ${venue.address}:`, err);
            }
          }
        }
        
        if (coordinates.length === 0) {
          // Default world map if geocoding failed - show entire world
          const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,0,0/600x600@2x?access_token=${MAPBOX_TOKEN}`;
          setMapUrl(mapUrl);
        } else if (coordinates.length === 1) {
          // Single venue
          const { longitude, latitude, isSelected } = coordinates[0];
          // Use a different pin color/size for selected venue
          const pinType = isSelected ? 'pin-l+ff4b4b' : 'pin-l+ffffff';
          const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${pinType}(${longitude},${latitude})/0,0,0,0/600x600@2x?access_token=${MAPBOX_TOKEN}`;
          setMapUrl(mapUrl);
        } else {
          // Multiple venues
          // Create pins for each location with selected pin highlighted
          const pins = coordinates.map(coord => {
            // Use a red, larger pin for selected venue, white smaller pins for others
            const pinType = coord.isSelected ? 'pin-l+ff4b4b' : 'pin-s+ffffff';
            return `${pinType}(${coord.longitude},${coord.latitude})`;
          }).join(',');
          
          // Determine map center and zoom
          // If there's a selected venue, we can focus more on it while still showing world context
          let center = '0,0,0,0'; // Default to world view
          
          if (selectedCoord) {
            // Slightly focus on the selected venue but still show world context
            center = `${selectedCoord.longitude},${selectedCoord.latitude},0.5,0`;
          }
          
          // Create the map URL
          const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${pins}/${center}/600x600@2x?access_token=${MAPBOX_TOKEN}`;
          setMapUrl(mapUrl);
        }
        
        // Increment key to force re-render and trigger transition
        setKey(prev => prev + 1);
        setLoading(false);
      } catch (error) {
        console.error('Map error:', error);
        // Default world map on error - show entire world
        const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,0,0/600x600@2x?access_token=${MAPBOX_TOKEN}`;
        setMapUrl(mapUrl);
        setLoading(false);
      }
    };
    
    geocodeVenues();
  }, [venues, selectedAddress]); // Add selectedAddress to dependencies
  
  if (loading) {
    return <div className={styles.mapLoading}>LOADING MAP</div>;
  }
  
  return (
    <div className={styles.mapContainer}>
      {mapUrl && (
        <img 
          key={key} // Add key to force re-render on url change
          src={mapUrl} 
          alt="Event locations" 
          className={styles.staticMap}
        />
      )}
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and when window is resized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
        
        const eventsData = await client.fetch(query);
        setEvents(eventsData);
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
    // Format date as FRI, MAR 28 style with custom formatting
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

  const getCurrencySymbol = (currencyCode) => {
    switch(currencyCode) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': return '$';
      default: return currencyCode;
    }
  };

  const toggleExpand = (id, address = null) => {
    if (expandedEvent === id) {
      setExpandedEvent(null);
      setSelectedAddress(null);
    } else {
      setExpandedEvent(id);
      setSelectedAddress(address);
    }
  };
  
  // Extract all unique venues from events
  const getAllVenues = () => {
    const venueMap = new Map();
    events.forEach(event => {
      if (event.venue && event.venue.address) {
        venueMap.set(event.venue.address, event.venue);
      }
    });
    return Array.from(venueMap.values());
  };

  if (loading) return <div className={styles.loadingState}>LOADING<span>.</span><span>.</span><span>.</span></div>;
  if (error) return <div className={styles.errorState}>ERROR: {error}</div>;

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const dateKey = new Date(event.date).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {});
  
  // Get all venues for the map
  const allVenues = getAllVenues();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Upcoming Events</h1>
      
      <div className={styles.pageLayout}>
        <div className={styles.eventsContainer}>
          {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
            <div key={dateKey} className={styles.dateGroup}>
              <div className={styles.dateHeader}>
                {formatDate(dateKey)}
              </div>
              
              <div className={styles.eventsList}>
                {dateEvents.map((event) => (
                  <div 
                    key={event._id} 
                    className={styles.eventItem}
                  >
                    <div 
                      className={styles.eventRow} 
                      onClick={() => toggleExpand(event._id, event.venue?.address)}
                    >
                      <div className={styles.posterThumb}>
                        {event.posterUrl && (
                          <img src={event.posterUrl} alt={event.name} />
                        )}
                      </div>
                      <div className={styles.eventInfo}>
                        <h3 className={styles.eventName}>{event.name}</h3>
                        {event.venue?.name && (
                          <div className={styles.eventMeta}>
                            <span className={styles.venueText}>
                              {event.venue.name}
                            </span>
                          </div>
                        )}
                        {event.lineup && event.lineup.length > 0 && (
                          <div className={styles.lineupPreview}>
                            {event.lineup.map(item => item.artist).join(' • ')}
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.actionArea}>
                        {event.price && event.price.amount && (
                          <span className={styles.priceTag}>
                            {getCurrencySymbol(event.price.currency)}{event.price.amount}
                          </span>
                        )}
                        
                        {event.ticketLink && (
                          <a 
                            href={event.ticketLink} 
                            className={styles.ticketBtn}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            TICKETS
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {expandedEvent === event._id && (
                      <div className={styles.expandedContent}>
                        <div className={styles.expandedGrid}>
                          <div className={styles.leftColumn}>
                            {event.venue && event.venue.address && (
                              <div className={styles.addressBlock}>
                                <div className={styles.blockLabel}>LOCATION</div>
                                <div className={styles.blockText}>{event.venue.address}</div>
                              </div>
                            )}
                            
                            {event.lineup && event.lineup.length > 0 && (
                              <div className={styles.lineupBlock}>
                                <div className={styles.blockLabel}>LINEUP</div>
                                <div className={styles.lineupList}>
                                  {event.lineup.map((artist, i) => (
                                    <span key={i} className={styles.lineupArtist}>{artist.artist}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {event.genres && event.genres.length > 0 && (
                              <div className={styles.genreBlock}>
                                <div className={styles.blockLabel}>GENRES</div>
                                <div className={styles.genreList}>
                                  {event.genres.map((genre, i) => (
                                    <span key={i} className={styles.genreTag}>{genre}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {event.description && (
                              <div className={styles.descriptionBlock}>
                                <div className={styles.blockLabel}>ABOUT</div>
                                <div className={styles.descriptionText}>
                                  <PortableText 
                                    value={event.description}
                                    components={{
                                      block: ({children}) => <p>{children}</p>
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {!isMobile && (
          <div className={styles.mapSidebar}>
            <GlobalVenueMap venues={allVenues} selectedAddress={selectedAddress} />
            <div className={styles.mapCaption}>
              GLOBAL LOCATIONS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events; 