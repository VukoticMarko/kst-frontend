import React from "react";
import { useState } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import './knowledge-graph.css';
import * as d3 from 'd3';
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import { useEffect } from "react";
import { useRef } from "react";
import Tooltip from "./tooltip";
import axios from 'axios';


function KnowledgeGraph () {

  const [testName, setTestName] = useState("Please change name of this Knowledge Graph by clicking on this text.");
  const [editingTestName, setEditingTestName] = useState(false);

  const [description, setDescription] = useState("Please change description of this graph by clicking on this text.");
  const [editingDescription, setEditingDescription] = useState(false);

  const inputRef = useRef(null);

  const accessToken = localStorage.getItem('accessToken')

  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const navigate = useNavigate()  
  const [questionName, setQuestionName] = useState("");
  const [currentQL, setCurrentQuestionLevel] = useState(1);
  const [nodes, setNodes] = useState([]);
  const svgRef = useRef();
  const zoomRef = useRef();
  const sidebarWidth = 200;

  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Test name change

  const handleTestNameChange = (e) => {
    setTestName(e.target.value);
  };

  const startEditingTestName = () => {
    setEditingTestName(true);
  };

  const stopEditingTestName = () => {
    setEditingTestName(false);
  };

  // Graph logic

  const addNode = (newNode) => {
    setNodes(prevNodes => {
      const newNodes = [...prevNodes, newNode];
      console.log("Adding node:", newNode, "New nodes list:", newNodes);
      return updateNodeLinks(newNodes);
    });
  };

  const updateNodePosition = (id, x, y) => {
    setNodes(prevNodes => prevNodes.map(node => {
        return node.id === id ? { ...node, x, y } : node;
    }));
  };

  function getEdgePoint(sourceX, sourceY, targetX, targetY, nodeRadius) {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    const x = sourceX + Math.cos(angle) * nodeRadius;
    const y = sourceY + Math.sin(angle) * nodeRadius;
    return { x, y };
  }

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
      const questionNode = {
        id: uuidv4(),
        question: questionName,
        questionLevel: currentQL,
        x: Math.random() * (svgDimensions.width - sidebarWidth),
        y: Math.random() * svgDimensions.height,
        links: []
      };
      addNode(questionNode)
    };

    const postTest = async () => {

      // Gather nodes in list
      const questionNodes = nodes.map(node => ({
        key: node.id,
        concept: node.question,
        questionLevel: node.questionLevel,
        x: node.x,
        y: node.y
      }));
      const newGraph = {
        graphName: testName,
        graphDescription: description,
        concepts: questionNodes,
      }
      console.log('Postuje se:', newGraph)
      try {
        const response = await axios.post('http://localhost:3000/knowledge-space',
          newGraph, 
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
    

    // Making nodes moveable
    const drag = d3.drag()
    .on("start", (event, d) => {
        d3.select(event.sourceEvent.target).raise();
    })
    .on("drag", (event, d) => {
      updateNodePosition(d.id, event.x, event.y);
      svg.selectAll(".link")
        .filter(link => link.source === d || link.target === d)
        .attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => link.target.x)
        .attr("y2", link => link.target.y);
      d3.select(event.sourceEvent.target)
          .attr("cx", event.x)
          .attr("cy", event.y);
      
      if (tooltipVisible && tooltipContent === d.question) {
          setTooltipPosition({
              x: event.x + 20,
              y: event.y
          });
      }
    })
    .on("end", (event, d) => {
      updateNodePosition(d.id, event.x, event.y);
      // Update link positions on drag end
      svg.selectAll(".link")
        .filter(link => link.source === d || link.target === d)
        .attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => link.target.x)
        .attr("y2", link => link.target.y);
    });

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
        .call(drag)
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

  const handleBackButton = () => {
    navigate('/courses')
  }

  // Object adding logic
  const [createdObjectList, setCreatedObjectList] = useState([])
  let currentQT, currentRA

  const addObjectToList = (object) => {
      let fqt = 0, fra = 0, fw1 = 0, fw2 = 0, fw3 = 0
      createdObjectList.forEach(addedObject => {
        if(addedObject.type === 'questionText' && object.type === 'questionText'){
          fqt = 1
          currentQT = object.userInput
          setQuestionName(currentQT)
          addedObject.userInput = object.userInput
        }
      });

      if(fqt === 0 && object.type === 'questionText'){
        currentQT = object.userInput
        setQuestionName(currentQT)
        createdObjectList.push(object)
      }
      console.log('Lista je:', createdObjectList)
  }

  // Object removing logic
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const removeSelectedNode = () => {
    if (selectedNodeId) {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== selectedNodeId));
      setSelectedNodeId(null); // Reset selected node
    }
  };

    return (
     <div className="kg-wrapper">
        <div className="sidebarKG">
          <h3 style={{color: 'white'}}>Knowledge Graph Creator</h3>
          <HiddenFormMenu title={"Add new Concept:"} btnName={"New Concept"} 
            typeForm={'questionText'} addObjectToList={addObjectToList}
            currentState={currentQT}/>
          <div className='question-level-wrapper'>
          <h4 style={{color: 'white'}}>Question Level:</h4>
              <input className='question-level' type="number" id="quantity" name="quantity" min="1" max="99"
              onChange={(e) => handleQuestionLevelChange(e.target.value)}
              value={currentQL}
              ></input>
          </div>
          <div className="remove-node-wrap">
            <label style={{color:'white', marginBottom:'10px'}}>Select Node For Removal:</label>
            <select value={selectedNodeId} onChange={(e) => setSelectedNodeId(e.target.value)}>
              <option value="">-- Select Node --</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.question}
                </option>
              ))}
            </select>
            <button className="remove-node-button" onClick={removeSelectedNode}>Remove Node</button>
        </div>
          <button className='finish-button' onClick={postQuestion}>Add Node</button>
          <button className='finish-test-button' onClick={postTest}>Finish Graph</button>
          <br></br>
          <button className='back-button' onClick={handleBackButton}>Go Back</button>
        </div>
        <div className="graph-display-container-main">
          <div className="test-name-container">
            {editingTestName ? (
              <input
                ref={inputRef}
                type="text"
                value={testName}
                onChange={handleTestNameChange}
                onBlur={stopEditingTestName}
                autoFocus
              />
            ) : (
              <span onClick={startEditingTestName}>{testName}</span>
            )}
          </div>
          <div className="description-edit-container">
          {editingDescription ? (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setEditingDescription(false)}
              autoFocus
            />
          ) : (
            <span onClick={() => setEditingDescription(true)}>{description}</span>
          )}
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

export default KnowledgeGraph;