import React, { useState, useEffect } from 'react';
import CourseCard from './course-card'; 

function CourseList(){
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/courses', {
        headers: {
        //Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      }) 
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="content">
      {courses.map((course) => (
        <CourseCard key={course.id} title={course.title} />
      ))}
    </div>
  );
};

export default CourseList;
