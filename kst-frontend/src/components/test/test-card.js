import React, { useState } from 'react';
import '../course-card/course-card.css';
import { useNavigate } from 'react-router-dom';

function TestCard({ id, title, time, courseId }){

    const navigate = useNavigate() 
    const [testId, setTestId] = useState(id);

    const EnterTest = () => {
        navigate(`/testIntroduction/${courseId}/${testId}`)
      };

    const date = new Date(time);

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
      
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return (


    <div className="container" key={id} style={{ maxWidth: "400px", position: "left", cursor: 'pointer', margin: "7px"}} onClick={EnterTest}>
      <section className="section" style={{ padding: "15px"}}>
        <div className="columns">
          <div className="column">
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{title}</p>
                  </div>
                </div>
                <div onClick={EnterTest}>
                  <p style={{ textAlign: 'left' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                    <a href="#">#css</a> <a href="#">#responsive</a>
                  </p>
                  <time dateTime="2016-1-1">{formattedDate}</time>
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