import React, { useEffect, useState } from 'react';
import Header from '../header/header';
import  "./login.css";
import { useNavigate } from 'react-router-dom';
import HeaderWithoutLogo from '../header/header-without-logo';

function Login({setAccessToken}) {

  const navigation = useNavigate()

  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => { // Temp
    localStorage.clear()
  })

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userRole', data.userWithoutPass.roles)
        setAccessToken(data.accessToken)
        navigation("/courses")

      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const goBack = () => {
      navigation("/")
  }
  return (
    <div>
      <HeaderWithoutLogo></HeaderWithoutLogo>
      <div id='login-container'>
        <div>
            <label htmlFor="username"><b>Email:</b></label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              value={email}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="password"><b>Password:</b></label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>
          <button onClick={handleLogin}>Login</button>
        <div className="container-bottom">
            <button type="button" className="cancelbtn" onClick={goBack}>Cancel</button>
            <span className="psw"><a href="#">Forgot password?</a></span>
        </div>
      </div>     
    </div>
  );
};

export default Login;
