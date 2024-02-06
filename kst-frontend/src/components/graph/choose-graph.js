import React, { useEffect, useState } from 'react';
import DisplayGraph from './display-graph';
import { v4 as uuidv4 } from 'uuid';
import Header from '../header/header';
import './choose-graph.css';
import axios from 'axios';

const ChooseGraph = () => {

   const [graphs, setGraphs] = useState([])
   const accessToken = localStorage.getItem('accessToken')

   useEffect (() => {

        const node = {
            key: uuidv4(),
            concept: 'html',
            questionLevel: 1,
            x: 250,
            y: 250,
            links: []
        }
        const node2 = {
            key: uuidv4(),
            concept: 'css',
            questionLevel: 2,
            x: 275,
            y: 420,
            links: []
        } 
        const node3 = {
            key: uuidv4(),
            concept: 'js',
            questionLevel: 3,
            x: 550,
            y: 265,
            links: []
        }
        const node4 = {
            key: uuidv4(),
            concept: 'react',
            questionLevel: 4,
            x: 550,
            y: 525,
            links: []
        }
        node.links = [node2.key];
        node2.links = [node3.key];
        node3.links = [node4.key];
        let graphNodes = []
        graphNodes.push(node)
        graphNodes.push(node2)
        graphNodes.push(node3)
        graphNodes.push(node4)
        const graphTitle = 'My beautiful first graph';
        const graphDescription = 'This is my first static graph :)';
        const graph = {
            id: 1,
            graphName: graphTitle,
            graphDescription: graphDescription,
            concepts: graphNodes 
        }

        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3000/knowledge-space', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });
    
            const data = response.data;
            setGraphs(data)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();

        graphs.push(graph)

   }, []);

   console.log('Graphs:', graphs)

   return (
    <div>
      <h2 style={{color:"green", marginTop: '75px'}}>Choose Graph that will be used for test creation.</h2>
      <div className="graph-wrapper">
      {graphs.map((graph, index) => (
        <div key={index} className="rectangle">
            <DisplayGraph
            graph={graph}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseGraph;