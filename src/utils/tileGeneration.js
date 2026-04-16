export const FALLBACK_TILE_POOL = [
  2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 35, 36,
];

export function buildTileCandidates(grid, difficultyPool) {
  const presentValues = grid.filter((value) => value !== null);

  if (presentValues.length === 0) {
    return difficultyPool;
  }

  const candidateSet = new Set();

  presentValues.forEach((value) => {
    difficultyPool.forEach((poolValue) => {
      if (value % poolValue === 0 || poolValue % value === 0) {
        candidateSet.add(poolValue);
      }
    });
  });

  return candidateSet.size > 0 ? [...candidateSet] : difficultyPool;
}
