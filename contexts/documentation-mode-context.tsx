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
  const [profileId, setProfileId] = useState<ProfileId | null>(null);
  const [readArticles, setReadArticles] = useState<string[]>([]);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("doc-profile");
      if (stored === "decideur" || stored === "utilisateur" || stored === "developpeur") {
        setProfileId(stored);
      }
      const storedRead = localStorage.getItem("doc-read-articles");
      if (storedRead) {
        setReadArticles(JSON.parse(storedRead));
      }
    } catch {}
  }, []);

  const setProfile = useCallback((id: ProfileId) => {
    setProfileId(id);
    try {
      localStorage.setItem("doc-profile", id);
    } catch {}
  }, []);

  const clearProfile = useCallback(() => {
    setProfileId(null);
    try {
      localStorage.removeItem("doc-profile");
    } catch {}
  }, []);

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

  // Backward compat: developpeur profile → advanced mode
  const isAdvancedMode = profileId === "developpeur";
  const toggleMode = useCallback(() => {
    if (profileId === "developpeur") {
      clearProfile();
    } else {
      setProfile("developpeur");
    }
  }, [profileId, clearProfile, setProfile]);

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
