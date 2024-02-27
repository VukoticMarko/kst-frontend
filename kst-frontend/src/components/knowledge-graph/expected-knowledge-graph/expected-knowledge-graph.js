import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './expected-knowledge-graph.css'
import exSpaceIMG from './exspimg.png'

function ExpcetedKnowledgeGraph(){

  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')
  const [studentWork, setStudentWork] = useState([])

  const handleDetailsClick = (studentWorkId) => {
    console.log(`Details for studentWorkId ${studentWorkId}`);
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

    const list = [
      {
        id: 3213412,
        title: 'JS Test',
        startTime: "2024-02-27T19:09:51.411798Z",
        endTime: "2024-02-27T19:09:51.411798Z",
        studentId: 3,
        testId: 7
      },
      {
        id: 3213412321,
        title: 'JS Test',
        startTime: "2024-02-27T19:09:51.411798Z",
        endTime: "2024-02-27T19:09:51.411798Z",
        studentId: 4,
        testId: 7
      }
    ].map((object) => ({
      ...object,
      startTime: formatTimestamp(object.startTime),
      endTime: formatTimestamp(object.endTime),
    }));
  
    setStudentWork(list);
    
  }, [])
   
  return (
    <div>
      <div className="table-container">
      <h2 className='table-text'>Here you can see test results and generate EXPECTED KNOWLEDGE GRAPH.</h2>
        <table>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Title</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Student ID</th>
            <th>Test ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentWork.map((work) => (
            <tr key={work.id}>
              <td>{work.id}</td>
              <td>{work.title}</td>
              <td>{work.startTime}</td>
              <td>{work.endTime}</td>
              <td>{work.studentId}</td>
              <td>{work.testId}</td>
              <td>
                <button className='detail-button' onClick={() => handleDetailsClick(work.id)}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <button className='e-kg-button'>Generate E. Knowledge Graph</button>
        </table>
      </div>
    </div>
  );
};

export default ExpcetedKnowledgeGraph;