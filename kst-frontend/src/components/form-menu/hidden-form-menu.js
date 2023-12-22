import React, { useState } from 'react';
import './hidden-form-menu.css'

const HiddenFormMenu = ( {btnName, title} ) => {
  const [formVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  return (
    <div className='wrapper'>
      <button className="menu-rectangle" onClick={toggleFormVisibility}>
        {btnName}
        <span className={`arrow ${formVisible ? 'up' : 'down'}`}>&#9662;</span>
      </button>
      {formVisible && (
        <div className="hidden-form">
          <form>
            <label>
              {title}
              <input type="text" />
            </label>
            <button 
            className='submit'
            type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HiddenFormMenu;
