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
   const [ontologyGraphs, setOntologyGraphs] = useState([])

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
            x: 250.12,
            y: 250.030,
        }
        const node2 = {
          id: uuidv4(),
          concept: 'css',
            x: 275.0044,
            y: 420.0022,
        } 
        const node3 = {
          id: uuidv4(),
          concept: 'js',
            x: 550.00,
            y: 265.43,
        }
        const node4 = {
          id: uuidv4(),
          concept: 'react',
            x: 550.00,
            y: 525.00,
        }
        let links = []
        let linkObj1 = {
          source: node.id,
          target: node2.id
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
      
      const fetchData2 = async () => {
        try {
          const response = await axios.get('http://localhost:3000/virtuoso', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          const data = response.data;
          data.forEach(graph => {
            // Convert graph id from string to int
            graph.id = parseInt(graph.id, 10);
        
            // Replace concept.id with the data from concept.key for each concept
            graph.concepts.forEach(concept => {
                concept.id = concept.key;
            });
        });
          setOntologyGraphs(data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData2();

   

   }, []);

   console.log('Graphs:', graphs)
   console.log('Ontology graphs:', ontologyGraphs)

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
        {ontologyGraphs.map((graph, index) => (
        <div key={index} className="ontology-graph-div">
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