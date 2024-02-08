import React, { useState, useRef, useEffect } from 'react';
import { select, event, drag } from 'd3';


const KnowledgeGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const svgRef = useRef();

  useEffect(() => {
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

    // Apply drag behavior to circles
    svg.selectAll('circle').call(dragHandler);
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

  const handleAddNode = () => {
    const newNodeId = nodes.length + 1;
    setNodes([...nodes, { id: newNodeId, x: 100, y: 100, title: newNodeTitle }]);
    setNewNodeTitle('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter node title"
        value={newNodeTitle}
        onChange={(e) => setNewNodeTitle(e.target.value)}
      />
      <button onClick={handleAddNode}>Add Node</button>
      <svg ref={svgRef} width="1000" height="1000">
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
              r={20}
              fill={selectedNode === node.id ? 'red' : 'blue'}
              onClick={() => handleNodeClick(node.id)}
              ref={(el) => select(el).datum(node)} // Bind node data to SVG element
            />
            <text x={node.x} y={node.y} dy={5} textAnchor="middle">{node.title}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default KnowledgeGraph;
