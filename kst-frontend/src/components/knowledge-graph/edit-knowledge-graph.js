import React, { useState, useRef, useEffect } from 'react';
import { select, event, drag } from 'd3';
import { useLocation, useNavigate } from 'react-router';
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import './knowledge-graph.css';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

function EditKnowledgeGraph(){
  const location = useLocation();
  const { graph } = location.state || {};
  const [nodes, setNodes] = useState(graph.concepts);
  const [links, setLinks] = useState(graph.links);
  const [selectedNode, setSelectedNode] = useState(null);
  const [testName, setTestName] = useState(graph.graphName);
  const [editingTestName, setEditingTestName] = useState(false);
  const [description, setDescription] = useState(graph.graphDescription);
  const [editingDescription, setEditingDescription] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [questionName, setQuestionName] = useState("");
  const accessToken = localStorage.getItem('accessToken');
  const sidebarWidth = 200;
  const inputRef = useRef(null);
  const navigate = useNavigate()  
  const svgRef = useRef();
  console.log('Received graph: ', graph)
  console.log('Nodes of the graph ', nodes)
  console.log('Links in the graph ', links)

  useEffect(() => {

  }, []);
    
  useEffect(() => {

    const updateDimensions = () => {
      const width = window.innerWidth - sidebarWidth;
      const height = window.innerHeight;
      setSvgDimensions({ width, height });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    const svg = select(svgRef.current);
    
    // Define drag behavior
    const dragHandler = drag()
      .subject((event, d) => ({ x: d.x, y: d.y }))
      .on('start', (event, d) => {
        select(event.sourceEvent.target).classed('active', true);
      })
      .on('drag', (event, d) => {
        const draggedNodeIndex = nodes.findIndex((node) => node.id === d.id);
        if (draggedNodeIndex !== -1) {
          const newNodes = [...nodes];
          newNodes[draggedNodeIndex].x = event.x;
          newNodes[draggedNodeIndex].y = event.y;
          setNodes(newNodes); 
        }
      })
      .on('end', (event, d) => {
        select(event.sourceEvent.target).classed('active', false);
      });

    svg.selectAll('circle').call(dragHandler);
    svg.selectAll('circle').data(nodes);
  }, [nodes]);

  const handleNodeClick = (nodeId) => {
    if (selectedNode === null) {
      setSelectedNode(nodeId);
    } else {
      if (selectedNode !== nodeId) {
        setLinks([...links, { source: selectedNode, target: nodeId }]);
      }
      setSelectedNode(null);
    }
  };

  // Object adding logic
  const [createdObjectList, setCreatedObjectList] = useState([])

  const postQuestion = async () => { // Add node to the graph
    const questionNode = {
      question: questionName,
      links: []
    };
    addNode(questionNode)
  };

  const postTest = async () => { // Finish making graph

    // Gather nodes in list
    const questionNodes = nodes.map(node => ({
      id: node.id,
      key: node.key,
      concept: node.concept,
      x: node.x,
      y: node.y,
    }));
    const editedGraph = {
      id: graph.id,
      graphName: testName,
      graphDescription: description,
      concepts: questionNodes,
      links: links
    }
    console.log('Edituje se:', editedGraph)
    try {
      const response = await axios.put('http://localhost:3000/knowledge-space',
        editedGraph, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      navigate('/graphs')
    } catch (error) {
      console.error('There was an error sending the new graph data:', error);
    }
  };

  const getRandomX = () => Math.random() * (svgDimensions.width - sidebarWidth);
  const getRandomY = () => Math.random() * svgDimensions.height;

  const addNode = (node) => {
    const newNodeId = uuidv4();
    setNodes([...nodes, { key: newNodeId, x: getRandomX(), y: getRandomY(), concept: node.question }]);

  };
  
  const addObjectToList = (object) => {
    let fqt = 0
    createdObjectList.forEach(addedObject => {
      if(addedObject.type === 'conceptText' && object.type === 'conceptText'){
        fqt = 1
        currentQT = object.userInput
        setQuestionName(currentQT)
        addedObject.userInput = object.userInput
      }
    });

    if(fqt === 0 && object.type === 'conceptText'){
      currentQT = object.userInput
      setQuestionName(currentQT)
      createdObjectList.push(object)
    }
  }

  // Object removing logic
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const removeSelectedNode = () => {

    if (selectedNodeId) {
      const idToRemove = selectedNodeId;
      // Filter out the node
      setNodes(prevNodes => prevNodes.filter(node => node.id !== idToRemove));

      // Filter out the links associated with the node
      setLinks(prevLinks => prevLinks.filter(
        link => link.source !== idToRemove && link.target !== idToRemove
      ));

      // Reset selected node
      setSelectedNodeId('');
    }
  };

  // Name of the test change
  const handleTestNameChange = (e) => {
    setTestName(e.target.value);
  };

  const startEditingTestName = () => {
    setEditingTestName(true);
  };

  const stopEditingTestName = () => {
    setEditingTestName(false);
  };

  const handleBackButton = () => {
    navigate('/graphs')
  }
  let currentQT

  return (
    <div className="kg-wrapper">
      <div className="sidebarKG">
          <h3 style={{color: 'white'}}>Knowledge Graph Creator</h3>
          <HiddenFormMenu title={"Add new Concept:"} btnName={"New Concept"} 
            typeForm={'conceptText'} addObjectToList={addObjectToList} 
            currentState={currentQT}/>
          <div className='question-level-wrapper'>
          </div>
          <div className="remove-node-wrap">
            <label style={{color:'white', marginBottom:'10px'}}>Select Node For Removal:</label>
            <select value={selectedNodeId} onChange={(e) => setSelectedNodeId(e.target.value)}>
              <option value="">-- Select Node --</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.concept}
                </option>
              ))}
            </select>
            <button className="remove-node-button" onClick={removeSelectedNode}>Remove Node</button>
        </div>
          <button className='finish-button' onClick={postQuestion}>Add Node</button>
          <button className='finish-test-button' onClick={postTest}>Finish Editing</button>
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
              r={20}
              fill={selectedNode === node.key ? 'red' : '#04AA6D'}
              onClick={() => handleNodeClick(node.key)}
            />
            <text x={node.x} y={node.y} dy={5} textAnchor="middle">{node.concept}</text>
          </g>
        ))}
      </svg>
      </div>
    </div>
  );
};

export default EditKnowledgeGraph;