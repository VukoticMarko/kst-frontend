import React from "react";
import { useNavigate } from 'react-router-dom';

function LogoutButton() {

    const navigate = useNavigate()
    const logout = () => {
        navigate("/")
    } 
  
    return(

        <button className="logout-button" onClick={logout}>Logout</button>

    )
}

export default LogoutButton;