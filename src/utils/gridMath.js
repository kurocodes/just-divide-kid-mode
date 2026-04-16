export const GRID_SIZE = 4;

const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function indexToRowCol(index) {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

export function rowColToIndex(row, col) {
  return row * GRID_SIZE + col;
}

export function getNeighborIndices(index) {
  const { row, col } = indexToRowCol(index);

  return DIRECTIONS.map(([dRow, dCol]) => {
    const nextRow = row + dRow;
    const nextCol = col + dCol;

    if (
      nextRow < 0 ||
      nextRow >= GRID_SIZE ||
      nextCol < 0 ||
      nextCol >= GRID_SIZE
    ) {
      return null;
    }

    return rowColToIndex(nextRow, nextCol);
  }).filter((value) => value !== null);
}
