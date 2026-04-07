import { useState, useEffect } from 'react';

const Preloader = () => {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if this is the first load
    const hasLoaded = localStorage.getItem('hasLoadedBefore');
    
    if (!hasLoaded) {
      setShow(true);
      
      // Start fade out after 1.5 seconds
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1500);

      // Hide preloader after fade out completes
      const hideTimer = setTimeout(() => {
        setShow(false);
        localStorage.setItem('hasLoadedBefore', 'true');
      }, 2000);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Elegant circular spinner */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="w-24 h-24 border-4 border-light-border rounded-full"></div>
        {/* Spinning ring */}
        <div className="w-24 h-24 border-4 border-primary rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
      </div>
      
      {/* Brand text */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dark mb-2">MJ Electricals</h1>
        <p className="text-base text-gray-600">Loading your experience...</p>
      </div>
    </div>
  );
};

export default Preloader;
