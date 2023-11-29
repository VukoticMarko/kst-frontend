import React from 'react';
import '../css/course-card.css';
import { handleRectangleClick } from '../api/course-card-api';

const CourseCard = ({ color, title }) => {
    const onClick = () => {
        handleRectangleClick(1); 
      };

  return (
    <div className="rectangle" style={{ backgroundColor: color }}>
      <div className="footer">{title}</div>
    </div>
  );
};

export default CourseCard;