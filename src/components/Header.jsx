import React from "react";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function Header({
  timer,
  bestScore,
  hintsEnabled,
  onToggleHints,
}) {
  return (
    <header className="game-header">
      <div className="top-badge best-badge">
        <span className="top-badge__label">BEST</span>
        <span className="top-badge__value">{String(bestScore).padStart(2, "0")}</span>
      </div>

      <div className="header-main">
        <h1>JUST DIVIDE</h1>
        <div className="timer-pill">
          <span className="timer-pill__icon">⌛</span>
          <span>{formatTime(timer)}</span>
        </div>
        <p>DIVIDE WITH THE NUMBERS TO SOLVE THE ROWS AND COLUMNS.</p>
      </div>

      <button
        type="button"
        className={`top-badge help-badge ${hintsEnabled ? "help-badge--active" : ""}`}
        onClick={onToggleHints}
        aria-label="Toggle hints"
        title="Toggle hints (G)"
      >
        ?
      </button>
    </header>
  );
}
