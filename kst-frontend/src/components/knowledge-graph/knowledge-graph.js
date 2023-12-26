import React, { useEffect } from "react";
import { useState, useRef } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import './knowledge-graph.css'
import * as d3 from "d3";


function KnowledgeGraph () {
  
  const graphContainerRef = useRef(null);
  const [selectedFalse, setSelectedFalse] = useState(1);

  useEffect(() => {
    // Your D3 logic to generate a random graph
    const width = 600;
    const height = 400;
  
    const svg = d3
      .select(graphContainerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Generate random data for nodes
    const nodes = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * width, // Initial x position within width
      y: Math.random() * height, // Initial y position within height
    }));
  
    // Generate random data for links
    const links = nodes.map((node, i) => ({
      source: i,
      target: Math.floor(Math.random() * nodes.length),
    }));
  
    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink(links).distance(100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX().strength(0.1).x(width / 2)) // Constrain to horizontal center
      .force("y", d3.forceY().strength(0.1).y(height / 2)); // Constrain to vertical center
  
    // Draw links
    const link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "black");
  
    // Draw nodes
    const node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", "blue");
  
    // Update node positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
  
      node.attr("cx", (d) => Math.max(10, Math.min(width - 10, d.x))).attr("cy", (d) => Math.max(10, Math.min(height - 10, d.y)));
    });
  
    return () => {
      // Cleanup D3 elements on component unmount
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
  
    return (
     <div>
        <div className="sidebarKG">
          <h3 style={{color: 'white'}}>Test Creator</h3>
          <HiddenFormMenu title={"Add new Question:"} btnName={"New Question"}/>
          <HiddenFormMenu title={"Add RIGHT answer:"} btnName={"Right Answer"}/>
          <div className='rb'>
              <h4 style={{color: 'white'}}>Select number of false answers:</h4>
              <input type='radio'
              onChange={() => setSelectedFalse(1)} value={1}
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
                <HiddenFormMenu title={"Add FALSE answer 1:"} btnName={"Wrong Answer 1"}/>
              </div>
            )
          }
           {
            selectedFalse === 3 && (
              <div>
                <HiddenFormMenu title={"Add FALSE answer 1:"} btnName={"Wrong Answer 1"}/>
                <HiddenFormMenu title={"Add FALSE answer 2:"} btnName={"Wrong Answer 2"}/>
                <HiddenFormMenu title={"Add FALSE answer 3:"} btnName={"Wrong Answer 3"}/>
              </div>
            )
          }
          
        </div>
        <div className="graph-display-container" ref={graphContainerRef} />
     </div>
    );
  };

export default KnowledgeGraph;