# Azulu Website Documentation

## Project Overview
The Azulu website is a React-based application for an event platform, likely for music events or parties in Amsterdam. The application includes pages for home, events, about, contact, and pre-registration functionality.

## Application Structure

### Preloaded Resources in index.js

The `index.js` file serves as the entry point and handles several critical preloaded resources:

1. **Content Management System (CMS) Integration**:
   - Initializes a global content store (`window.azuluContent`) with default values
   - Fetches content from an external API (`https://azulucrm.onrender.com/content`)
   - Stores structured content including moving banner text and about page content

2. **Loading Screen**:
   - Displays a loading animation with the Azulu logo while resources load
   - Uses animation callbacks to detect when preloading is complete

3. **Image Preloading**:
   - Contains functions like `preloadImage` and `preloadAllImages` to cache images
   - Preloads party images using constants (`PARTY_IMAGE_URL`, `PARTY_IMAGE_LOW_QUALITY_URL`)
   - Optimizes image URLs using a helper function `getOptimizedUrl`

4. **Performance Optimizations**:
   - Chrome-specific optimizations including PerformanceObserver for Largest Contentful Paint
   - Resource hints like preconnect and dns-prefetch
   - Animation optimizations using Framer Motion's `animate` function

### App.js Structure

The `App.js` file is relatively simple and follows a standard React Router setup:

1. **Router Configuration**:
   - Uses BrowserRouter from react-router-dom
   - Sets up the main routes for the application

2. **Main Routes**:
   - Home (`/`)
   - Events (`/events`)
   - About (`/about`)
   - Pre-Register (`/pre-register`)
   - Contact (`/contact`)

3. **Global Components**:
   - Includes the Navbar component across all pages

### Pages Breakdown

#### Home Page (Home.js)

The Home page is the most complex and implements several optimization strategies:

1. **Lazy Loading Components**:
   - Uses React's `lazy` and `Suspense` for component code splitting
   - Implements delayed loading with different timeouts for each component based on priority
   - Components: LineUp, Party, Amsterdam, Images, Azulu, Footer

2. **Intersection Observer**:
   - Implements visibility detection for optimized component loading
   - Uses refs to track when components enter the viewport
   - Preloads components based on scroll position

3. **Performance Optimizations**:
   - Efficient scroll listeners with passive flag
   - Uses requestIdleCallback when available
   - Loading placeholders for lazy-loaded components

#### Contact Page (Contact.js)

The Contact page provides a contact form with email integration:

1. **Form Functionality**:
   - Collects first name, last name, email, and message
   - State management using React hooks

2. **External Email Service**:
   - Uses EmailJS for sending emails (`emailjs.send`)
   - Email template: 'template_xg4fkt8'
   - Email service ID: 'service_kt00sqc'
   - Handles success and error states

#### Pre-Register Page (PreRegister.js)

This page handles event pre-registration:

1. **Mailing List Subscription**:
   - Form for collecting name and email
   - Posts data to external API endpoint: 'https://azulucrm.onrender.com/mailing-list/subscribe'
   - Handles loading, success, and error states

2. **UI Features**:
   - Reuses contact form styles
   - Shows feedback messages to users

#### About Page (About.js)

The About page displays information about Azulu events:

1. **Content Loading**:
   - Uses preloaded content from the CMS (window.azuluContent.aboutPage)
   - Splits the content into paragraphs using the split('\n\n') method
   - Displays paragraphs in a container with styling

2. **UI Elements**:
   - Features a decorative grid with interactive hover effects
   - Uses AboutLinks component for displaying social media/external links
   - Implements loading state while content is being prepared

#### Events Page (Events.js)

The Events page displays upcoming and past events:

1. **Component Structure**:
   - Simple container that hosts two main components: UpcomingEvents and PastEvents
   - Uses a common styling approach with CSS modules

2. **Events Data Fetching**:
   - UpcomingEvents component fetches data from: 'https://azulucrm.onrender.com/events/?upcoming=true'
   - PastEvents likely fetches from a similar endpoint with different parameters
   - Events are sorted by date and grouped for display

3. **UI Features**:
   - Events are grouped by date and displayed in an organized list
   - Each event is displayed using the EventCard component
   - Supports expandable event details with toggle functionality

### Component Breakdown

#### Navigation (Navbar.js)
- Main navigation component used across all pages

#### Home Components

1. **Hero.js**:
   - Main landing section with animations
   - First component to load during page initialization

2. **LineUp.js**:
   - Displays event lineup (artists/performers)
   - Lazy-loaded after the Hero component

3. **Party.js**:
   - Information about upcoming party events
   - Uses preloaded images defined by constants:
     ```
     PARTY_IMAGE_URL = "https://res.cloudinary.com/dsjkhhpbl/image/upload/q_auto,f_auto,w_1200/party-crowd_kgnwom"
     PARTY_IMAGE_LOW_QUALITY_URL = "https://res.cloudinary.com/dsjkhhpbl/image/upload/q_10,f_auto,w_50,e_blur:1000/party-crowd_kgnwom"
     ```
   - Implements blur-up image loading pattern for performance
   - Uses intersection observer for triggering animations

4. **Amsterdam.js**:
   - Location-specific information
   - Lower priority component loaded with delay

5. **Images.js**:
   - Gallery of event images
   - Lower priority component loaded with delay

6. **Azulu.js**:
   - About Azulu brand/concept
   - Lower priority component loaded with delay

7. **Footer.js**:
   - Site footer with links
   - Lowest priority component loaded last

#### Event Components

1. **EventCard.js**:
   - Card component for individual events
   - Displays event details: name, venue, time, lineup, ticket status
   - Has expanded view with additional information
   - Uses currency formatting and time formatting utilities
   - Supports rich content with PortableText from Sanity.io

2. **UpcomingEvents.js**:
   - Component to display future events
   - Fetches data from API: 'https://azulucrm.onrender.com/events/?upcoming=true'
   - Groups events by date for organized display
   - Implements loading, error, and empty states
   - Formats dates and times for display

3. **PastEvents.js**:
   - Component to display previous events
   - Similar structure to UpcomingEvents but focuses on past events

### External API Calls

1. **Content Management System**:
   - URL: `https://azulucrm.onrender.com/content`
   - Purpose: Fetches dynamic content including banner text and about page content
   - Called in: index.js during application initialization
   - Structure: Array of content items with keys like 'movingBanner' and 'aboutPage'

2. **Email Service**:
   - Service: EmailJS
   - URL: Uses EmailJS SDK (`emailjs.send`)
   - Purpose: Sends contact form submissions
   - Called in: Contact.js when form is submitted
   - Parameters: service_kt00sqc (service ID), template_xg4fkt8 (template ID)

3. **Mailing List API**:
   - URL: `https://azulucrm.onrender.com/mailing-list/subscribe`
   - Purpose: Registers users for the mailing list
   - Called in: PreRegister.js when subscription form is submitted
   - Data: Sends name and email

4. **Events API**:
   - URL: `https://azulucrm.onrender.com/events/?upcoming=true`
   - Purpose: Fetches upcoming events data
   - Called in: UpcomingEvents.js component
   - Processing: Sorts events by start time and groups by date

5. **Image CDN**:
   - Service: Cloudinary
   - URLs: Various optimized image URLs in components (especially Party.js)
   - Purpose: Serves optimized images with different quality parameters
   - Example: Using blur-up technique with low-quality placeholders

## Styling
- Uses CSS modules for component-specific styling
- Modular CSS files in the /styles directory
- Responsive design with media queries
- Some components use advanced CSS for decorative elements (About page grid)

## Performance Optimizations
- Code splitting with React.lazy and dynamic imports
- Image preloading and optimization with blur-up technique
- Intersection Observer for optimized component loading
- Chrome-specific performance optimizations
- Animation optimizations with Framer Motion
- Passive event listeners for scroll events 