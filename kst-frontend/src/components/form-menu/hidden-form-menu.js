import React, { useState } from 'react';
import './hidden-form-menu.css'

const HiddenFormMenu = ( {btnName, title, typeForm, addObjectToList, currentState} ) => {

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

    // TYPES: wrong1,2,3 | rightAnswer| questionText, questionLevel
    if(typeForm === 'questionText'){
      object.type = 'questionText'
      object.userInput = userInput
    }
    if(typeForm === 'rightAnswer'){
      object.type = 'rightAnswer'
      object.userInput = userInput
    }
    if(typeForm === 'wrong1'){
      object.type = 'wrong1'
      object.userInput = userInput
    }
    if(typeForm === 'wrong2'){
      object.type = 'wrong2'
      object.userInput = userInput
    }
    if(typeForm === 'wrong3'){
      object.type = 'wrong3'
      object.userInput = userInput
    }

    addObjectToList(object)
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
              value={userInput !== undefined ? userInput : currentState}
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
