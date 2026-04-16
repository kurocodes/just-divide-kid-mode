import React, { useEffect, useMemo, useReducer } from "react";
import Grid from "./components/Grid";
import Header from "./components/Header";
import RightPanel from "./components/RightPanel";
import GameOver from "./components/GameOver";
import Tile from "./components/Tile";
import { getHintIndices } from "./utils/mergeLogic";
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  STORAGE_KEY,
  VIEWPORT_PADDING,
} from "./game/constants";
import {
  createInitialGameState,
  gameReducer,
} from "./game/gameReducer";
import { getStoredBestScore } from "./game/gameState";
import useGameHotkeys from "./hooks/useGameHotkeys";
import useInterval from "./hooks/useInterval";
import useTouchDrag from "./hooks/useTouchDrag";
import useViewportScale from "./hooks/useViewportScale";

function useGameEffects(state, dispatch) {
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(state.bestScore));
  }, [state.bestScore]);

  useInterval(() => {
    dispatch({ type: "TICK" });
  }, 1000);

  useEffect(() => {
    if (!state.celebration) {
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => dispatch({ type: "CLEAR_CELEBRATION" }),
      1800,
    );
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, state.celebration]);

  useEffect(() => {
    if (state.lastPlacedIndex === null && state.mergeFlashIndices.length === 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => dispatch({ type: "CLEAR_EFFECTS" }),
      550,
    );
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, state.lastPlacedIndex, state.mergeFlashIndices]);
}

function useDragHandlers({ dispatch, grid, setDropTarget }) {
  const handleDragStart = (event, value) => {
    if (value == null) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.setData("text/plain", String(value));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDropTarget(null);
  };

  const handleDropToGrid = (event, index) => {
    event.preventDefault();
    setDropTarget(null);
    dispatch({ type: "PLACE_TILE", index });
  };

  const allowGridDrop = (event, index) => {
    event.preventDefault();
    setDropTarget(grid[index] === null ? { type: "grid", index } : null);
  };

  const allowKeepDrop = (event) => {
    event.preventDefault();
    setDropTarget({ type: "keep" });
  };

  const allowTrashDrop = (event) => {
    event.preventDefault();
    setDropTarget({ type: "trash" });
  };

  const handleKeepDrop = (event) => {
    event.preventDefault();
    setDropTarget(null);
    dispatch({ type: "KEEP_TILE" });
  };

  const handleTrashDrop = (event) => {
    event.preventDefault();
    setDropTarget(null);
    dispatch({ type: "TRASH_TILE" });
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDropToGrid,
    allowGridDrop,
    allowKeepDrop,
    allowTrashDrop,
    handleKeepDrop,
    handleTrashDrop,
  };
}

export default function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    getStoredBestScore(STORAGE_KEY),
    (bestScore) => createInitialGameState(bestScore),
  );

  const { scale, isCompact, frameWidth, frameHeight } = useViewportScale({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    padding: VIEWPORT_PADDING,
  });

  const {
    touchDrag,
    dropTarget,
    setDropTarget,
    beginTouchDrag,
  } = useTouchDrag({
    dispatch,
    grid: state.grid,
    gameOver: state.gameOver,
  });

  useGameEffects(state, dispatch);
  useGameHotkeys(dispatch);

  const hintIndices = useMemo(() => {
    if (!state.hintsEnabled || state.queue.length === 0) {
      return [];
    }

    return getHintIndices(state.grid, state.queue[0]);
  }, [state.grid, state.hintsEnabled, state.queue]);

  const mergeFlashSet = useMemo(
    () => new Set(state.mergeFlashIndices),
    [state.mergeFlashIndices],
  );

  const dragHandlers = useDragHandlers({
    dispatch,
    grid: state.grid,
    setDropTarget,
  });

  return (
    <div className="app-shell">
      <div
        className={`game-scale-frame ${isCompact ? "game-scale-frame--compact" : ""}`}
        style={{
          width: frameWidth,
          height: frameHeight ?? "auto",
        }}
      >
        <div
          className={`game-frame ${isCompact ? "game-frame--compact" : ""}`}
          style={{
            transform: isCompact ? "none" : `scale(${scale})`,
            width: "100%",
            height: "auto",
          }}
        >
          <div className="background-bubbles" aria-hidden="true">
            <span className="bubble bubble--1" />
            <span className="bubble bubble--2" />
            <span className="bubble bubble--3" />
            <span className="bubble bubble--4" />
            <span className="bubble bubble--5" />
            <span className="bubble bubble--6" />
          </div>

          <div className="game-card">
            <Header
              timer={state.timer}
              bestScore={state.bestScore}
              hintsEnabled={state.hintsEnabled}
              onToggleHints={() => dispatch({ type: "TOGGLE_HINTS" })}
            />

            <div className="status-row">
              <div className="status-pill">{`LEVEL ${state.level}`}</div>
              <div className="status-pill status-pill--difficulty">{`D${state.difficulty}`}</div>
              <div className="status-pill">{`SCORE ${state.score}`}</div>
            </div>

            {state.celebration ? (
              <div className="celebration-banner">{state.celebration}</div>
            ) : (
              <div className="celebration-spacer" />
            )}

            <div className="game-body">
              <Grid
                grid={state.grid}
                hintIndices={hintIndices}
                dropTarget={dropTarget}
                onCellDragOver={dragHandlers.allowGridDrop}
                onCellDrop={dragHandlers.handleDropToGrid}
                mergeFlashSet={mergeFlashSet}
                placementPulseIndex={state.lastPlacedIndex}
              />

              <RightPanel
                keepVal={state.keepVal}
                queue={state.queue}
                trashCount={state.trashCount}
                dropTarget={dropTarget}
                onKeepDragOver={dragHandlers.allowKeepDrop}
                onKeepDrop={dragHandlers.handleKeepDrop}
                onTrashDragOver={dragHandlers.allowTrashDrop}
                onTrashDrop={dragHandlers.handleTrashDrop}
                onTileDragStart={dragHandlers.handleDragStart}
                onTileDragEnd={dragHandlers.handleDragEnd}
                onTileTouchStart={beginTouchDrag}
              />
            </div>

            <div className="footer-bar">
              <div className="shortcut-row">
                <span>Z Undo</span>
                <span>R Restart</span>
                <span>G Hints</span>
                <span>1 2 3 Difficulty</span>
              </div>
              <button
                type="button"
                className="restart-button"
                onClick={() => dispatch({ type: "RESTART" })}
              >
                Restart
              </button>
            </div>
          </div>

          {state.gameOver ? (
            <GameOver
              score={state.score}
              bestScore={state.bestScore}
              onRestart={() => dispatch({ type: "RESTART" })}
            />
          ) : null}
        </div>

        {touchDrag ? (
          <div
            className="touch-ghost"
            style={{
              left: touchDrag.x - 44,
              top: touchDrag.y - 44,
            }}
          >
            <Tile value={touchDrag.value} size="panel" ghost />
          </div>
        ) : null}
      </div>
    </div>
  );
}
