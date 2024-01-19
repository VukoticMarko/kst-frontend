import React from "react";
import { useState } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import './test-create.css';
import * as d3 from 'd3';
import { useLocation, useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import { useEffect } from "react";
import { useRef } from "react";
import Tooltip from "../knowledge-graph/tooltip";
import axios from 'axios';

function TestCreate () {

  const location = useLocation();
  const { graph } = location.state || {};
  const [testName, setTestName] = useState(graph.graphName);

  const [selectedConcept, setSelectedConcept] = useState('');

  const accessToken = localStorage.getItem('accessToken')

  const [selectedFalse, setSelectedFalse] = useState(1);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const navigate = useNavigate()  
  const [questionName, setQuestionName] = useState("");
  const [currentQL, setCurrentQuestionLevel] = useState(1);
  const [nodes, setNodes] = useState(graph.concepts);
  const svgRef = useRef();
  const zoomRef = useRef();
  const sidebarWidth = 200;

  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Graph logic


  function getEdgePoint(sourceX, sourceY, targetX, targetY, nodeRadius) {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    const x = sourceX + Math.cos(angle) * nodeRadius;
    const y = sourceY + Math.sin(angle) * nodeRadius;
    return { x, y };
  }

  const handleConceptChange = (event) => {
    setSelectedConcept(event.target.value);
  };

  const handleQuestionLevelChange = (newValue) => {

    const questionLevelInt = parseInt(newValue, 10); // Convert to integer

    if (!isNaN(questionLevelInt)) {
        setCurrentQuestionLevel(questionLevelInt);

        let questionLevelObject = {
            type: 'questionLevel',
            questionLevel: questionLevelInt
        };

        const existingObjectIndex = createdObjectList.findIndex(
            (addedObject) => addedObject.type === 'questionLevel'
        );
    
        if (existingObjectIndex !== -1) {
            createdObjectList[existingObjectIndex] = questionLevelObject;
        } else {
            createdObjectList.push(questionLevelObject);
        }
    } else {
        console.error('Invalid question level:', newValue);    }
  }

  const updateNodeLinks = (nodes) => {
    
    if (!Array.isArray(nodes)) {
      console.error('updateNodeLinks was called without an array');
      return [];
    }
  
    nodes.forEach(node => {
      const nextLevelNodes = nodes.filter(n => n.questionLevel === node.questionLevel + 1);
      console.log(`Current node level: ${node.questionLevel}, Next level nodes:`, nextLevelNodes);
      node.links = nextLevelNodes.map(n => n.id);
      console.log(`Updated links for node ${node.id}:`, node.links);
    });
  
    return nodes;
  };

  const handleZoomIn = () => {
    const newZoom = zoomTransform.k * 1.2; // Increase zoom by 20%
    const updatedTransform = zoomTransform.scale(newZoom);
    setZoomTransform(updatedTransform);
    applyZoomTransform(updatedTransform);
  };
  
  const handleZoomOut = () => {
    const newZoom = zoomTransform.k * 0.8; // Decrease zoom by 20%
    const updatedTransform = zoomTransform.scale(newZoom);
    setZoomTransform(updatedTransform);
    applyZoomTransform(updatedTransform);
  };
  
  // Function to apply zoom transform to the SVG
  const applyZoomTransform = (transform) => {
    if (svgRef.current) {
      d3.select(svgRef.current).select(".graph-display-container-main")
        .attr("transform", transform);
    }
  };

  const postQuestion = async () => {
      const question = {
        question: questionName,
        questionLevel: currentQL,
        rightAnswer: currentRA,
        wrongAnswer1: currentW1,
        wrongAnswer2: currentW2,
        wrongAnswer3: currentW3,
      };
      //addNode(questionNode)

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
    };

    const postTest = async () => {

      // Gather nodes in list
      const questionNodes = nodes.map(node => ({
        question: node.question,
        questionLevel: node.questionLevel,
        rightAnswer: node.rightAnswer,
        wrongAnswer1: node.wrongAnswer1,
        wrongAnswer2: node.wrongAnswer2,
        wrongAnswer3: node.wrongAnswer3,
        x: node.x,
        y: node.y
      }));
      const testObject = {
        testName: testName,
        questions: questionNodes,
      }
      console.log('Postuje se:', testObject)
      try {
        const response = await axios.post('http://localhost:3001/finishTest', { 
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ testObject }),
      });
        console.log(response);
        navigate('/courses')
      } catch (error) {
        console.error('There was an error sending the test data:', error);
      }
    };

  useEffect(() => {

    const svg = d3.select(svgRef.current);

    // Create a zoom behavior
    const zoom = d3.zoom()
    .scaleExtent([0.1, 4]) // Set the minimum and maximum zoom scale
    .on('zoom', handleZoom);

    // Zoom in the container
    svg.call(zoom);
    zoomRef.current = zoom;
    function handleZoom(event) {
      const { transform } = event;
      svg.attr('transform', transform);
    }
    svg.call(zoom.on("zoom", (event) => {
      setZoomTransform(event.transform);
    }));

    const updatedNodes = updateNodeLinks(nodes);
    const linksData = updatedNodes.flatMap(node =>
      (node.links || []).map(targetId => {
        const targetNode = updatedNodes.find(n => n.id === targetId);
        return targetNode ? { source: node, target: targetNode } : null;
      }).filter(link => link != null)
    );

    const link = svg.selectAll(".link")
      .data(linksData, d => `${d.source.id}-${d.target.id}`);

      link.enter()
      .append("line")
      .classed("link", true)
      .attr("x1", d => getEdgePoint(d.source.x, d.source.y, d.target.x, d.target.y, 15).x)
      .attr("y1", d => getEdgePoint(d.source.x, d.source.y, d.target.x, d.target.y, 15).y)
      .attr("x2", d => getEdgePoint(d.target.x, d.target.y, d.source.x, d.source.y, 15).x)
      .attr("y2", d => getEdgePoint(d.target.x, d.target.y, d.source.x, d.source.y, 15).y)
      .attr("stroke", "black");

    link.exit().remove();

    const circles = svg.selectAll('circle')
    .data(nodes, d => d.id);

    circles.enter()
        .append('circle')
        .attr('r', 15)
        .attr('cx', d => d.x ?? (100 + Math.random() * 100))
        .attr('cy', d => d.y ?? 100)
        .style('fill', 'green')
        .style('stroke', 'black')
        .style('stroke-width', 2)
        .on('click', (event, d) => {
          const nodeRadius = 15
          event.stopPropagation(); 
          setTooltipContent(d.question);
          setTooltipPosition({
              x: d.x,
              y: d.y + nodeRadius + 5 
          });
          setTooltipVisible(true);
      });

    circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    circles.exit().remove();

    svg.on('click', () => {
      setTooltipVisible(false);
    });

  }, [nodes, tooltipVisible, tooltipContent, zoomTransform]); // Redraw graph when nodes change

  useEffect(() => {
    const updateDimensions = () => {
        const width = window.innerWidth - sidebarWidth;
        const height = window.innerHeight;
        setSvgDimensions({ width, height });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
        window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  

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
              value={currentQL}
              ></input>
          </div>
          <div className="concept-select">
            <select value={selectedConcept} onChange={handleConceptChange}>
                <option value="" disabled>Select Concept</option>
                {nodes.map((node) => (
                    <option key={node.key} value={node.concept}>
                        {node.concept}
                    </option>
                ))}
            </select>
            {selectedConcept && <p>Selected Concept: {selectedConcept}</p>}
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
        <div className="graph-display-container-main">
          <div className="test-name-container">
            {testName}
          </div>
          <div className="zoom-buttons">
            <button onClick={handleZoomIn}>+</button>
            <button onClick={handleZoomOut}>-</button>
          </div>
          <svg ref={svgRef} width={svgDimensions.width} height={svgDimensions.height}></svg>
        </div>
        <Tooltip 
            tooltipVisible={tooltipVisible}
            tooltipContent={tooltipContent}
            tooltipPosition={tooltipPosition}
        />
     </div>
    );
  };

export default TestCreate;