import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      setTimeout(() => {
        trail.style.left = mouseX + 'px';
        trail.style.top = mouseY + 'px';
      }, 80);
    };

    const addHover = () => cursor.classList.add('cursor-hover-btn');
    const removeHover = () => cursor.classList.remove('cursor-hover-btn');

    document.addEventListener('mousemove', move);

    const observe = () => {
      document.querySelectorAll('.btn-pill, a, button, [role="button"]').forEach((el) => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    };

    observe();
    const interval = setInterval(observe, 2000);

    return () => {
      document.removeEventListener('mousemove', move);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Main PenTool cursor */}
      <div ref={cursorRef} className="custom-cursor hidden lg:block">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff7a18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      </div>
      {/* Trail dot */}
      <div ref={trailRef} className="custom-cursor-trail hidden lg:block" />
    </>
  );
}
