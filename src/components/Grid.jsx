import React from "react";
import Tile from "./Tile";

export default function Grid({
  grid,
  hintIndices,
  dropTarget,
  onCellDragOver,
  onCellDrop,
  mergeFlashSet,
  placementPulseIndex,
}) {
  return (
    <div className="grid-shell">
      <div className="cat-wrap" aria-hidden="true">
        <div className="cat-face">
          <div className="cat-ear cat-ear--left" />
          <div className="cat-ear cat-ear--right" />
          <div className="cat-eye cat-eye--left" />
          <div className="cat-eye cat-eye--right" />
          <div className="cat-nose" />
          <div className="cat-mouth cat-mouth--left" />
          <div className="cat-mouth cat-mouth--right" />
          <div className="cat-whiskers cat-whiskers--left" />
          <div className="cat-whiskers cat-whiskers--right" />
          <div className="cat-stripe cat-stripe--center" />
          <div className="cat-stripe cat-stripe--left" />
          <div className="cat-stripe cat-stripe--right" />
        </div>
      </div>

      <div className="grid" role="grid" aria-label="Math puzzle grid">
        {grid.map((value, index) => {
          const isHinted = hintIndices.includes(index);
          const isHovered = dropTarget?.type === "grid" && dropTarget.index === index;

          return (
            <div
              key={index}
              className={[
                "grid-cell",
                isHinted ? "grid-cell--hint" : "",
                isHovered ? "grid-cell--hover" : "",
                placementPulseIndex === index ? "grid-cell--placed" : "",
                mergeFlashSet.has(index) ? "grid-cell--merged" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onDragOver={(event) => onCellDragOver(event, index)}
              onDrop={(event) => onCellDrop(event, index)}
              data-drop-type="grid"
              data-drop-index={index}
            >
              <Tile
                value={value}
                mergeFlash={mergeFlashSet.has(index)}
                placementPulse={placementPulseIndex === index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
