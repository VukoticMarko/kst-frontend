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

  useEffect(() => {

    let list = []
    const temporaryTest = {
      id: 3213412,
      title: 'JS Test',
      startTime: "2024-02-27 19:09:51.411798",
      endTime: "2024-02-27 19:09:51.411798",
      studentId: 3,
      testId: 7
    }
    const temporaryTest2 = {
      id: 3213412321,
      title: 'JS Test',
      startTime: "2024-02-27 19:09:51.411798",
      endTime: "2024-02-27 19:09:51.411798",
      studentId: 4,
      testId: 7
    }
    list.push(temporaryTest, temporaryTest2)
    setStudentWork(list)
    
  }, [])
   
  return (
    <div>
      <div className="table-container">
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
        </table>
      </div>
    </div>
  );
};

export default ExpcetedKnowledgeGraph;