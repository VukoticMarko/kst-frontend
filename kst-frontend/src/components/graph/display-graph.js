import React, { useEffect, useRef } from 'react';
import './display-graph.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function DisplayGraph({ graph }) {

    const navigate = useNavigate();
    const {courseId} = useParams();
    const location = useLocation();

    const handleClick = () => {
        navigate(`/postTest/${courseId}`, { state: { graph: graph } });
    };

  return (
    <div className="container" key={graph.id} style={{ maxWidth: "400px", position: "left", cursor: 'pointer', margin: "7px"}} onClick={handleClick}>
      <section className="section" style={{ padding: "15px"}}>
        <div className="columns">
          <div className="column">
            <div className="card">
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{graph.graphName}</p>
                  </div>
                </div>
                <div onClick={handleClick}> 
                 <p style={{ textAlign: 'left' }}>
                    {graph.graphDescription}
                 </p>
               </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DisplayGraph;
