import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HorizontalScroll.css';

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = ({ children, speed = 1, className = '' }) => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const trigger = triggerRef.current;
    
    if (!section || !content || !trigger) return;

    // Calculate the width of the horizontal content
    const calculateWidth = () => {
      // Get width of all child elements combined
      const contentWidth = content.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      // Set section height based on content width to allow scrolling
      // This creates a scroll distance proportional to content width
      const height = (contentWidth - viewportWidth) * speed + viewportWidth;
      section.style.height = `${height}px`;
      
      return { contentWidth, viewportWidth };
    };

    const { contentWidth, viewportWidth } = calculateWidth();

    // Create horizontal scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
        pin: content,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Animate horizontal movement
    tl.to(content, {
      x: -(contentWidth - viewportWidth),
      ease: 'none',
      duration: 1
    });

    // Update dimensions on window resize
    const handleResize = () => {
      calculateWidth();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
      tl.kill();
    };
  }, [speed]);

  return (
    <section ref={sectionRef} className={`horizontal-scroll-section ${className}`}>
      <div ref={triggerRef} className="scroll-trigger">
        <div ref={contentRef} className="horizontal-content">
          {children}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll; 