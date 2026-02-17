"use client";

import { useEffect } from "react";
import { motion, useSpring, useMotionTemplate } from "framer-motion";

export function ReadingProgress() {
  const smoothProgress = useSpring(0, { stiffness: 100, damping: 30 });
  const widthStyle = useMotionTemplate`${smoothProgress}%`;

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("article-body");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop;
      const percent = Math.min(
        100,
        Math.max(0, (scrolled / (articleHeight - window.innerHeight)) * 100)
      );
      smoothProgress.set(percent);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [smoothProgress]);

  return (
    <div className="fixed top-16 left-0 right-0 z-50 h-0.5 bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-orange via-regularblue to-lightblue"
        style={{ width: widthStyle }}
      />
    </div>
  );
}
