import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PageReveal = ({ children, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Animate the immediate children of this container
    const childrenElements = el.children;

    gsap.fromTo(
      childrenElements,
      { 
        opacity: 0, 
        y: 30, 
        rotationX: 2,
        filter: 'blur(3px)'
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%', 
          toggleActions: 'play none none none' 
          // 'play none none none' ensures it plays once and doesn't reverse when scrolling up
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default PageReveal;
