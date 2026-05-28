"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PROFILES, type ProfileId } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";

const profileOrder: ProfileId[] = ["decideur", "utilisateur", "developpeur"];

export function HomepageProfileBanner() {
  const { profileId, setProfile } = useDocumentationMode();
  const t = useTranslations("profileSwitcher");
  const [hoveredId, setHoveredId] = useState<ProfileId | null>(null);

  return (
    <div
      style={{
        maxHeight: profileId ? 0 : "220px",
        opacity: profileId ? 0 : 1,
        overflow: "hidden",
        transition: "max-height 0.25s ease, opacity 0.18s ease",
        background: "var(--paper-2)",
        borderBottom: "1px solid var(--rule)",
      }}
      aria-hidden={!!profileId}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          minHeight: "48px",
          paddingTop: 8,
          paddingBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-color)",
            whiteSpace: "nowrap",
          }}
        >
          {t("customizeExperience")}
        </span>

        <div style={{ display: "flex", gap: "1px", flexWrap: "wrap" }}>
          {profileOrder.map((id) => {
            const profile = PROFILES[id];
            const Icon = profile.icon;
            const isHovered = hoveredId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setProfile(id)}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isHovered ? "var(--ink)" : "var(--ink-2)",
                  background: isHovered ? "var(--paper)" : "transparent",
                  border: "1px solid var(--rule)",
                  padding: "5px 14px",
                  cursor: "pointer",
                  transition: "color 0.15s, background 0.15s",
                }}
              >
                <Icon size={12} strokeWidth={1.5} />
                {t(`${id}.label`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
