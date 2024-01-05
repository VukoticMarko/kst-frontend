import React, { useEffect } from "react";
import { useState, useRef } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import './knowledge-graph.css';
import * as d3 from 'd3';
import { useNavigate } from "react-router-dom";


function KnowledgeGraph () {

  const graphContainerRef = useRef();
  const [selectedFalse, setSelectedFalse] = useState(1);
  const navigate = useNavigate()

  useEffect(() => {
    const width = graphContainerRef.current.clientWidth;
    const height = graphContainerRef.current.clientHeight;
    d3.selectAll('.graph-display-container-main svg').remove();

    const svg = d3
      .select(graphContainerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const nodes = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const links = nodes.map((node, i) => ({
      source: i,
      target: Math.floor(Math.random() * nodes.length),
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-50))
      .force('link', d3.forceLink(links).distance(100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'black');

    const node = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .attr('fill', 'blue');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => Math.max(10, Math.min(width - 10, d.x))).attr('cy', (d) => Math.max(10, Math.min(height - 10, d.y)));
    });

    return () => {
      simulation.stop();
    };
  }, []);
  

    const addNode = () => {
      // Your addNode logic here
    };
  
    const addEdge = () => {
      // Your addEdge logic here
    };
  
    const removeSelected = () => {
      // Your removeSelected logic here
    };
  
    const saveGraph = () => {
      // Your saveGraph logic here
    };
  
    const handleBackButton = () => {
      navigate('/courses')
    }

    const postQuestion = async () => {
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
          <br></br>
          <button className='back-button' onClick={handleBackButton}>Go Back</button>
        </div>
        <div className="graph-display-container-main" ref={graphContainerRef}/>
     </div>
    );
  };

export default KnowledgeGraph;