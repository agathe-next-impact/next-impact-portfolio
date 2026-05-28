"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { JOURNEYS, PROFILES } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";

interface ArticleNavigationProps {
  category: string;
  slug: string;
}

export function ArticleNavigation({ category, slug }: ArticleNavigationProps) {
  const { profileId, readArticles } = useDocumentationMode();

  if (!profileId) return null;

  const journey = JOURNEYS[profileId];
  const profile = PROFILES[profileId];
  const currentKey = `${category}/${slug}`;
  const currentIndex = journey.findIndex(
    (s) => `${s.category}/${s.slug}` === currentKey
  );

  const nextStep =
    currentIndex >= 0 && currentIndex < journey.length - 1
      ? journey[currentIndex + 1]
      : journey.find((s) => !readArticles.includes(`${s.category}/${s.slug}`));

  if (!nextStep) return null;

  const Icon = profile.icon;

  return (
    <div>
      <Link
        href={`/documentation/${nextStep.category}/${nextStep.slug}` as never}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem 1.5rem",
          border: "1px solid var(--rule)",
          borderLeft: "3px solid var(--accent-color)",
          background: "var(--paper-2)",
          textDecoration: "none",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2rem",
          height: "2rem",
          border: "1px solid var(--rule)",
          background: "var(--paper)",
          flexShrink: 0,
        }}>
          <Icon style={{ width: "1rem", height: "1rem", color: "var(--accent-color)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="annot" style={{
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.25rem",
          }}>
            Prochain dans votre parcours {profile.label}
          </p>
          <p style={{
            fontSize: "0.875rem",
            color: "var(--ink)",
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {nextStep.title}
          </p>
        </div>
        <ArrowRight style={{ width: "1rem", height: "1rem", color: "var(--muted-color)", flexShrink: 0 }} />
      </Link>
    </div>
  );
}
