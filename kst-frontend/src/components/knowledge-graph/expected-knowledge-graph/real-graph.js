import React from "react";
import { useState } from "react";
import '../../test-create/test-create.css';
import { select } from 'd3';
import * as d3 from 'd3';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import { useEffect } from "react";
import { useRef } from "react";
import axios from 'axios';
import QuestionMark from '../../test-create/question-mark.js';

function RealGraph ({answers, graph}) {

    console.log('Student answers are: ', answers)
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
    const [nodes, setNodes] = useState(graph.nodes);
    const [links, setLinks] = useState(graph.relations);
    const svgRef = useRef();
    const [graphName, setGraphName] = useState(graph.name);
    console.log('Graf je:', graph)


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

        const originalWidth = window.innerWidth;
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

    return (
    <div>
        <div className="graph-display-container-secondary">
            <div className="test-name-container">
                {graphName}
            </div>
            <QuestionMark message="This is the Real Expected Graph for this student. Student answers are visually displayed here." />
            <svg ref={svgRef} width={svgDimensions.width} height={svgDimensions.height}>
                {links.map((link, index) => {
                    const sourceNode = nodes.find(node => node.key === link.source);
                    const targetNode = nodes.find(node => node.key === link.target);

                    return (
                        <line
                            key={index}
                            x1={sourceNode?.x}
                            y1={sourceNode?.y}
                            x2={targetNode?.x}
                            y2={targetNode?.y}
                            stroke="black"
                        />
                    );
                })}
                {nodes.map((node) => {
                    // Find if there is an incorrect answer for the current node
                    const isAnswerIncorrect = answers.some(a => a.question.node.key === node.key && !a.answer.correct);

                    // Determine the fill color based on the correctness of the answer
                    const fillColor = isAnswerIncorrect ? 'red' : 'green';

                    return (
                        <g key={node.key}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={15}
                                fill={fillColor}
                                ref={(el) => select(el).datum(node)}
                            />
                            <text x={node.x} y={node.y} dy={5} textAnchor="middle">{node.text}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    </div>
    );

}
export default RealGraph;