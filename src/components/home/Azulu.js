import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/components/Azulu.module.css';
import { motion, useScroll, useTransform, useAnimation, useMotionValue, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function Azulu() {
  // For scroll-based animations
  const { scrollYProgress } = useScroll();
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  
  // For text reveal animations
  const [founderRef, founderInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [brandRef, brandInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Text reveal variants
  const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  // Brand name letter animation
  const brandLetters = "AZULU".split("");
  const letterRefs = useRef(brandLetters.map(() => React.createRef()));
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  useEffect(() => {
    if (hoveredIndex === null) {
      // Reset all letters when nothing is hovered
      letterRefs.current.forEach((ref) => {
        if (ref.current) {
          animate(ref.current, { scale: 1 }, { duration: 0.6, ease: [0.32, 0.72, 0, 1] });
        }
      });
    } else {
      // Apply ripple effect
      letterRefs.current.forEach((ref, index) => {
        if (ref.current) {
          const distance = Math.abs(hoveredIndex - index);
          const scale = 1 + Math.max(0, (5 - distance) / 200);
          animate(ref.current, { scale }, { duration: 0.6, ease: [0.32, 0.72, 0, 1] });
        }
      });
    }
  }, [hoveredIndex]);
  
  return (
    <div className={styles.azuluContainer}>
      <div className={styles.azuluContent}>
        {/* Logo and established section with scroll effect */}
        <motion.div 
          className={styles.logoSection}
          style={{ opacity: logoOpacity, scale: logoScale }}
        >
          <motion.img 
            src="/assets/icons/logoBlack.svg" 
            alt="Azulu Logo" 
            className={styles.logo}
          />
        </motion.div>
        
        {/* Description section with scroll reveal */}
        <motion.div 
          ref={founderRef}
          className={styles.descriptionSection}
          initial="hidden"
          animate={founderInView ? "visible" : "hidden"}
          variants={textReveal}
        >
          <motion.p 
            className={styles.founderText}
          >
CREATED BY BENJA, THE NEW PRODIGY IN AFRO/DEEP HOUSE MUSIC, AZULU BRINGS YOU INTO THE REVOLUTIONARY WORLD OF MUSIC. BENJA IS KNOWN FOR HIS NEW RECORD 'YAMORE' IN COLLABORATION WITH THE AFROHOUSE LEADING MOBLACKRECORDS.
          </motion.p>
        </motion.div>
        
        {/* Large brand name with letter animation - with ripple hover effect */}
        <motion.div 
          ref={brandRef}
          className={styles.brandNameSection}
          initial="hidden"
          animate={brandInView ? "visible" : "hidden"}
        >
          <div className={styles.brandName} style={{ 
            fontSize: 'clamp(6rem, 20vw, 25rem)',
            fontWeight: 'bold',
            display: 'flex',
            width: '100%',
            position: 'relative',
            justifyContent: 'space-between',
            overflow: 'visible',

          }}>
            {brandLetters.map((letter, index) => (
              <motion.span
                key={index}
                ref={letterRefs.current[index]}
                initial={{ opacity: 0, y: 20 }}
                animate={brandInView ? { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.1,
                    duration: 0.5
                  }
                } : {}}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  display: 'inline-block',
                  margin: '0',
                  position: 'relative',
                  width: 'auto',
                  marginLeft: index === brandLetters.length - 1 ? '-0.2em' : '0',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
        
        {/* Mission statement with scroll reveal */}
        <motion.div 
          ref={missionRef}
          className={styles.missionSection}
          initial="hidden"
          animate={missionInView ? "visible" : "hidden"}
          variants={textReveal}
        >
          <motion.p 
            className={styles.missionText}
          >
            WE ELEVATE EACH EXPERIENCE WITH A TAPESTRY OF FASHION AND ART, ENRICHING EVERY EVENT WITH 
            AN EXTRA TOUCH OF CREATIVITY. ADDITIONALLY, WE SPOTLIGHT UPCOMING ARTISTS, SUPPORTING 
            THEIR CAREERS WHILE EVOLVING OUR CONCEPT TO NEW HEIGHTS.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Azulu; 