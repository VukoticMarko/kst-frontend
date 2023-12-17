import React, { useState, useEffect } from 'react';
import TestCard from './test-card'; 
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Test4Option from './test-4-option';
import './test.css';
import Header from '../header/header';
import TestFooter from './test-footer';

function TestWrapper(){

    const [questions, setQuestions] = useState([])
    const {testId} = useParams()
    const accessToken = localStorage.getItem('accessToken')

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(`http://localhost:3000/tests/${testId}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              const data = response.data;
              const questions = data.questions
              const questionArray = Array.isArray(data) ? data : questions || [];
              setQuestions(questionArray);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      fetchData();
      }, [accessToken, testId]);

      return (
        <div>
            <div className='test-container'>
                {questions.map((question) => (
                <Test4Option 
                key={question.id} 
                qId={question.id}
                answers={question.answers}
                text={question.text}/>
                ))}
            </div>
            <TestFooter/>
        </div>
      )

};
    
export default TestWrapper;