import React from "react";
import { useNavigate } from 'react-router-dom';

function LoginButton() {

    const navigate = useNavigate()
    const goToLoginPage = () => {
        navigate("/login")
    } 
  
    return(

        <button className="login-button" onClick={goToLoginPage}>Login</button>

    )
}

export default LoginButton;