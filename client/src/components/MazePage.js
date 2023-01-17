import React, { useState } from "react";
import Maze from "./Maze";

import "./Maze.css";

const MazePage = () => {
  return (
    <>
      <div>Maze</div>
      <button
        onClick={() => {
          window.location.replace("/");
          console.log("clicking me rn!");
        }}
      >
        Back
      </button>
      <Maze />
    </>
  );
};

export default MazePage;
