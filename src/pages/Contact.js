import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import styles from '../styles/Contact.module.css';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        message: formData.message,
      };

      await emailjs.send(
        'service_kt00sqc',
        'template_xg4fkt8',
        templateParams,
        'Mvl_1urAryn87Sfji'  // Updated with your public key
      );

      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      alert('Message sent! We will get back to you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading1}>GET IN TOUCH</h1>
      <p className={styles.subtitle}>
        For any questions or uncertainties, please contact us via DM on Instagram @azulu.worldwide or send an email to{' '}
        <a href="mailto:info@azuluevents.com">info@azuluevents.com</a>
      </p>
      
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            placeholder="Last name"
            value={formData.lastName}
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
        
        <div className={styles.formGroup}>
          <textarea 
            id="message" 
            name="message" 
            rows="4" 
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button type="submit" className={styles.submitBtn}>SUBMIT</button>
      </form>
    </div>
  );
}

export default Contact; 