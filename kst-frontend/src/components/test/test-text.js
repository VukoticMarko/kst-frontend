import React, { useState } from 'react';
import './test-text.css';

function TestText() {
  const [userAnswer, setUserAnswer] = useState('');

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
  };

  return (
    <div className="text-question-container">
      <h2 className="text-question">What is your favorite programming language?</h2>
      <div className="text-answer">
        <input
          type="text"
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default TestText;
