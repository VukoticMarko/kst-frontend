import React, { useState } from 'react';
import './test.css';

function Test4Option() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="question-container">
      <h2 className="question">What is your favorite programming language?</h2>
      <div className="answer-options">
        <div
          className={`answer ${selectedAnswer === 'optionA' ? 'selected' : ''}`}
          onClick={() => handleAnswerSelection('optionA')}
        >
          Option A: JavaScript
        </div>
        <div
          className={`answer ${selectedAnswer === 'optionB' ? 'selected' : ''}`}
          onClick={() => handleAnswerSelection('optionB')}
        >
          Option B: Python
        </div>
        <div
          className={`answer ${selectedAnswer === 'optionC' ? 'selected' : ''}`}
          onClick={() => handleAnswerSelection('optionC')}
        >
          Option C: Java
        </div>
        <div
          className={`answer ${selectedAnswer === 'optionD' ? 'selected' : ''}`}
          onClick={() => handleAnswerSelection('optionD')}
        >
          Option D: Ruby
        </div>
      </div>
    </div>
  );
}

export default Test4Option;
