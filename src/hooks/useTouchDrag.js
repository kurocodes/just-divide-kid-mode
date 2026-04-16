import { useEffect, useState } from "react";

export default function useTouchDrag({ dispatch, grid, gameOver }) {
  const [touchDrag, setTouchDrag] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const beginTouchDrag = (event, value) => {
    if (value == null || gameOver) {
      return;
    }

    const touch = event.touches[0];
    setTouchDrag({ value, x: touch.clientX, y: touch.clientY });
  };

  useEffect(() => {
    if (!touchDrag) {
      return undefined;
    }

    const updateHover = (x, y) => {
      const element = document.elementFromPoint(x, y);
      const target = element?.closest?.("[data-drop-type]");

      if (!target) {
        setDropTarget(null);
        return;
      }

      const type = target.getAttribute("data-drop-type");
      const index = target.getAttribute("data-drop-index");

      if (type === "grid") {
        const numericIndex = Number(index);
        setDropTarget(
          grid[numericIndex] === null ? { type: "grid", index: numericIndex } : null,
        );
        return;
      }

      setDropTarget({ type });
    };

    const onTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      setTouchDrag((current) =>
        current
          ? {
              ...current,
              x: touch.clientX,
              y: touch.clientY,
            }
          : current,
      );
      updateHover(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      if (dropTarget?.type === "grid" && typeof dropTarget.index === "number") {
        dispatch({ type: "PLACE_TILE", index: dropTarget.index });
      } else if (dropTarget?.type === "keep") {
        dispatch({ type: "KEEP_TILE" });
      } else if (dropTarget?.type === "trash") {
        dispatch({ type: "TRASH_TILE" });
      }

      setTouchDrag(null);
      setDropTarget(null);
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [dispatch, dropTarget, grid, touchDrag]);

  return {
    touchDrag,
    dropTarget,
    setDropTarget,
    beginTouchDrag,
  };
}
