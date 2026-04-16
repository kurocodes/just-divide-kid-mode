import { getNeighborIndices, GRID_SIZE } from "./gridMath";

export function canValuesMerge(a, b) {
  if (a == null || b == null) {
    return false;
  }

  if (a === b) {
    return true;
  }

  const larger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return larger % smaller === 0;
}

export function canTileMergeAt(grid, index, value) {
  if (grid[index] !== null) {
    return false;
  }

  return getNeighborIndices(index).some((neighborIndex) =>
    canValuesMerge(value, grid[neighborIndex]),
  );
}

export function hasAnyValidAdjacentMerge(grid) {
  for (let index = 0; index < grid.length; index += 1) {
    const value = grid[index];
    if (value == null) {
      continue;
    }

    const right = index % GRID_SIZE === GRID_SIZE - 1 ? null : index + 1;
    const down = index + GRID_SIZE >= grid.length ? null : index + GRID_SIZE;

    if (right !== null && canValuesMerge(value, grid[right])) {
      return true;
    }

    if (down !== null && canValuesMerge(value, grid[down])) {
      return true;
    }
  }

  return false;
}

export function getHintIndices(grid, activeTile) {
  if (activeTile == null) {
    return [];
  }

  return grid.reduce((indices, cellValue, index) => {
    if (cellValue !== null) {
      return indices;
    }

    if (canTileMergeAt(grid, index, activeTile)) {
      indices.push(index);
    }

    return indices;
  }, []);
}
