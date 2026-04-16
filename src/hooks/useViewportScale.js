import { useEffect, useState } from "react";

export default function useViewportScale({
  width,
  height,
  padding,
}) {
  const [viewportLayout, setViewportLayout] = useState({
    scale: 1,
    isCompact: false,
    frameWidth: width,
    frameHeight: height,
  });

  useEffect(() => {
    const updateScale = () => {
      const availableWidth = Math.max(window.innerWidth - padding * 2, 320);
      const availableHeight = Math.max(window.innerHeight - padding * 2, 320);
      const widthScale = availableWidth / width;
      const heightScale = availableHeight / height;
      const isCompact = window.innerWidth <= 900;

      if (isCompact) {
        setViewportLayout({
          scale: 1,
          isCompact: true,
          frameWidth: Math.min(availableWidth, 480),
          frameHeight: null,
        });
        return;
      }

      const scale = Math.min(widthScale, heightScale, 1);
      setViewportLayout({
        scale,
        isCompact: false,
        frameWidth: width * scale,
        frameHeight: height * scale,
      });
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [height, padding, width]);

  return viewportLayout;
}
