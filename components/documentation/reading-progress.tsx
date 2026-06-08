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
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 h-0.5 bg-transparent">
      <div
        ref={barRef}
        className="h-full bg-accent"
        style={{ width: "0%", transition: "width 0.1s linear" }}
      />
    </div>
  );
}
