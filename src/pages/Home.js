import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Pages.module.css';
import Hero from '../components/home/Hero';
import LineUp from '../components/home/LineUp';
import Party from '../components/home/Party';
import Amsterdam from '../components/home/Amsterdam';
import Images from '../components/home/Images';
import Azulu from '../components/home/Azulu';
import Footer from '../components/home/Footer';

function Home() {
  return (
    <motion.div 
      className={styles.homeContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <LineUp />
      <Party />
      <Amsterdam />
      <Images />
      <Azulu />
      <Footer />
    </motion.div>
  );
}

export default Home; 