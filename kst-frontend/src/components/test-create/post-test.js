import React, { useEffect, useState } from 'react';
import  "../login/login.css";
import { useNavigate, useParams } from 'react-router-dom';

function PostTest({graph}) {

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const accessToken = localStorage.getItem('accessToken')
  const {courseId} = useParams();

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/postTest', {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        navigate(`/createTest/${courseId}`, { state: { graph: graph } });

      } else {
        console.error('Error with post function.');
      }
    } catch (error) {
      console.error('Error during posting:', error);
    }
  };

  const goBack = () => {
    navigate(`/chooseGraph/${courseId}`);
  }

  return (
    <div>
      <div id='login-container'>
        <div>
            <label htmlFor="username"><b>Test Name:</b></label>
            <input
              type="text"
              id="title"
              placeholder="Enter new test name"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
        </div>
          <button onClick={handleClick}>Create Test</button>
          <div className="container-bottom">
            <button type="button" className="cancelbtn" onClick={goBack}>Back</button>
        </div>
      </div>     
    </div>
  );
};

export default PostTest;
