import React, { useState, useEffect } from 'react';
import CourseCard from './course-card'; 
import axios from 'axios';

function CourseList(){

  const [courses, setCourses] = useState([]);
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/courses/all', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;
        const coursesArray = Array.isArray(data) ? data : data.courses || [];
        setCourses(coursesArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [accessToken]);

  return (
    <div className="content" style={{marginTop: '30px'}}>
      {courses.map((course) => (
        <CourseCard key={course.id} id={course.id} title={course.title} />
      ))}
    </div>
  );
};

export default CourseList;
