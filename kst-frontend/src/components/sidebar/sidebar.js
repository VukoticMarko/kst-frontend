import React, { useEffect } from 'react';
import './sidebar.css';
import AccountImage from '../../images/account.png';
import CoursesImage from '../../images/courses.png';
import { useNavigate } from 'react-router-dom';

function Sidebar(){

const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
        const headerElement = document.querySelector('.header-main');
        if (headerElement) {
            const headerHeight = headerElement.offsetHeight;
            document.querySelector('.sidebar').style.marginTop = `${headerHeight}px`;
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const goToAccountPage = () => {
    navigate("/account")
  }

  const goToCoursesPage = () => {
    navigate("/courses")
  }

  return (
    <div className="sidebar">
      <div onClick={goToAccountPage}>
        <img style={{cursor: 'pointer'}} src={AccountImage} />
      </div>
      <div onClick={goToCoursesPage}>
        <img style={{cursor: 'pointer'}} src={CoursesImage} />
      </div>
    </div>
  );
};

export default Sidebar;