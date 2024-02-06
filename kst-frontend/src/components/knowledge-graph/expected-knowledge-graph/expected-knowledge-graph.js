import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exSpaceIMG from './exspimg.png'

function ExpcetedKnowledgeGraph(){

  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')

   
  return (
    <div key={1} className="container" style={{ maxWidth: "400px", position: "left", cursor: 'pointer', margin: "7px"}} 
       >
      <h1 style={{color: 'green', marginTop: '100px'}}>PLACEHOLDER EXPECTED KNOWLEDGE GRAPH</h1>
      <img src={exSpaceIMG} alt='ekgIMG' style={{marginTop: '50px'}}/>
    </div>
    
  );
};

export default ExpcetedKnowledgeGraph;