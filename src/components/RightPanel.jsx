import React from "react";
import Tile from "./Tile";

export default function RightPanel({
  keepVal,
  queue,
  trashCount,
  dropTarget,
  onKeepDragOver,
  onKeepDrop,
  onTrashDragOver,
  onTrashDrop,
  onTileDragStart,
  onTileDragEnd,
  onTileTouchStart,
}) {
  const activeTile = queue[0] ?? null;
  const nextTiles = queue.slice(1, 3);

  return (
    <aside className="right-panel">
      <div className="panel-block">
        <div className="panel-label">KEEP</div>
        <div
          className={`panel-slot ${dropTarget?.type === "keep" ? "panel-slot--hover" : ""}`}
          onDragOver={onKeepDragOver}
          onDrop={onKeepDrop}
          data-drop-type="keep"
        >
          <Tile value={keepVal} size="panel" />
        </div>
      </div>

      <div className="panel-block panel-block--queue">
        <div className="panel-label">QUEUE</div>
        <div className="queue-stack">
          <Tile
            value={activeTile}
            size="panel"
            active
            draggable={activeTile !== null}
            onDragStart={(event) => onTileDragStart(event, activeTile)}
            onDragEnd={onTileDragEnd}
            onTouchStart={(event) => onTileTouchStart(event, activeTile)}
            className="queue-active"
          />
          {nextTiles.map((value, index) => (
            <Tile
              key={`${value}-${index}`}
              value={value}
              size="panel"
              compact
              className="queue-next"
            />
          ))}
        </div>
      </div>

      <div className="panel-block">
        <div className="panel-label">TRASH</div>
        <div
          className={`panel-slot panel-slot--trash ${
            dropTarget?.type === "trash" ? "panel-slot--hover" : ""
          }`}
          onDragOver={onTrashDragOver}
          onDrop={onTrashDrop}
          data-drop-type="trash"
        >
          <div className="trash-icon" aria-hidden="true">
            <span className="trash-icon__lid" />
            <span className="trash-icon__body" />
          </div>
          <div className="trash-count">x{trashCount}</div>
        </div>
      </div>
    </aside>
  );
}
