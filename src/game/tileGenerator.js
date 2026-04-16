import { DIFFICULTIES } from "./constants";
import { FALLBACK_TILE_POOL, buildTileCandidates } from "../utils/mergeLogic";

export function createTileGenerator() {
  return (grid, difficulty) => {
    const pool = DIFFICULTIES[difficulty] ?? FALLBACK_TILE_POOL;
    const candidates = buildTileCandidates(grid, pool);
    const chosenPool = candidates.length > 0 ? candidates : pool;
    const randomIndex = Math.floor(Math.random() * chosenPool.length);
    return chosenPool[randomIndex];
  };
}

export const nextTileValue = createTileGenerator();
