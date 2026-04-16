import { getNeighborIndices } from "./gridMath";
import { canValuesMerge } from "./tileMatching";

export function resolvePlacement(grid, placedIndex) {
  const nextGrid = [...grid];
  const removedIndices = [];
  const mergedIntoIndices = [];
  const steps = [];
  let scoreGained = 0;
  let focusIndex = placedIndex;
  let safety = 0;

  while (focusIndex !== null && nextGrid[focusIndex] !== null && safety < 24) {
    safety += 1;
    const focusValue = nextGrid[focusIndex];
    const neighbors = getNeighborIndices(focusIndex);
    let merged = false;

    for (const neighborIndex of neighbors) {
      const neighborValue = nextGrid[neighborIndex];

      if (!canValuesMerge(focusValue, neighborValue)) {
        continue;
      }

      if (focusValue === neighborValue) {
        removedIndices.push(focusIndex, neighborIndex);
        steps.push({
          type: "equal",
          source: focusIndex,
          target: neighborIndex,
          removed: [focusIndex, neighborIndex],
        });
        nextGrid[focusIndex] = null;
        nextGrid[neighborIndex] = null;
        scoreGained += 20;
        focusIndex = null;
        merged = true;
        break;
      }

      const largerIndex = focusValue > neighborValue ? focusIndex : neighborIndex;
      const smallerIndex = largerIndex === focusIndex ? neighborIndex : focusIndex;
      const largerValue = nextGrid[largerIndex];
      const smallerValue = nextGrid[smallerIndex];
      const result = largerValue / smallerValue;

      removedIndices.push(smallerIndex);
      nextGrid[smallerIndex] = null;
      scoreGained += 10;

      if (result === 1) {
        removedIndices.push(largerIndex);
        nextGrid[largerIndex] = null;
        scoreGained += 10;
        steps.push({
          type: "divide-remove",
          source: focusIndex,
          target: neighborIndex,
          removed: [smallerIndex, largerIndex],
          result: null,
        });
        focusIndex = null;
      } else {
        nextGrid[largerIndex] = result;
        mergedIntoIndices.push(largerIndex);
        steps.push({
          type: "divide",
          source: focusIndex,
          target: neighborIndex,
          removed: [smallerIndex],
          resultIndex: largerIndex,
          result,
        });
        focusIndex = largerIndex;
      }

      merged = true;
      break;
    }

    if (!merged) {
      break;
    }
  }

  return {
    grid: nextGrid,
    scoreGained,
    removedIndices: [...new Set(removedIndices)],
    mergedIntoIndices: [...new Set(mergedIntoIndices)],
    finalIndex: focusIndex,
    steps,
  };
}
