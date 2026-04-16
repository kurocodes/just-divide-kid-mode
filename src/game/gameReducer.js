import { resolvePlacement } from "../utils/mergeLogic";
import {
  applyMoveResult,
  buildInitialState,
  refillQueue,
  snapshotForUndo,
} from "./gameState";

export function createInitialGameState(bestScore, difficulty = 2) {
  return buildInitialState({ difficulty, bestScore });
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "PLACE_TILE": {
      const { index } = action;

      if (state.gameOver || state.grid[index] !== null || state.queue.length === 0) {
        return state;
      }

      const undoStack = [...state.undoStack, snapshotForUndo(state)].slice(-10);
      const activeTile = state.queue[0];
      const nextGrid = [...state.grid];
      nextGrid[index] = activeTile;
      const mergeResult = resolvePlacement(nextGrid, index);
      const queueAfterUse = state.queue.slice(1);

      return {
        ...applyMoveResult(
          state,
          mergeResult.grid,
          queueAfterUse,
          mergeResult.scoreGained,
          {
            lastPlacedIndex: index,
            mergeFlashIndices: mergeResult.removedIndices,
          },
        ),
        undoStack,
      };
    }

    case "KEEP_TILE": {
      if (state.gameOver || state.queue.length === 0) {
        return state;
      }

      const undoStack = [...state.undoStack, snapshotForUndo(state)].slice(-10);
      const activeTile = state.queue[0];
      const queueRest = state.queue.slice(1);

      if (state.keepVal === null) {
        return {
          ...state,
          keepVal: activeTile,
          queue: refillQueue(queueRest, state.grid, state.difficulty),
          undoStack,
          lastPlacedIndex: null,
          mergeFlashIndices: [],
        };
      }

      return {
        ...state,
        keepVal: activeTile,
        queue: refillQueue([state.keepVal, ...queueRest], state.grid, state.difficulty),
        undoStack,
        lastPlacedIndex: null,
        mergeFlashIndices: [],
      };
    }

    case "TRASH_TILE": {
      if (state.gameOver || state.queue.length === 0 || state.trashCount <= 0) {
        return state;
      }

      const undoStack = [...state.undoStack, snapshotForUndo(state)].slice(-10);
      const queueAfterTrash = state.queue.slice(1);

      return {
        ...applyMoveResult(state, state.grid, queueAfterTrash, 0, {
          trashCount: state.trashCount - 1,
          lastPlacedIndex: null,
          mergeFlashIndices: [],
        }),
        undoStack,
      };
    }

    case "UNDO": {
      if (state.undoStack.length === 0) {
        return state;
      }

      const previous = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        ...previous,
        undoStack: state.undoStack.slice(0, -1),
        celebration: "",
        lastPlacedIndex: null,
        mergeFlashIndices: [],
      };
    }

    case "RESTART":
      return buildInitialState({
        difficulty: action.difficulty ?? state.difficulty,
        bestScore: state.bestScore,
      });

    case "TOGGLE_HINTS":
      return {
        ...state,
        hintsEnabled: !state.hintsEnabled,
      };

    case "TICK":
      return state.gameOver
        ? state
        : {
            ...state,
            timer: state.timer + 1,
          };

    case "SET_DIFFICULTY":
      return buildInitialState({
        difficulty: action.difficulty,
        bestScore: state.bestScore,
      });

    case "CLEAR_CELEBRATION":
      return {
        ...state,
        celebration: "",
      };

    case "CLEAR_EFFECTS":
      return {
        ...state,
        lastPlacedIndex: null,
        mergeFlashIndices: [],
      };

    default:
      return state;
  }
}
