import React, { useEffect, useState } from 'react';
import DisplayGraph from './display-graph';
import { v4 as uuidv4 } from 'uuid';
import Header from '../header/header';
import './choose-graph.css';
import axios from 'axios';

const ChooseGraph = ({code}) => {

  // Code 0 = Default creating graph card
  // Code 1 = General Graph Menu
  // Code 2 = Creating tests flow

   const [graphs, setGraphs] = useState([])
   const [text, setText] = useState('Choose Graph that will be used for test creation.')
   const accessToken = localStorage.getItem('accessToken')

   // Default card
   const defaultTitle = 'Create New Graph';
   const defaultDescription = 'By pressing this card you will be taken to the new graph creation screen.';
   const card = {
     id: 999999999,
     graphName: defaultTitle,
     graphDescription: defaultDescription,
   }

   useEffect (() => {

    if(code === 1){
      setText('Choose which Graph to edit, or you can create a new one.')
    }
        const node = {
            id: uuidv4(),
            concept: 'html',
            x: 250,
            y: 250,
        }
        const node2 = {
          id: uuidv4(),
          concept: 'css',
            x: 275,
            y: 420,
        } 
        const node3 = {
          id: uuidv4(),
          concept: 'js',
            x: 550,
            y: 265,
        }
        const node4 = {
          id: uuidv4(),
          concept: 'react',
            x: 550,
            y: 525,
        }
        let links = []
        let linkObj1 = {
          source: node.id,
          taget: node2.id
        }
        links.push(linkObj1)

        let graphNodes = []
        graphNodes.push(node)
        graphNodes.push(node2)
        graphNodes.push(node3)
        graphNodes.push(node4)
        const graphTitle = 'My beautiful first graph';
        const graphDescription = 'This is my first static graph :)';
        const graph = {
            id: 321341421,
            graphName: graphTitle,
            graphDescription: graphDescription,
            concepts: graphNodes,
            links: links
        }
        console.log('Static graph ', graph)
      
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/knowledge-space', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          const data = response.data;
          setGraphs([graph, ...data])
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();

   

   }, []);

   console.log('Graphs:', graphs)

   return (
    <div>
      <h2 style={{color:"green", marginTop: '75px'}}>{text}</h2>
      <div className="graph-wrapper">
      <div className='create-new-graph-div'><DisplayGraph graph={card} code={0}></DisplayGraph></div>
      {graphs.map((graph, index) => (
        <div key={index} className="rectangle">
            <DisplayGraph
            graph={graph}
            code={code}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseGraph;