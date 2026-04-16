import React from "react";

export default function GameOver({ score, bestScore, onRestart }) {
  return (
    <div className="game-over-overlay">
      <div className="game-over-card">
        <h2>GAME OVER</h2>
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
        <button type="button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
