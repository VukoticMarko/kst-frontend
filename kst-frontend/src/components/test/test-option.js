import React, { useState } from 'react';
import './test.css';

function TestOption({ qId, options, text, onAnswerSelection }) {
  
  const [optionList] = useState(options);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For visual update
  const [questionTitle] = useState(text);
  const [question_id] = useState(qId);
  //console.log(selectedStudentAnswers)
  console.log(optionList)

  const handleAnswerSelection = (question_id, answer_id) => {
    const answer = {
      'question_id': question_id,
      'answer_id': answer_id
    }
    setSelectedAnswer(answer_id)
    onAnswerSelection(answer)
  };

  return (
    <div className="question-container">
      <h2 className="question">{questionTitle}</h2>
      <div className="answer-options">
        {optionList.map((option) => (
          <div
            key={option.id}
            className={`answer ${selectedAnswer === option.id ? 'selected' : ''}`}
            onClick={() => handleAnswerSelection(question_id, option.id)}
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestOption;
