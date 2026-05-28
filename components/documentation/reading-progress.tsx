"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("article-body");
      if (!article || !barRef.current) return;
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop;
      const percent = Math.min(100, Math.max(0, (scrolled / (articleHeight - window.innerHeight)) * 100));
      barRef.current.style.width = `${percent}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: "4rem",
      left: 0,
      right: 0,
      zIndex: 50,
      height: "2px",
      background: "transparent",
      pointerEvents: "none",
    }}>
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "0%",
          background: "var(--accent-color)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
