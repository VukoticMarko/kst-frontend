import React, { useEffect, useState } from 'react';
import '../course-card/course-card.css';
import { useNavigate } from 'react-router-dom';

function TestCard({ id, title, time, courseId, description }){

    const navigate = useNavigate() 
    const [testId, setTestId] = useState(id);
    const userRole = localStorage.getItem('userRole');

    const EnterTest = () => {
      if (userRole === 'Professor' && id === 'creating-test-key'){
        navigate(`/chooseGraph/${courseId}`)
      }else{
        if (userRole === 'Professor'){
          navigate(`/expectedSpace/${courseId}/${testId}`)
        }else{
          navigate(`/testIntroduction/${courseId}/${testId}`)
        }
      }
    };
    
    let formattedDate = '';
    if (time && !isNaN(new Date(time).getTime())) {
      const date = new Date(time);
  
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };
  
      formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    } else {
      console.log('Loaded professor page.');
    }

  return (
    <div className="container" key={id} style={{ maxWidth: "400px", position: "left", cursor: 'pointer', margin: "7px"}} onClick={EnterTest}>
      <section className="section" style={{ padding: "15px"}}>
        <div className="columns">
          <div className="column">
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                <img
                  src={`https://source.unsplash.com/1280x960/?random&color=${Math.floor(Math.random()*16777215).toString(16)}`}
                  alt="Random color image"
                />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{title}</p>
                  </div>
                </div>
                {description === undefined && (
                <div onClick={EnterTest}>
                 
                  <p style={{ textAlign: 'left' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                    <a href="#">#css</a> <a href="#">#responsive</a>
                  </p>
                  <time dateTime="2016-1-1">{formattedDate}</time>
                </div>
                )}
                <div onClick={EnterTest}> 
                 <p style={{ textAlign: 'left' }}>
                    {description}
                 </p>
               </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
  );
};

export default TestCard;