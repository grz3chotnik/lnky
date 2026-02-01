"use client";

import { useEffect, useState } from "react";

interface CustomCursorProps {
  cursorUrl: string;
}

export function CustomCursor({ cursorUrl }: CustomCursorProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload the cursor image to ensure it's cached
    const img = new window.Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(false);
    img.src = cursorUrl;
  }, [cursorUrl]);

  useEffect(() => {
    if (!isLoaded) return;

    const styleId = "custom-cursor-style";

    // Remove existing style if present
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    // Create and inject new style
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      body,
      body * {
        cursor: url(${cursorUrl}) 0 0, auto !important;
      }
      body a,
      body button,
      body [role="button"],
      body input[type="submit"],
      body input[type="button"],
      body .cursor-pointer {
        cursor: url(${cursorUrl}) 0 0, pointer !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [cursorUrl, isLoaded]);

  return null;
}
