"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { ProfileId } from "@/lib/documentation-profiles";

interface DocumentationModeContextType {
  isAdvancedMode: boolean;
  toggleMode: () => void;
  profileId: ProfileId | null;
  setProfile: (id: ProfileId) => void;
  clearProfile: () => void;
  readArticles: string[];
  markArticleRead: (category: string, slug: string) => void;
}

const DocumentationModeContext = createContext<DocumentationModeContextType>({
  isAdvancedMode: false,
  toggleMode: () => {},
  profileId: null,
  setProfile: () => {},
  clearProfile: () => {},
  readArticles: [],
  markArticleRead: () => {},
});

export function DocumentationModeProvider({ children }: { children: ReactNode }) {
  const [readArticles, setReadArticles] = useState<string[]>([]);

  // Profile-specific content is disabled. Clear the legacy value so existing
  // sessions always fall back to the default content.
  useEffect(() => {
    try {
      localStorage.removeItem("doc-profile");
      const storedRead = localStorage.getItem("doc-read-articles");
      if (storedRead) {
        setReadArticles(JSON.parse(storedRead));
      }
    } catch {}
  }, []);

  const clearProfile = useCallback(() => {
    try {
      localStorage.removeItem("doc-profile");
    } catch {}
  }, []);

  const setProfile = useCallback((_id: ProfileId) => {
    clearProfile();
  }, [clearProfile]);

  const markArticleRead = useCallback((category: string, slug: string) => {
    const key = `${category}/${slug}`;
    setReadArticles((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      try {
        localStorage.setItem("doc-read-articles", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Backward compat: keep the API, but do not expose profile-driven content.
  const profileId: ProfileId | null = null;
  const isAdvancedMode = false;
  const toggleMode = useCallback(() => {
    clearProfile();
  }, [clearProfile]);

  return (
    <DocumentationModeContext.Provider
      value={{
        isAdvancedMode,
        toggleMode,
        profileId,
        setProfile,
        clearProfile,
        readArticles,
        markArticleRead,
      }}
    >
      {children}
    </DocumentationModeContext.Provider>
  );
}

export function useDocumentationMode() {
  return useContext(DocumentationModeContext);
}
