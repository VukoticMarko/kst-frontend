import React, { useState } from 'react';
import './test.css';

function Test4Option({qId, answers, text}) {

  const [fourAnswerList, setFourAnswerList] = useState(answers)
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [questionTitle, setQuestionTitle] = useState(text)
  const [questionId, setQuestionId] = useState(qId);
  const [selectedStudentAnswers, setSelectedStudentAnswers] = useState([])
  console.log(fourAnswerList)

  const handleAnswerSelection = (questionId, answer) => {
    const existingIndex = selectedStudentAnswers.findIndex(
      (selectedAnswer) => selectedAnswer.questionId === questionId
    );
    if (existingIndex !== -1) {
      // If questionId exists, update the answer
      selectedStudentAnswers[existingIndex].answer = answer;
    } else {
      // If questionId doesn't exist, add a new entry
      selectedStudentAnswers.push({ questionId, answer });
    }
    console.log(selectedStudentAnswers)
  };

  return (
    <div className="question-container">
      <h2 className="question">{questionTitle}</h2>
      <div className="answer-options">
        {fourAnswerList.map((option) => (
             <div
             key={option.id}
             className={`answer ${selectedAnswer === 'optionA' ? 'selected' : ''}`}
             onClick={() => handleAnswerSelection(questionId, option.correct)}
           >
             {option.text}
           </div>
        ))}
      </div>
    </div>
  );
}

export default Test4Option;
