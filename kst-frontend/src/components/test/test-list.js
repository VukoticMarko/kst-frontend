import React, { useState, useEffect } from 'react';
import TestCard from './test-card'; 
import axios from 'axios';

function TestList(){

  const [tests, setTests] = useState([]);
  const [course, setCourse] = useState('') // Course that tests belong to
  const accessToken = localStorage.getItem('accessToken')

  const setCourseId = () => {
    setCourse(localStorage.getItem('temporaryCourseID'))
    console.log(localStorage.getItem('temporaryCourseID'))
    //localStorage.removeItem('temporaryCourseID')
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/{' + course + '}/tests', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          const data = response.data;
          const testArray = Array.isArray(data) ? data : data.tests || [];
          console.log('Did not fail')
          setTests(testArray);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    setCourseId();
    fetchData();
  }, [accessToken, course]);

  return (
    <div className="content">
      {tests.map((test) => (
        <TestCard key={test.id} title={test.title} />
      ))}
    </div>
  );
};

export default TestList;
