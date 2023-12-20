import React, { useEffect, useState } from 'react';
import './sidebar.css';
import AccountImage from '../../images/account.png';
import CoursesImage from '../../images/courses.png';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderHeight(document.querySelector('.header-main').offsetHeight);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const goToAccountPage = () => {
    navigate('/account');
  };

  const goToCoursesPage = () => {
    navigate('/courses');
  };

  return (
    <div className="sidebar">
      <div onClick={goToAccountPage}>
        <img style={{ cursor: 'pointer' }} src={AccountImage} alt="Account" />
      </div>
      <div onClick={goToCoursesPage}>
        <img style={{ cursor: 'pointer' }} src={CoursesImage} alt="Courses" />
      </div>
    </div>
  );
}

export default Sidebar;
