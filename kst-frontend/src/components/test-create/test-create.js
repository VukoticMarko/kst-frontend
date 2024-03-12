import React from "react";
import { useState } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import './test-create.css';
import { select } from 'd3';
import * as d3 from 'd3';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import { useEffect } from "react";
import { useRef } from "react";
import Tooltip from "../knowledge-graph/tooltip";
import axios from 'axios';
import TestOption from "../test/test-option";
import QuestionMark from './question-mark.js';

function TestCreate () {

  const location = useLocation();
  const { graph } = location.state || {};
  const {courseId} = useParams()
  const [graphName, setGraphName] = useState(graph.graphName);
  const [editingTestName, setEditingTestName] = useState(false);
  const inputRef = useRef(null);
  const [selectedConcept, setSelectedConcept] = useState('');

  const accessToken = localStorage.getItem('accessToken')

  const [selectedFalse, setSelectedFalse] = useState(1);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const navigate = useNavigate()  
  const [questionName, setQuestionName] = useState("");
  const [nodes, setNodes] = useState(graph.concepts);
  const [links, setLinks] = useState(graph.links);
  const svgRef = useRef();
  const sidebarWidth = 200;

  const [userTest, setTestName] = useState("Please change name of this Test by clicking on this text.");

  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [questions, setQuestions] = useState([]);

  // Graph logic

  const handleConceptChange = (event) => {
    setSelectedConcept(event.target.value);
  };

  const handleTestNameChange = (e) => {
    setTestName(e.target.value);
  };

  const startEditingTestName = () => {
    setEditingTestName(true);
  };

  const stopEditingTestName = () => {
    setEditingTestName(false);
  };

  useEffect(() => {

    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        stopEditingTestName();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {

    const container = document.querySelector('.graph-display-container-secondary');
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      setSvgDimensions({ width, height });
    }

    const handleResize = () => {
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Relative scaling of nodes to smaller rectangle
  useEffect(() => {

    if (nodes && nodes.length > 0 && svgDimensions.width && svgDimensions.height) {

      const originalWidth = window.innerWidth - sidebarWidth;
      const originalHeight = window.innerHeight
      // Calculate scaling factors
      const scaleX = svgDimensions.width / originalWidth;
      const scaleY = svgDimensions.height / originalHeight;
  
      // Scale node positions
      const scaledNodes = nodes.map(node => ({
        ...node,
        x: node.x * scaleX,
        y: node.y * scaleY
      }));
  
      setNodes(scaledNodes);
    }
  }, [svgDimensions]); 

  const handleRemoveQuestion = (questionId) => {
    const updatedQuestions = questions.filter(question => question.id !== questionId);
    setQuestions(updatedQuestions);
    const clearCreatedObjectList = () => { // Remove all answers from question
      setCreatedObjectList([]); // Potential hazard - needs testing
    };
    clearCreatedObjectList();
  };

  const handleBackButton = () => {
    navigate('/courses')
  }

  // Object adding logic

  const [createdObjectList, setCreatedObjectList] = useState([])
  let currentQT, currentRA

  // Question and Test Handling
  const addObjectToList = (object) => {

    const hasQuestionText = createdObjectList.some(object => object.type === 'questionText');
    if (hasQuestionText) {
    } else {
      alert('Create new question first before adding new answers!');
      return;
    }

    if (typeAnswer !== 'rightAnswer' && typeAnswer !== 'wrongAnswer') {
      alert('Please select an answer type.');
      return;
    } else {
      const isDuplicate = createdObjectList.some(addedObject =>
        addedObject.type === object.type && addedObject.userInput === object.userInput
        ||
        addedObject.userInput === object.userInput
      );
      if (!isDuplicate) {
        // Update the list with the new answer
        setCreatedObjectList(prevList => [...prevList, object]);
        if(typeAnswer === 'rightAnswer'){
          let rightAnswer = {
            text: object.userInput,
            correct: true,
          }  
          currentQuestion.answers.push(rightAnswer)
        } else {
          let wrongAnswer = {
            text: object.userInput,
            correct: false,
          }  
          currentQuestion.answers.push(wrongAnswer)
        }
      } else {
        alert('Answer field cannote be empty or it has already been added.');
      }
      console.log('Lista je:', createdObjectList)
    }
  }

  const handleAnswerSelection = () => {};

  const postTest = async () => {

      const testObject = {
        testName: userTest,
        courseId: parseInt(courseId),
        questions: questions,
        knowledgeSpaceId: graph.id
      }

      console.log('Postuje se:', testObject)
      try {
        const response = await axios.post('http://localhost:3000/tests',
          testObject, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        navigate('/courses')
      } catch (error) {
        console.error('There was an error sending the test data:', error);
      }
    };

    console.log('Added Questions:', questions)

    // Adding questions
    const [currentQuestion, setCurrentQuestion] = useState({});
    const addQuestion = (object) => {

      const hasQuestionText = createdObjectList.some(object => object.type === 'questionText');
      if (hasQuestionText) {
        alert('Cannot add new question before you finish previous question!');
        return;
      }
      
      if(selectedConcept === ''){
        alert('You must select concept before adding question!')
        return;
      }

      // Create new
      currentQT = object.userInput
      setQuestionName(currentQT)
      createdObjectList.push(object)
      //console.log('Lista je:', createdObjectList)

      const newQuestion = {
        question: currentQT,
        id: uuidv4(),
        answers: [],
        nodeId: 0
      }

      // Getting node ID
      for (let i = 0; i < graph.concepts.length; i++) {
        const currentItem = graph.concepts[i]
        if(selectedConcept === currentItem.concept){
          newQuestion.nodeId = currentItem.id;
        }
      }

      // Setting question name
      for (let i = 0; i < createdObjectList.length; i++) {
        const currentItem = createdObjectList[i];
        if(currentItem.type === 'questionText'){
          let question = currentItem.userInput
          newQuestion.question = question;
        }
      }
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
      setCurrentQuestion(newQuestion);
    }

    let [typeAnswer, updateTypeAnswer] = useState('')
    useEffect(() => {
      console.log('Type of answer selected: ', typeAnswer);
    }, [typeAnswer]);

    const setAnswer = (answerType) => {
      updateTypeAnswer(answerType);
    }

    const handleFinishQuestion = () => {
      setCreatedObjectList([])
    }

    return (
     <div className="page">
        <div className="sidebarKG">
          <h3 style={{color: 'white'}}>Test Creator</h3>
          <div className="concept-select">
            <select value={selectedConcept} onChange={handleConceptChange}>
                <option value="" disabled>Select Concept</option>
                {nodes.map((node) => (
                    <option key={node.key} value={node.concept}>
                        {node.concept}
                    </option>
                ))}
            </select>
          </div>
          <div className="hfm-container">
            <HiddenFormMenu title={"Add new Question:"} btnName={"New Question"} 
              typeForm={'questionText'} addQuestion={addQuestion}
              currentState={currentQT}/>
            <HiddenFormMenu title={"Add answer:"} btnName={"Add Answer"}
            typeForm={typeAnswer} addObjectToList={addObjectToList}
            currentState={currentRA}/>
          </div>
          <div className='rb'>
            <h4 style={{color: 'white'}}>Select type of answer:</h4>
            <label style={{color: 'white', marginRight: '10px'}}>
              <input type='radio'
                    onChange={() => setAnswer('rightAnswer')}
                    name='answerType'
                    checked={typeAnswer === 'rightAnswer'}
              />
              True
            </label>
            <label style={{color: 'white'}}>
              <input type='radio'
                    checked={typeAnswer === 'wrongAnswer'}
                    onChange={() => setAnswer('wrongAnswer')}
                    name='answerType'
              />
              False
            </label>
          </div>
          <button className='finish-button' onClick={handleFinishQuestion}>Finish Question</button>
          <button className='finish-test-button' onClick={postTest}>Finish Test</button>
          <br></br>
          <button className='back-button' onClick={handleBackButton}>Go Back</button>
        </div>

        <div className='test-container-tc'>
            <div className="test-name-container">
              {editingTestName ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={userTest}
                  onChange={handleTestNameChange}
                  onBlur={stopEditingTestName}
                  autoFocus
                />
              ) : (
                <span onClick={startEditingTestName}>{userTest}</span>
              )}
            </div>
          <QuestionMark message="When new questions are added to the test 
          they will be displayed in this container. This is how the test will
            look for the students." />
                  {questions.map((question) => (
                  <div className="question-container" style={{marginLeft: '165px'}}>
                    <TestOption
                    key={question.id} 
                    qId={question.id}
                    options={question.answers}
                    text={question.question}
                    onAnswerSelection={handleAnswerSelection}>
                    </TestOption>
                    <button className="remove-question-button" onClick={() => handleRemoveQuestion(question.id)}> x </button>
                  </div>
                  ))}
              <div className="graph-display-container-secondary">
                <div className="test-name-container">
                  {graphName}
                </div>
                <QuestionMark message="This is the chosen space theory graph. Concepts from
                this graph are displayed in 'Select Concept' menu on the left sidebar.
                  When adding question, you have to choose concept from the graph." />
                 <svg ref={svgRef} width={svgDimensions.width} height={svgDimensions.height}>
                    {links.map((link, index) => (
                      <line
                        key={index}
                        x1={nodes.find((node) => node.key === link.source).x}
                        y1={nodes.find((node) => node.key === link.source).y}
                        x2={nodes.find((node) => node.key === link.target).x}
                        y2={nodes.find((node) => node.key === link.target).y}
                        stroke="black"
                      />
                    ))}
                    {nodes.map((node) => (
                      <g key={node.key}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={15}
                          style={{ fill: selectedConcept === node.concept ? 'red' : 'green' }}
                          ref={(el) => select(el).datum(node)}
                        />
                        <text x={node.x} y={node.y} dy={5} textAnchor="middle">{node.concept}</text>
                      </g>
                    ))}
                  </svg>
                </div>
                <Tooltip 
                    tooltipVisible={tooltipVisible}
                    tooltipContent={tooltipContent}
                    tooltipPosition={tooltipPosition}
                />
              </div>
     </div>
    );
  };

export default TestCreate;