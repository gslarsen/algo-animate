import React, { Component } from "react";

import "./Algovisuals.css";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

const ANIMATION_TIME = 3;
const START_NODE_ROW = 12;
const START_NODE_COL = 15;
const END_NODE_ROW = 12;
const END_NODE_COL = 35;
const NUMBER_OF_COLUMNS = 50;
const NUMBER_OF_ROWS = 35;

class Algovisuals extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: {
        row: START_NODE_ROW,
        col: START_NODE_COL,
      },
      endNode: {
        row: END_NODE_ROW,
        col: END_NODE_COL,
      },
      isStartNode: false,
      isEndNode: false,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { grid, startNode, endNode } = this.state;

    if (
      parseInt(startNode.row, 10) === parseInt(row, 10) &&
      parseInt(startNode.col, 10) === parseInt(col, 10)
    ) {
      const newGrid = this.getNewGridWithStartFinishToggled(
        grid,
        row,
        col,
        startNode
      );
      this.setState({
        grid: newGrid,
        startNode: { row, col },
        isStartNode: true,
      });
      return;
    }
    if (
      parseInt(endNode.row, 10) === parseInt(row, 10) &&
      parseInt(endNode.col, 10) === parseInt(col, 10)
    ) {
      const newGrid = this.getNewGridWithStartFinishToggled(
        grid,
        row,
        col,
        null,
        endNode
      );
      this.setState({
        grid: newGrid,
        endNode: { row, col },
        isEndNode: true,
      });

      return;
    }
    const newGrid = this.getNewGridWithWallToggled(grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    const { startNode, endNode } = this.state;
    if (
      (startNode.row === row && startNode.col === col) ||
      (endNode.row === row && endNode.col === col)
    ) {
      if (!this.state.mouseIsPressed) return;
    }
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp = (row, col) => {
    const currStartNode = this.state.startNode;

    if (this.state.isStartNode) {
      const newGrid = this.getNewGridWithStartFinishToggled(
        this.state.grid,
        row,
        col,
        currStartNode
      );
      this.setState({
        grid: newGrid,
        mouseIsPressed: false,
        startNode: { row, col },
        isStartNode: false,
        isEndNode: false,
      });
      return;
    }
    if (this.state.isEndNode) {
      this.setState({
        mouseIsPressed: false,
        endNode: { row, col },
        isEndNode: false,
      });
      return;
    }
    this.setState({ mouseIsPressed: false });
  };

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < NUMBER_OF_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (col, row) => {
    const { startNode, endNode } = this.state;
    return {
      col,
      row,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === endNode.row && col === endNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  getNewGridWithStartFinishToggled = (
    grid,
    row,
    col,
    currStartNode,
    currEndNode
  ) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    let newNode;

    if (currStartNode) {
      const currentStartNode = newGrid[currStartNode.row][currStartNode.col];
      currentStartNode.isStart = false;
      newNode = {
        ...node,
        isStart: !node.isStart,
        isWall: false,
      };
      newGrid[row][col] = newNode;
      newGrid[currStartNode.row][currStartNode.col] = currentStartNode;
    } else if (currEndNode) {
      const currentEndNode = newGrid[currEndNode.row][currEndNode.col];
      currentEndNode.isFinish = false;
      newNode = {
        ...node,
        isFinish: !node.isFinish,
        isWall: false,
      };
      newGrid[row][col] = newNode;
      newGrid[currEndNode.row][currEndNode.col] = currentEndNode;
    }

    return newGrid;
  };

  handleResetBoard() {
    const visitedNodes = document.querySelectorAll(".node-visited");
    const pathNodes = document.querySelectorAll(".node-shortest-path");
    const wallNodes = document.querySelectorAll(".node-wall");
    const nodeStart = document.querySelector(
      `#node-${this.state.startNode.row}-${this.state.startNode.col}`
    );
    const nodeFinish = document.querySelector(
      `#node-${this.state.endNode.row}-${this.state.endNode.col}`
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

    nodeStart.className = "node node-start draggable";
    nodeFinish.className = "node node-finish draggable";

    this.setState({ grid: this.getInitialGrid(), mouseIsPressed: false });
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
        document.getElementById(`node-${node.row}-${node.col}`).className +=
          " node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    let { grid, startNode, endNode } = this.state;
    startNode = grid[startNode.row][startNode.col];
    endNode = grid[endNode.row][endNode.col];
    const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  toggleModal() {
    document.querySelector(".backdrop").style.display = "none";
    document.querySelector(".modal").style.display = "none";
  }

  render() {
    const { grid, mouseIsPressed, startNode, endNode } = this.state;
    return (
      <div>
        <div className="backdrop" onClick={() => this.toggleModal()}></div>
        <div className="modal" onClick={() => this.toggleModal()}>
          <ul className="list modal__title">
            <li>Drag to move green start and red end nodes</li>
            <br />
            <li>Drag or click cells to create barriers</li>
            <br />
            <li>Hit 'GO!' to watch the algorithm run</li>
          </ul>
        </div>
        <button id="reset" onClick={() => this.handleResetBoard()}>
          Reset
        </button>
        <button onClick={() => this.visualizeDijkstra()}>GO!</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isWall } = node;
                  let isStart = false;
                  let isFinish = false;
                  if (
                    row === parseInt(startNode.row, 10) &&
                    col === parseInt(startNode.col, 0)
                  ) {
                    isStart = true;
                  }
                  if (row === endNode.row && col === endNode.col)
                    isFinish = true;
                  return (
                    <Node
                      key={"" + rowIdx + nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={(row, col) => this.handleMouseUp(row, col)}
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

export default Algovisuals;
