import React from 'react';
import logo from "../../images/randomLogo.png"
import './header.css'
import { useNavigate } from 'react-router-dom';

function Header( {children} ){

  const navigate = useNavigate()
  const homeLogo = () => {
    navigate("/")
  }

  return (
    <div className="header-main">
        <div>
            <img src={logo} alt='Placeholder image' 
            style={{ height: "38px", width: "38px", cursor: "pointer"}}
            onClick={homeLogo}/>
        </div>
      <div className="app-name">Knowledge Space Theory Platform</div>
      {children}
    </div>
  );
};

export default Header;
