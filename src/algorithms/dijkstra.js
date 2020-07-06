// Performs Dijkstra's algorithm

export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) {
      return {visitedNodesInOrder, nodesInShortestPathOrder: getNodesInShortestPathOrder(finishNode)};
    }
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    if (
      (neighbor.row < node.row && neighbor.col < node.col) ||
      (neighbor.row < node.row && neighbor.col > node.col) ||
      (neighbor.row > node.row && neighbor.col < node.col) ||
      (neighbor.row > node.row && neighbor.col > node.col)
    ) {
      if (node.distance + Math.SQRT2 < neighbor.distance) {
        neighbor.distance = node.distance + Math.SQRT2;
        neighbor.previousNode = node;
      }
    } else if (node.distance + 1 < neighbor.distance) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row > 0 && col < grid[0].length - 1)
    neighbors.push(grid[row - 1][col + 1]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1 && col > 0) neighbors.push(grid[row + 1][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (row < grid.length - 1 && col < grid[0].length - 1)
    neighbors.push(grid[row + 1][col + 1]);

  const notVisitedNeighbors = neighbors.filter(
    (neighbor) => !neighbor.isVisited
  );
  return notVisitedNeighbors;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
