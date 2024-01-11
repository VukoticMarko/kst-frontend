import React, { useState } from 'react';
import ReactFlow from 'react-flow-renderer';

const initialElements = [
  { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'Example Node' } },
];

function BasicFlow() {
  return (
    <div style={{ height: 500, width: 500 }}>
      <ReactFlow elements={initialElements} />
    </div>
  );
}

export default BasicFlow;