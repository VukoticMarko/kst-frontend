import React, { useState } from 'react';

function CreateTest() {
  const [testTitle, setTestTitle] = useState('');
  const [course, setCourse] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [testFlow, setTestFlow] = useState([]);

  const addQuestion = () => {
    if (currentQuestion.trim() !== '') {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion('');
    }
  };

  const addAnswer = () => {
    if (currentAnswer.trim() !== '') {
      setAnswers([...answers, currentAnswer]);
      setCurrentAnswer('');
    }
  };

  const addQuestionToFlow = (questionIndex) => {
    setTestFlow([...testFlow, questionIndex]);
  };

  return (
    <div className="test-creation-container">
      <div>
        <label htmlFor="testTitle">Test Title:</label>
        <input
          type="text"
          id="testTitle"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="course">Course:</label>
        <input
          type="text"
          id="course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
      </div>
      <div>
        <h2>Questions:</h2>
        <input
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
        />
        <button onClick={addQuestion}>Add Question</button>
        <ul>
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Answers:</h2>
        <input
          type="text"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
        />
        <button onClick={addAnswer}>Add Answer</button>
        <ul>
          {answers.map((answer, index) => (
            <li key={index}>{answer}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Test Flow:</h2>
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              {question}{' '}
              <button onClick={() => addQuestionToFlow(index)}>Add to Flow</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CreateTest;
