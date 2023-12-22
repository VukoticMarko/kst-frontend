import React from "react";
import { useState, useRef } from "react";
import HiddenFormMenu from "../form-menu/hidden-form-menu";


function KnowledgeGraph () {
  
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
     </div>
    );
  };

export default KnowledgeGraph;