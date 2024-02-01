import React from 'react';
import './question-mark.css';

function QuestionMark({ message }){
  return (
    <div className="question-mark-container">
      <div className="question-mark">
        ?
        <div className="bubble-message">{message}</div>
      </div>
    </div>
  );
};

export default QuestionMark;