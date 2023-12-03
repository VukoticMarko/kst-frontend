import React from 'react';
import logo from "../images/randomLogo.png"
import '../css/header.css'

function Header(){
  return (
    <div className="header">
        <div>
            <img src={logo} alt='Placeholder image' style={{ height: "38px", width: "38px"}}/>
        </div>
      <div className="app-name">Knowledge Space Theory Platform</div>
      <button className="login-button">Login</button>
    </div>
  );
};

export default Header;
