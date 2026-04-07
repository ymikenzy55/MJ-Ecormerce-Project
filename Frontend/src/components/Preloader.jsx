import { useState, useEffect } from 'react';

const Preloader = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if this is the first load
    const hasLoaded = localStorage.getItem('hasLoadedBefore');
    
    if (!hasLoaded) {
      setShow(true);
      
      // Hide preloader after 2 seconds
      const timer = setTimeout(() => {
        setShow(false);
        localStorage.setItem('hasLoadedBefore', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary-200 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-primary-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
      </div>
    </div>
  );
};

export default Preloader;
