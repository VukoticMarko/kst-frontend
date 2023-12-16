import React, { useState, useEffect } from 'react';
import TestCard from './test-card'; 
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TestWrapper(){
    // TODO: Fetch all questions and then place them on the front
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(`http://localhost:3000/test`, {
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
        <div></div>
      )

};
    
export default TestWrapper;