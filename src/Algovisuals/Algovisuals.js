import React, { Component } from "react";

import "./Algovisuals.css";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

const ANIMATION_TIME = 3;
const START_NODE_ROW = 12; // 20
const START_NODE_COL = 15; // 15
const FINISH_NODE_ROW = 12; // 20
const FINISH_NODE_COL = 35; // 35
const NUMBER_OF_COLUMNS = 50;
const NUMBER_OF_ROWS = 35;

class Algovisuals extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  handleResetBoard() {
    const visitedNodes = document.querySelectorAll(".node-visited");
    const pathNodes = document.querySelectorAll(".node-shortest-path");
    const wallNodes = document.querySelectorAll(".node-wall");
    const nodeStart = document.querySelector(
      `#node-${START_NODE_ROW}-${START_NODE_COL}`
    );
    const nodeFinish = document.querySelector(
      `#node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    );

    [].forEach.call(pathNodes, function (el) {
      el.className = "node";
    });

    [].forEach.call(visitedNodes, function (el) {
      el.className = "node";
    });

    [].forEach.call(wallNodes, function (el) {
      el.className = "node";
    });
    nodeStart.className = "node node-start";
    nodeFinish.className = "node node-finish";
    this.setState({ grid: getInitialGrid(), mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, ANIMATION_TIME * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, ANIMATION_TIME * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  toggleModal() {
   document.querySelector(".backdrop").style.display="none";
   document.querySelector(".modal").style.display="none";
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div>
        <div className="backdrop" onClick={() => this.toggleModal()}></div>
        <div className="modal" onClick={() => this.toggleModal()}>
          <h3 className="modal__title">Drag or click cells to create obstacles</h3>
        </div>
        <button id="reset" onClick={() => this.handleResetBoard()}>
          Reset
        </button>
        <button onClick={() => this.visualizeDijkstra()}>Show It!</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default Algovisuals;
