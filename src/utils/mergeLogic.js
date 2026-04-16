export { GRID_SIZE, getNeighborIndices, indexToRowCol, rowColToIndex } from "./gridMath";
export {
  canTileMergeAt,
  canValuesMerge,
  getHintIndices,
  hasAnyValidAdjacentMerge,
} from "./tileMatching";
export { FALLBACK_TILE_POOL, buildTileCandidates } from "./tileGeneration";
export { resolvePlacement } from "./mergeResolver";
