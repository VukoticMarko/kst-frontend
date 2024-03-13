import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import TestOption from '../../test/test-option.js';
import './static-test.css';
import HeaderWithoutLogo from '../../header/header-without-logo';

function StaticTest(){

    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const {workId} = useParams()
    const accessToken = localStorage.getItem('accessToken')

    const mapStudentAnswersToQuestions = (questions, studentAnswers) => {
        return questions.map(question => {
          // Find the student's answer to the current question
          const studentAnswer = studentAnswers.find(sa => sa.question.id === question.id);
          // If there is a student's answer, mark it as selected
          if (studentAnswer) {
            return {
              ...question,
              answers: question.answers.map(answer => ({
                ...answer,
                isSelected: answer.id === studentAnswer.answer.id
              }))
            };
          }
          return question;
        });
      };

    const handleBackButton = () => {
        navigate(-1);
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
                <TestOption 
                key={question.id} 
                qId={question.id}
                options={question.answers}
                text={question.text}
                />
                ))}
            </div>
            <button onClick={() => handleBackButton()}>Back</button>
        </div>
      )

};
    
export default StaticTest;