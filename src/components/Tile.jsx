import React from "react";

const TILE_THEME = {
  2: { bg: "#ffb84d", fg: "#5f2600" },
  3: { bg: "#ff8fab", fg: "#6b1834" },
  4: { bg: "#7dd3fc", fg: "#114767" },
  5: { bg: "#f9a8d4", fg: "#681439" },
  6: { bg: "#d9f99d", fg: "#3f6212" },
  8: { bg: "#fb923c", fg: "#7c2d12" },
  9: { bg: "#c4b5fd", fg: "#4c1d95" },
  10: { bg: "#fde68a", fg: "#78350f" },
  12: { bg: "#86efac", fg: "#166534" },
  15: { bg: "#fca5a5", fg: "#7f1d1d" },
  16: { bg: "#fdba74", fg: "#7c2d12" },
  18: { bg: "#93c5fd", fg: "#1d4ed8" },
  20: { bg: "#fcd34d", fg: "#713f12" },
  24: { bg: "#6ee7b7", fg: "#065f46" },
  25: { bg: "#f0abfc", fg: "#701a75" },
  30: { bg: "#fda4af", fg: "#881337" },
  32: { bg: "#f87171", fg: "#7f1d1d" },
  35: { bg: "#a78bfa", fg: "#312e81" },
  36: { bg: "#34d399", fg: "#064e3b" },
};

export default function Tile({
  value,
  size = "grid",
  draggable = false,
  onDragStart,
  onDragEnd,
  className = "",
  active = false,
  ghost = false,
  compact = false,
  placementPulse = false,
  mergeFlash = false,
  onTouchStart,
}) {
  if (value == null) {
    return <div className={`tile tile--empty tile--${size} ${className}`.trim()} />;
  }

  const theme = TILE_THEME[value] ?? { bg: "#ffffff", fg: "#0f172a" };

  return (
    <div
      className={[
        "tile",
        `tile--${size}`,
        active ? "tile--active" : "",
        ghost ? "tile--ghost" : "",
        compact ? "tile--compact" : "",
        placementPulse ? "tile--placement-pulse" : "",
        mergeFlash ? "tile--merge-flash" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--tile-bg": theme.bg,
        "--tile-fg": theme.fg,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
    >
      <span>{value}</span>
    </div>
  );
}
