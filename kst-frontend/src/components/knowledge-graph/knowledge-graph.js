import React, { useEffect } from "react";
import { useState, useRef } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import './knowledge-graph.css';
import * as d3 from 'd3';
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';


function KnowledgeGraph () {

  const graphContainerRef = useRef();
  const [selectedFalse, setSelectedFalse] = useState(1);
  const navigate = useNavigate()
  const [nodes, setNodes] = useState([]);  
  const [questionName, setQuestionName] = useState("");
  const [currentQL, setCurrentQuestionLevel] = useState(1);
  let simulation, svg, width, height;

  useEffect(() => {

    // Set up initial dimensions
    width = graphContainerRef.current.clientWidth;
    height = graphContainerRef.current.clientHeight;

    // Create SVG container
    svg = d3.select(graphContainerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create force simulation
    simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink([]).distance(100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Set up initial nodes and links
    setNodes([]);
    simulation.nodes(nodes).on("tick", updateGraph);

    return () => {
      simulation.stop();
    };
  }, []);


  // Graph logic

  const updateGraph = (questionNode) => {
    const node = svg.selectAll(".node").data(nodes);

    node
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 20)
      .attr("fill", "green")
      .on("click", () => showQuestionName(questionNode));

    node.exit().remove();

    node.attr("cx", (d) => Math.max(10, Math.min(width - 10, d.x))).attr("cy", (d) => Math.max(10, Math.min(height - 10, d.y)));
  };

  const showQuestionName = (questionNode) => {
    console.log("Clicked on question node. Question name:", questionNode.questionName);
  };
  
    const handleBackButton = () => {
      navigate('/courses')
    }

    const postTest = () => {
      
    }

    const handleQuestionLevelChange = (newValue) => {
      setCurrentQuestionLevel(newValue)
      let questionLevelObject = {
        type: 'questionLevel',
        questionLevel: newValue
      }
      const existingObjectIndex = createdObjectList.findIndex(
        (addedObject) => addedObject.type === 'questionLevel'
      );
    
      if (existingObjectIndex !== -1) {
        createdObjectList[existingObjectIndex] = questionLevelObject;
      } else {
        createdObjectList.push(questionLevelObject);
      }
    }


    const postQuestion = async () => {

      const questionNode = {
        id: uuidv4(),
        x: Math.random() * width,
        y: Math.random() * height,
        questionName: questionName, 
      };
    
      setNodes([...nodes, questionNode]);
      updateGraph(questionNode);

      console.log('Postuje se:', createdObjectList)
      try {
        const response = await fetch('http://localhost:3000/postURL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ createdObjectList }),
        });
  
      } catch (error) {
        console.error('Error with post:', error);
      }
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

    const removeExtraWrongs = () => {
      const filteredList = createdObjectList.filter(
        addedObject => addedObject.type !== 'wrong2' && addedObject.type !== 'wrong3'
      );
      setCreatedObjectList(filteredList);
      setSelectedFalse(1)
    }

    return (
     <div className="kg-wrapper">
        <div className="sidebarKG">
          <h3 style={{color: 'white'}}>Test Creator</h3>
          <HiddenFormMenu title={"Add new Question:"} btnName={"New Question"} 
            typeForm={'questionText'} addObjectToList={addObjectToList}
            currentState={currentQT}/>
          <HiddenFormMenu title={"Add RIGHT answer:"} btnName={"Right Answer"}
           typeForm={'rightAnswer'} addObjectToList={addObjectToList}
           currentState={currentRA}/>
          <div className='question-level-wrapper'>
          <h4 style={{color: 'white'}}>Question Level:</h4>
              <input className='question-level' type="number" id="quantity" name="quantity" min="1" max="99"
              onChange={(e) => handleQuestionLevelChange(e.target.value)}
              ></input>
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
          <button className='finish-button' onClick={postQuestion}>Finish Question</button>
          <button className='finish-test-button' onClick={postTest}>Finish Test</button>
          <br></br>
          <button className='back-button' onClick={handleBackButton}>Go Back</button>
        </div>
        <div className="graph-display-container-main" ref={graphContainerRef}/>
     </div>
    );
  };

export default KnowledgeGraph;