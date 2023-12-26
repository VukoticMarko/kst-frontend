import React, { useState } from 'react';
import './hidden-form-menu.css'

const HiddenFormMenu = ( {btnName, title, typeForm} ) => {

  const [formVisible, setFormVisible] = useState(false);
  const [userInput, setUserInput] = useState('')

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  const handleButtonClick = async () => {

    // Razmisliti kako ce se dodeljivati id i upisivati ovo sve u bazu
    // Svako pitanje, odgovor i losi odgovori ce biti zasebno slati na backend ovom
    // logikom (posto se kreira 4 ili 6 ovih komponenti na frontu)
    // Kada korisnik klikne dugme salje se sta je uneo u input, koji je tip
    // i to se pakuje u post metodu

    let object = {
      type: '',
      userInput: ''
    }

    // TYPES: wrong1,2,3 | rightAnswer| questionText
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

    try {
      const response = await fetch('http://localhost:3000/postURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ object }),
      });

    } catch (error) {
      console.error('Error during login:', error);
    }
    

  }

  return (
    <div className='wrapper'>
      <button className="menu-rectangle-button" onClick={toggleFormVisibility}>
        {btnName}
        <span className={`arrow ${formVisible ? 'up' : 'down'}`}>&#9662;</span>
      </button>
      {formVisible && (
        <div className="hidden-form">
          <form>
            <label>
              {title}
              <input onChange={(e) => setUserInput(e.target.value)} type="text" />
            </label>
            <button 
            onClick={handleButtonClick}
            className='submit'
            type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HiddenFormMenu;
