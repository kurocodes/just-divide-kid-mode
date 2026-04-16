import { BASE_TRASH_PER_LEVEL } from "./constants";
import { hasAnyValidAdjacentMerge } from "../utils/mergeLogic";
import { nextTileValue } from "./tileGenerator";

export function getStoredBestScore(storageKey) {
  if (typeof window === "undefined") {
    return 0;
  }

  const value = Number(window.localStorage.getItem(storageKey));
  return Number.isFinite(value) ? value : 0;
}

export function getLevelFromScore(score) {
  return Math.floor(score / 10) + 1;
}

export function snapshotForUndo(state) {
  return {
    grid: [...state.grid],
    queue: [...state.queue],
    keepVal: state.keepVal,
    score: state.score,
    bestScore: state.bestScore,
    level: state.level,
    trashCount: state.trashCount,
    hintsEnabled: state.hintsEnabled,
    timer: state.timer,
    difficulty: state.difficulty,
    gameOver: state.gameOver,
  };
}

export function isGameOver(grid) {
  return grid.every((value) => value !== null) && !hasAnyValidAdjacentMerge(grid);
}

export function refillQueue(queue, grid, difficulty) {
  const nextQueue = [...queue];

  while (nextQueue.length < 3) {
    nextQueue.push(nextTileValue(grid, difficulty));
  }

  return nextQueue;
}

export function buildInitialState({ difficulty = 2, bestScore = 0 } = {}) {
  const baseGrid = Array(16).fill(null);
  const queue = Array.from({ length: 3 }, () => nextTileValue(baseGrid, difficulty));

  return {
    grid: baseGrid,
    queue,
    keepVal: null,
    score: 0,
    bestScore,
    undoStack: [],
    level: 1,
    trashCount: BASE_TRASH_PER_LEVEL,
    hintsEnabled: true,
    timer: 0,
    difficulty,
    gameOver: false,
    celebration: "",
    lastPlacedIndex: null,
    mergeFlashIndices: [],
  };
}

export function applyMoveResult(state, nextGrid, nextQueue, scoreDelta, moveMeta = {}) {
  const nextScore = state.score + scoreDelta;
  const nextBestScore = Math.max(state.bestScore, nextScore);
  const nextLevel = getLevelFromScore(nextScore);
  const leveledUp = nextLevel > state.level;

  return {
    ...state,
    grid: nextGrid,
    queue: refillQueue(nextQueue, nextGrid, state.difficulty),
    score: nextScore,
    bestScore: nextBestScore,
    level: nextLevel,
    trashCount: leveledUp
      ? BASE_TRASH_PER_LEVEL
      : moveMeta.trashCount ?? state.trashCount,
    gameOver: isGameOver(nextGrid),
    celebration: leveledUp ? `Level ${nextLevel}!` : "",
    lastPlacedIndex: moveMeta.lastPlacedIndex ?? null,
    mergeFlashIndices: moveMeta.mergeFlashIndices ?? [],
  };
}
