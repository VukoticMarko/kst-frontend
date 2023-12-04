import React, { useState } from 'react';
import Header from '../header';
import  "../../css/login.css";
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigation = useNavigate()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Make a request to your backend for authentication
      const response = await fetch('http://your-backend-api-url/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Handle successful login, e.g., store the token in local storage
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log('Login successful!');
      } else {
        // Handle unsuccessful login
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
      <Header></Header>
      <div id='login-container'>
        <div>
            <label htmlFor="username"><b>Username:</b></label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              value={username}
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
