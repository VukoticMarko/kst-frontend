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

  const updateNodeLinks = (nodes) => {
    
  console.log('nodovi', nodes)
  // Clear previous links
  nodes.forEach(node => {
    node.links = [];
  });

  // Create a map for quick access to nodes by questionLevel
  const nodesByLevel = nodes.reduce((acc, node) => {
    if (!acc[node.questionLevel]) {
      acc[node.questionLevel] = [];
    }
    acc[node.questionLevel].push(node);
    return acc;
  }, {});

  // Connect nodes to the next questionLevel
  nodes.forEach(node => {
    const nextLevelNodes = nodesByLevel[node.questionLevel + 1];
    if (nextLevelNodes && Array.isArray(nextLevelNodes)) {
      nextLevelNodes.forEach(nxNode => {
        node.links.push(nxNode);
      });
      setNodes(nodes)
    }
  });

  return nodes;
  };

  const addQuestionState = (newQuestion) => {
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  };

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
  };

  const handleBackButton = () => {
    navigate('/courses')
  }

  // Object adding logic

  const [createdObjectList, setCreatedObjectList] = useState([])
  let currentQT, currentRA, currentW1, currentW2, currentW3

  const addObjectToList = (object) => {
      let fqt = 0, fra = 0, fw1 = 0, fw2 = 0, fw3 = 0
      createdObjectList.forEach(addedObject => {
        if(addedObject.type === 'questionText' && object.type === 'questionText'){
          fqt = 1
          currentQT = object.userInput
          setQuestionName(currentQT)
          addedObject.userInput = object.userInput
        }
        if(addedObject.type === 'rightAnswer' && object.type === 'rightAnswer'){
          fra = 1
          currentRA = object.userInput
          addedObject.userInput = object.userInput
        }
        if(addedObject.type === 'wrong1' && object.type === 'wrong1'){
          fw1 = 1
          currentW1 = object.userInput
          addedObject.userInput = object.userInput
        }
        if(addedObject.type === 'wrong2' && object.type === 'wrong2'){
          fw2 = 1
          currentW2 = object.userInput
          addedObject.userInput = object.userInput
        }
        if(addedObject.type === 'wrong3' && object.type === 'wrong3'){
          fw3 = 1
          currentW3 = object.userInput
          addedObject.userInput = object.userInput
        }
      });

      if(fqt === 0 && object.type === 'questionText'){
        currentQT = object.userInput
        setQuestionName(currentQT)
        createdObjectList.push(object)
      }
      if(fra === 0 && object.type === 'rightAnswer'){
        currentRA = object.userInput
        createdObjectList.push(object)
      }
      if(fw1 === 0 && object.type === 'wrong1'){
        currentW1 = object.userInput
        createdObjectList.push(object)
      }
      if(fw2 === 0 && object.type === 'wrong2'){
        currentW2 = object.userInput
        createdObjectList.push(object)
      }
      if(fw3 === 0 && object.type === 'wrong3'){
        currentW3 = object.userInput
        createdObjectList.push(object)
      }
      console.log('Lista je:', createdObjectList)
  }

  const handleAnswerSelection = () => {};
  const removeExtraWrongs = () => {
      const filteredList = createdObjectList.filter(
        addedObject => addedObject.type !== 'wrong2' && addedObject.type !== 'wrong3'
      );
      setCreatedObjectList(filteredList);
      setSelectedFalse(1)
  }
  console.log('graph', graph)
  // Question and Test Handling
  const postQuestion = async () => {

    if(selectedConcept === ''){
      alert('You must select concept!')
      return;
    }
    const answers = []
    const newQuestion = {
      question: '',
      id: uuidv4(),
      answers: [],
      nodeId: 0
    }

    for (let i = 0; i < graph.concepts.length; i++) {
      const currentItem = graph.concepts[i]
      if(selectedConcept === currentItem.concept){
        newQuestion.nodeId = parseInt(currentItem.key);
      }
    }

    for (let i = 0; i < createdObjectList.length; i++) {
      const currentItem = createdObjectList[i];
      if(currentItem.type === 'questionText'){
        let question = currentItem.userInput
        newQuestion.question = question;
      }
      if(currentItem.type === 'rightAnswer'){
        let rightAnswer = {
          text: currentItem.userInput,
          correct: true,
        }  
        newQuestion.answers.push(rightAnswer)
      }
      if(currentItem.type === 'wrong1'){
        let wrong1 = {
          text: currentItem.userInput,
          correct: false,
        } 
        newQuestion.answers.push(wrong1)
      }
      if(currentItem.type === 'wrong2'){
        let wrong2 = {
          text: currentItem.userInput,
          correct: false,
        } 
        newQuestion.answers.push(wrong2) 
      }
      if(currentItem.type === 'wrong3'){
        let wrong3 = {
          text: currentItem.userInput,
          correct: false,
        } 
        newQuestion.answers.push(wrong3) 
      }
      
    }

    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    
    };

    console.log("questions", questions)

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
        console.error('There was an error sending the graph data:', error);
      }
    };

    return (
     <div className="page">
        <div className="sidebarKG">
          <h3 style={{color: 'white'}}>Test Creator</h3>
          <HiddenFormMenu title={"Add new Question:"} btnName={"New Question"} 
            typeForm={'questionText'} addObjectToList={addObjectToList}
            currentState={currentQT}/>
          <HiddenFormMenu title={"Add RIGHT answer:"} btnName={"Right Answer"}
           typeForm={'rightAnswer'} addObjectToList={addObjectToList}
           currentState={currentRA}/>
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
          <div className='rb'>
              <h4 style={{color: 'white'}}>Select number of false answers:</h4>
              <input type='radio'
              onChange={removeExtraWrongs} value={1}
              name='falseAnswers'
              />
              <input type='radio'
              onChange={() => setSelectedFalse(3)} value={3}
              name='falseAnswers'
              />
          </div>
          {
            selectedFalse === 1 && (
              <div>
                <HiddenFormMenu title={"Add FALSE answer 1:"} btnName={"Wrong Answer 1"} 
                typeForm={'wrong1'} addObjectToList={addObjectToList}
                currentState={currentW1}/>
              </div>
            )
          }
           {
            selectedFalse === 3 && (
              <div>
                <HiddenFormMenu title={"Add FALSE answer 1:"} btnName={"Wrong Answer 1"} 
                typeForm={'wrong1'} addObjectToList={addObjectToList}
                currentState={currentW1}/>
                <HiddenFormMenu title={"Add FALSE answer 2:"} btnName={"Wrong Answer 2"} 
                typeForm={'wrong2'} addObjectToList={addObjectToList}
                currentState={currentW2}/>
                <HiddenFormMenu title={"Add FALSE answer 3:"} btnName={"Wrong Answer 3"} 
                typeForm={'wrong3'} addObjectToList={addObjectToList}
                currentState={currentW3}/>
              </div>
            )
          }
          <button className='finish-button' onClick={postQuestion}>Add Question</button>
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
                        x1={nodes.find((node) => node.id === link.source).x}
                        y1={nodes.find((node) => node.id === link.source).y}
                        x2={nodes.find((node) => node.id === link.target).x}
                        y2={nodes.find((node) => node.id === link.target).y}
                        stroke="black"
                      />
                    ))}
                    {nodes.map((node) => (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={15}
                          style={{ fill: 'green' }}
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