import React, { useState } from 'react';
import './test-footer.css';

function TestFooter({ onSubmit }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleButtonClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onSubmit(); // Call the onSubmit function passed as a prop
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="text-footer-container">
      <button onClick={handleButtonClick}>Submit Answers</button>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you are done with your answers?</p>
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </div>
  );
}

export default TestFooter;
