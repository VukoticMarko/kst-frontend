import React, { useState } from 'react';
import './hidden-form-menu.css'

const HiddenFormMenu = ( {btnName, title, typeForm, addQuestion, addObjectToList, currentState } ) => {

  const [formVisible, setFormVisible] = useState(false);
  const [userInput, setUserInput] = useState('')

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  const handleButtonClick = async () => {

    if (userInput.trim() === '') {
      alert('Input field "'+ title + '" cannot be empty!');
      return;
    }
    
    let object = {
      type: '',
      userInput: ''
    }

    // TYPES: wrongAnswer | rightAnswer | questionText
    if(typeForm === 'questionText'){
      object.type = 'questionText'
      object.userInput = userInput
    }
    if(typeForm === 'rightAnswer'){
      object.type = 'rightAnswer'
      object.userInput = userInput
    }
    if(typeForm === 'wrongAnswer'){
      object.type = 'wrongAnswer'
      object.userInput = userInput
    }

    if(typeForm != 'questionText') {addObjectToList(object)} 
    else {
      addQuestion(object)
    }
    toggleFormVisibility();
  }

  return (
    <div className='wrapper'>
      <button className="menu-rectangle-button" onClick={toggleFormVisibility}>
        {btnName}
        <span className={`arrow ${formVisible ? 'up' : 'down'}`}>&#9662;</span>
      </button>
      {formVisible && (
        <div className="hidden-form">
            <label>
              {title}
              <input onChange={(e) => setUserInput(e.target.value)}
              placeholder={currentState} type="text"/> 
            </label>
            <button 
            onClick={handleButtonClick}
            className='submit'
            type="submit">Submit</button>
        </div>
      )}
    </div>
  );
};

export default HiddenFormMenu;
