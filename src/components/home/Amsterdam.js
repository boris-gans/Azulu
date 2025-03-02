import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from '../../styles/Amsterdam.module.css';

const Amsterdam = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <div className={styles.amsterdamContainer} ref={ref}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img 
            src="/assets/icons/Amsterdam.svg" 
            alt="Made in Amsterdam" 
            className={styles.logo}
          />
        </div>
        <div className={styles.addressContainer}>
          <motion.h2 
            className={styles.address}
            initial={{ x: 100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              type: "spring", 
              stiffness: 120, 
              damping: 20,
              opacity: { duration: 0.5 }
            }}
          >
            AMSTERDAM, NL
          </motion.h2>
        </div>
      </div>
    </div>
  );
};

export default Amsterdam;
