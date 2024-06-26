import React, { useState, useEffect } from 'react';
import TestCard from './test-card'; 
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TestList(){

  const [tests, setTests] = useState([]);
  const {courseId} = useParams()
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/courses/${courseId}/tests`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          const data = response.data;
          const testArray = Array.isArray(data) ? data : data.tests || [];
          setTests(testArray);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    fetchData();
  }, [accessToken, courseId]);

  return (
    <div className="content">
      {tests.map((test) => (
        <TestCard key={test.id} id={test.id} title={test.title} time={test.createdAt} courseId={courseId} />
      ))}
    </div>
  );
};

export default TestList;
