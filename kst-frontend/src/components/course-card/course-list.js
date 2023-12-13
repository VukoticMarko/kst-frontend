import React, { useState, useEffect } from 'react';
import CourseCard from './course-card'; 

function CourseList({accessToken}){

  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZmlyc3RuYW1lIjoiTWFya28iLCJsYXN0bmFtZSI6Ik1hcmtvdmljIiwiZW1haWwiOiJtYXJrb0BnbWFpbC5jb20iLCJyb2xlcyI6IlN0dWRlbnQiLCJpc0FjdGl2ZSI6dHJ1ZSwic3ViIjozLCJpYXQiOjE3MDI0Mjg2MjksImV4cCI6MTcwNTAyMDYyOX0.1KyfCQMajt_4YP0tU2oQRkJY3AaRMXLogHzyxtnHgt0'

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    console.log('AccessToken:', accessToken);
    fetch('http://localhost:3000/courses', {
    headers: {
      Authorization: `Bearer ${testToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const coursesArray = Array.isArray(data) ? data : data.courses || [];
      setCourses(coursesArray);
    })
    .catch((error) => console.error('Error fetching data:', error));
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
