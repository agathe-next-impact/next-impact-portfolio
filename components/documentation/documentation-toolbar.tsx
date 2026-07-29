"use client";

import { Search } from "lucide-react";

export function DocumentationToolbar() {
  const handleSearchClick = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  return (
    <div style={{
      position: "sticky",
      top: "4rem",
      zIndex: 40,
      borderBottom: "1px solid var(--rule)",
      background: "var(--paper)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0.5rem 0" }}>
        <button
          onClick={handleSearchClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1px solid var(--rule)",
            background: "var(--paper)",
            padding: "0.375rem 0.875rem",
            fontSize: "0.8125rem",
            color: "var(--muted-color)",
            cursor: "pointer",
            transition: "color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--ink)";
            e.currentTarget.style.background = "var(--paper-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted-color)";
            e.currentTarget.style.background = "var(--paper)";
          }}
        >
          <Search style={{ width: "0.875rem", height: "0.875rem" }} />
          <span>Rechercher...</span>
          <kbd style={{
            marginLeft: "0.25rem",
            border: "1px solid var(--rule)",
            padding: "0.125rem 0.375rem",
            fontSize: "0.625rem",
            fontFamily: "var(--font-mono)",
            color: "var(--muted-color)",
            background: "var(--paper-2)",
          }}>
            ⌘K
          </kbd>
        </button>
      </div>
    </div>
  );
}
