import React, { Component } from "react";

import "./Node.css";

class Node extends Component {
  render() {
    let {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
        draggable={isStart || isFinish}
        onDragStart={() => onMouseDown(row, col)}
        onDragEnd={(event) => {
          /* THIS IS KEY to get element on drop */
          let elem= document.elementFromPoint(event.clientX, event.clientY);
          let id = elem.id;
          const params = id.match(/[0-9]+/g);

          if (params) {
            row = params[0];
            col = params[1];
            if (isStart) {
              elem.classList.add("node-start");
              elem.setAttribute("draggable", true);
              // onMouseUp(row, col)
            }
            if (isFinish) {
              elem.classList.add("node-finish");
              elem.setAttribute("draggable", true);
              // onMouseUp(row, col)
            }
            onMouseUp(row, col);
            return;
          }
          onMouseUp(row, col);
        }}
      ></div>
    );
  }
}

export default Node;
