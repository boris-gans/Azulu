import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './MagneticElement.css';

const MagneticElement = ({ 
  children, 
  className = '', 
  strength = 30, 
  dampening = 0.1,
  reverse = false
}) => {
  const elementRef = useRef(null);
  const activeArea = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Update element bounds initially and on resize
    const updateBounds = () => {
      const rect = element.getBoundingClientRect();
      activeArea.current = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
    };

    // Set up GSAP context
    const ctx = gsap.context(() => {
      // Reset position when not hovering
      gsap.set(element, { x: 0, y: 0 });
    });

    // Mouse move event handler
    const handleMouseMove = (event) => {
      if (!isHovering.current) return;

      // Calculate normalized position
      const rect = activeArea.current;
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      
      // Calculate distance from center (normalized from -1 to 1)
      const distanceX = (event.clientX - centerX) / (rect.width / 2);
      const distanceY = (event.clientY - centerY) / (rect.height / 2);
      
      // Apply strength and direction
      const moveX = distanceX * strength * (reverse ? -1 : 1);
      const moveY = distanceY * strength * (reverse ? -1 : 1);
      
      // Animate with GSAP for smooth movement
      gsap.to(element, {
        x: moveX,
        y: moveY,
        duration: dampening,
        ease: "power2.out"
      });
    };

    // Mouse enter handler
    const handleMouseEnter = () => {
      isHovering.current = true;
      updateBounds();
      
      // Optional scale effect on hover
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: "power1.out"
      });
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      isHovering.current = false;
      
      // Return to original position
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    // Add event listeners
    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      // Clean up
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      ctx.revert();
    };
  }, [strength, dampening, reverse]);

  return (
    <div ref={elementRef} className={`magnetic-element ${className}`}>
      {children}
    </div>
  );
};

export default MagneticElement; 