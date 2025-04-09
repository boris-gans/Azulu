import React, { useState } from 'react';
import styles from '../styles/Contact.module.css'; // Reuse Contact styles

function PreRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', isError: false });
    
    try {
      // const response = await fetch('https://azulucms.onrender.com/mailing-list/subscribe', {
      const response = await fetch('http://0.0.0.0:8000/mailing-list/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage({ 
          text: 'Thank you for subscribing! You\'ll be the first to hear about our upcoming events.', 
          isError: false 
        });
        setFormData({ name: '', email: '' });
      } else {
        setMessage({ 
          text: `Error: ${result.detail || 'Something went wrong. Please try again.'}`, 
          isError: true 
        });
      }
    } catch (error) {
      console.error('Error subscribing to mailing list:', error);
      setMessage({ 
        text: 'Unable to connect to the server. Please try again later.', 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading1}>JOIN OUR MAILING LIST</h1>
      <p className={styles.subtitle}>
        Stay updated with the latest events, announcements, and exclusive offers from Azulu. 
        Be the first to know when tickets go on sale.
      </p>
      
      {message.text && (
        <div className={`${styles.message} ${message.isError ? styles.errorMessage : styles.successMessage}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  );
}

export default PreRegister; 