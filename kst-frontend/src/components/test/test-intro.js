import React from 'react';
import  "./test-intro.css";
import { useNavigate, useParams } from 'react-router-dom';

function TestIntroduction() {

  const navigation = useNavigate()
  const {courseId, testId} = useParams()
  const accessToken = localStorage.getItem('accessToken')
  
  const startTest = () => {
    navigation(`/test/${testId}`)
  }
  const goBack = () => {
      navigation(`/tests/${courseId}`)
  }

  return (
    <div id='intro-container'>
      <div>
            <p id='intro-text'>Test duration is 1h 30min. Here we will test your knowledge
                in basics of programming and dynamic variables. <br></br>
                When you start this test you may not pause it nor exit it.
                <br/> Exiting is same like turning in the empty paper. <br/>
                If you are ready to start and comply with text above press
                start test button.
            </p>
        </div>
        <button onClick={startTest}>Start Test</button>
        <div className="container-bottom">
            <button type="button" className="cancelbtn" onClick={goBack}>Cancel</button>
        </div>    
    </div>
  );
};

export default TestIntroduction;
