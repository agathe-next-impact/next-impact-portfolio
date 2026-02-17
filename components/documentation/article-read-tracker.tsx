"use client";

import { useEffect } from "react";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";

interface ArticleReadTrackerProps {
  category: string;
  slug: string;
}

export function ArticleReadTracker({ category, slug }: ArticleReadTrackerProps) {
  const { profileId, markArticleRead } = useDocumentationMode();

  useEffect(() => {
    if (!profileId) return;

    const timer = setTimeout(() => {
      markArticleRead(category, slug);
    }, 10_000);

    return () => clearTimeout(timer);
  }, [profileId, category, slug, markArticleRead]);

  return null;
}
