import React, { useState, useEffect } from 'react';
import CourseCard from './course-card'; 
import axios from 'axios';

function CourseList(){

  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZmlyc3RuYW1lIjoiTWFya28iLCJsYXN0bmFtZSI6Ik1hcmtvdmljIiwiZW1haWwiOiJtYXJrb0BnbWFpbC5jb20iLCJyb2xlcyI6IlN0dWRlbnQiLCJpc0FjdGl2ZSI6dHJ1ZSwic3ViIjozLCJpYXQiOjE3MDI0Mjg2MjksImV4cCI6MTcwNTAyMDYyOX0.1KyfCQMajt_4YP0tU2oQRkJY3AaRMXLogHzyxtnHgt0'
  const [courses, setCourses] = useState([]);
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {

    console.log('AccessToken:', accessToken);

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/courses', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;
        const coursesArray = Array.isArray(data) ? data : data.courses || [];
        console.log('Did not fail')
        setCourses(coursesArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div className="content">
      {courses.map((course) => (
        <CourseCard key={course.id} title={course.title} />
      ))}
    </div>
  );
};

export default CourseList;
