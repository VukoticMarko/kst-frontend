import React, { useEffect } from "react";
import { useState, useRef } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";
import * as d3 from "d3";


function KnowledgeGraph () {
  
  const graphContainerRef = useRef(null);

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
    const nodes = Array.from({ length: 10 }, (_, i) => ({ id: i }));

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
      .force("center", d3.forceCenter(width / 2, height / 2));

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

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
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
        <HiddenFormMenu title={"Add new Question:"} btnName={"New Question"}/>
        <HiddenFormMenu title={"Add RIGHT answer:"} btnName={"Right Answer"}/>
        <HiddenFormMenu title={"Add FALSE answers:"} btnName={"Wrong Answers"}/>
        <div className="graph-display-container" ref={graphContainerRef}>

        </div>
     </div>
    );
  };

export default KnowledgeGraph;