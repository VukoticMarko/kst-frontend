import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './expected-knowledge-graph.css'
import exSpaceIMG from './exspimg.png'
import axios from 'axios';

function ExpcetedKnowledgeGraph(){

  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')
  const [studentWork, setStudentWork] = useState([])
  const {courseId, testId} = useParams()

  const handleDetailsClick = () => {
    
  };

  const generateExpectedKnowledgeGraph = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/student-tests/iita/${testId}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return ` ${hours}:${minutes} ${day}/${month}/${year}`;
  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/student-tests', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;
        setStudentWork(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    
  }, [])
   
  return (
    <div>
      <div className="table-container">
      <h2 className='table-text'>Here you can see test results and generate EXPECTED KNOWLEDGE GRAPH.</h2>
        <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Points</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {studentWork.map((work) => (
            <tr key={work.id}>
              <td>{work.title}</td>
              <td>{formatTimestamp(work.startTime)}</td>
              <td>{formatTimestamp(work.endTime)}</td>
              <td>{work.student.firstname}</td>
              <td>{work.student.lastname}</td>
              <td></td>
              <td>
                <button className='detail-button' onClick={() => handleDetailsClick(work.id)}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <button className='e-kg-button' onClick={() => generateExpectedKnowledgeGraph()}>Generate E. Knowledge Graph</button>
        </table>
      </div>
    </div>
  );
};

export default ExpcetedKnowledgeGraph;