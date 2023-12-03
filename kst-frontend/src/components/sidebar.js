import React, { useEffect } from 'react';
import '../css/sidebar.css';

function Sidebar(){

useEffect(() => {
    const handleScroll = () => {
        const headerHeight = document.querySelector('.header').offsetHeight;
        document.querySelector('.sidebar').style.marginTop = `${headerHeight}px`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    }, []);

  return (
    <div className="sidebar">
      <a href="#">Button 1</a>
      <a href="#">Button 2</a>
    </div>
  );
};

export default Sidebar;