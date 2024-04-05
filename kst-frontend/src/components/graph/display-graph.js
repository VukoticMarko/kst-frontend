import React, { useEffect, useRef } from 'react';
import './display-graph.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function DisplayGraph({ graph, code, ontology }) {

  // Code 0 = Default creating graph card
  // Code 1 = General Graph Menu
  // Code 2 = Creating tests flow

  // Ontology = true, we are disabling editing of ontology graphs in /editGraph
  
    const navigate = useNavigate();
    const {courseId} = useParams();
    const location = useLocation();
    //console.log('For graph', graph.graphName, 'Ontology is', ontology)

    const handleClick = () => {
      if(code === 0){
        navigate(`/kg`)
      }
      if(code === 1){
        navigate(`/editGraph`, {state: {graph: graph, ontology: ontology}})
      }

      if(code === 2){
        navigate(`/createTest/${courseId}`, { state: { graph: graph } });
      }
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
