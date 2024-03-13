import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import TestOption from './test-option';
import './test.css';
import TestFooter from './test-footer';
import HeaderWithoutLogo from '../header/header-without-logo';

function TestWrapper(){

    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const {testId} = useParams()
    const accessToken = localStorage.getItem('accessToken')
    const [studentAnswers, setStudentAnswers] = useState([]) // For backend
    const [remainingTime, setRemainingTime] = useState(3600);
    const [testTitle, setTestTitle] = useState('temp')

    useEffect(() => {
      if (remainingTime <= 0) {
          // Time's up, show message and submit answers
          alert("Time's up!");
          handleSubmitButton();
          return;
      }

      // Set up the interval to tick down every second
      const intervalId = setInterval(() => {
          setRemainingTime(remainingTime - 1);
      }, 1000);

      // Clear the interval when component unmounts or when the timer reaches 0
      return () => clearInterval(intervalId);
    }, [remainingTime]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelection = (newAnswer) => {
        const updatedAnswers = studentAnswers.map((answer) =>
          answer.question_id === newAnswer.question_id ? newAnswer : answer
        );
      
        if (!updatedAnswers.some((answer) => answer.question_id === newAnswer.question_id)) {
          updatedAnswers.push(newAnswer);
        }
        setStudentAnswers(updatedAnswers);
        console.log(studentAnswers)
    };

    const handleSubmitButton = () => {

      // Handling unanswered questions
      const completeAnswers = questions.map(question => {
        // Check if the question has been answered
        const existingAnswer = studentAnswers.find(answer => answer.question_id === question.id);
        if (existingAnswer) {
            return existingAnswer;
        } else {
            // Randomly select an answer for the question
            const randomAnswerIndex = Math.floor(Math.random() * question.answers.length);
            return {
                question_id: question.id,
                selectedAnswer: question.answers[randomAnswerIndex].id,
            };
        }
      });

        let test_id = parseInt(testId)
        const object = {
            'title': testTitle,
            'test_id': test_id,
            'studentAnswers': studentAnswers
        }
        console.log(object)
        let flag = 0
        const postData = async () => {
            try {
              const response = await axios.post(
                `http://localhost:3000/student-tests`,
                object,
                {
                    headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    },
                },
              );
              console.log(response)
            } catch (error) {
                if (error.response?.data && error.response.data.message === 'All questions from test should be answered') {
                    alert('All questions from test should be answered!');
                    flag = 1
                  } else {
                    console.error('Error details:', error.response?.data || error.message);
                    flag = 1
                }
                console.error('Error posting data:', error.response?.data || error.message);
            }
            if(flag !== 1){
                navigate('/courses')
            }
          };
        postData();
    };

    // function shuffleArray(array) {
    //     for (let i = array.length - 1; i > 0; i--) {
    //       const j = Math.floor(Math.random() * (i + 1));
    //       [array[i], array[j]] = [array[j], array[i]];
    //     }
    //     return array;
    //   }      

    function shuffleArrayAnswers(array) {
        array.forEach(question => {
          const answers = question.answers;
          for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
          }
        });
      }

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
              setTestTitle(data.title)
              const questionArray = Array.isArray(data) ? data : questions || [];
              //let shuffledArray = shuffleArray(questionArray)
              //console.log(shuffledArray)
              shuffleArrayAnswers(questionArray)
              setQuestions(questionArray);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      fetchData();
      }, [accessToken, testId]);

      return (
        <div>
            <HeaderWithoutLogo></HeaderWithoutLogo>
            <div className='timer-container' style={{position: 'fixed', top: '10px', right: '10px', zIndex: 1000}}>
                {formatTime(remainingTime)}
            </div>
            <div className='test-container'>
                {questions.map((question) => (
                <TestOption 
                key={question.id} 
                qId={question.id}
                options={question.answers}
                text={question.text}
                onAnswerSelection={handleAnswerSelection}/>
                ))}
            </div>
            <TestFooter submitButton={handleSubmitButton}/>
        </div>
      )

};
    
export default TestWrapper;