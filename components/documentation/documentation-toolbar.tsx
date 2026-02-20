"use client";

import { Search } from "lucide-react";

export function DocumentationToolbar() {
  const handleSearchClick = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  return (
    <div className="sticky top-16 z-40 border-b backdrop-blur-md bg-mediumblue/60 border-lightblue/10">
      <div className="container flex items-center justify-end px-4 py-2.5">
        {/* Cmd+K search trigger */}
        <button
          onClick={handleSearchClick}
          className="flex items-center gap-2 rounded-full bg-mediumblue/60 backdrop-blur-sm border border-lightblue/25 px-4 py-1.5 text-sm text-white hover:text-white hover:border-lightblue/40 transition-all duration-300"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline font-googletexte text-inherit">
            Rechercher...
          </span>
          <kbd className="ml-1 rounded-md bg-white/10 px-1.5 py-0.5 text-xs font-mono text-white/80">
            ⌘K
          </kbd>
        </button>
      </div>
    </div>
  );
}
