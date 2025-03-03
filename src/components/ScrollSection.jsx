import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollSection.css';

const ScrollSection = ({ 
  children, 
  speed = 1, 
  className = '', 
  direction = 'vertical',
  fadeIn = false,
  scale = false,
  delay = 0
}) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    // Create the animations when component mounts
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Parallax effect
    if (direction === 'vertical') {
      tl.to(content, {
        y: `${speed * 100}px`,
        ease: 'none',
        duration: 1
      }, 0);
    } else if (direction === 'horizontal') {
      tl.to(content, {
        x: `${speed * 100}px`,
        ease: 'none',
        duration: 1
      }, 0);
    }

    // Add fade-in effect
    if (fadeIn) {
      gsap.fromTo(
        content, 
        { opacity: 0 }, 
        { 
          opacity: 1, 
          duration: 1.2, 
          delay: delay,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Add scale effect
    if (scale) {
      gsap.fromTo(
        content, 
        { scale: 0.8 }, 
        { 
          scale: 1, 
          duration: 1.2, 
          delay: delay, 
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    return () => {
      // Clean up ScrollTrigger instances when component unmounts
      tl.scrollTrigger && tl.scrollTrigger.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [speed, direction, fadeIn, scale, delay]);

  return (
    <div ref={sectionRef} className={`scroll-section ${className}`}>
      <div ref={contentRef} className="scroll-content">
        {children}
      </div>
    </div>
  );
};

export default ScrollSection; 