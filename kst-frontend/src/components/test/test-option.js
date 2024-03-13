import React, { useState, useEffect } from 'react';
import './test.css';

function TestOption({ qId, options, text, onAnswerSelection, disableClick, selectedStudentAnswers }) {
  
  const [optionList, setOptionList] = useState(options);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For visual update
  const [questionTitle] = useState(text);
  const [question_id] = useState(qId);
  const selectedAnswerId = selectedStudentAnswers?.find(sa => sa.question.id === question_id)?.answer.id;
  console.log(selectedStudentAnswers)


  useEffect(() => {
    // if(selectedStudentAnswers){
    //   selectedStudentAnswers.array.forEach(ssa => {
    //     setSelectedAnswer(ssa.id)
    //   });
    // }
  }, []);

  const handleAnswerSelection = (question_id, answer_id) => {
    setSelectedAnswer(answer_id);
    if (onAnswerSelection) {
      const answer = {
        'question_id': question_id,
        'answer_id': answer_id
      }
      onAnswerSelection(answer);
    }
  };

  return (
    <div className="question-container">
      <h2 className="question">{questionTitle}</h2>
      <div className="answer-options">
        {optionList.map((option) => (
          <div
            key={option.id}
            className={`answer ${selectedAnswerId === option.id ? 'selected' : ''}`}
            onClick={disableClick ? null : () => handleAnswerSelection(question_id, option.id)}
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestOption;
