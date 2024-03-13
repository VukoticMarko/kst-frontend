import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import TestOption from '../../test/test-option.js';
import './static-test.css';
import HeaderWithoutLogo from '../../header/header-without-logo';
import TestOptionShow from './test-option-show.js';

function StaticTest(){

    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [studentAnswers, setStudentAnswers] = useState([])
    const {workId} = useParams()
    const accessToken = localStorage.getItem('accessToken')


    const handleBackButton = () => {
        navigate(-1);
    };
  
    const initStudentAnswers = (data) => {
      setStudentAnswers(data)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(`http://localhost:3000/student-tests/${workId}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              const data = response.data;
              console.log(data)
              setQuestions(data.test.questions)
              initStudentAnswers(data.studentAnswers)
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      fetchData();
      }, [accessToken, workId]);

      return (
        <div>
            <HeaderWithoutLogo></HeaderWithoutLogo>
            <div className='test-container'>
                {questions.map((question) => (
                <TestOptionShow 
                key={question.id} 
                qId={question.id}
                options={question.answers}
                text={question.text}
                disableClick={true}
                selectedStudentAnswers={studentAnswers}               
                />
                ))}
            </div>
            <button onClick={() => handleBackButton()}>Back</button>
        </div>
      )

};
    
export default StaticTest;