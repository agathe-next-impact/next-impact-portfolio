"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { JOURNEYS, PROFILES } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { Reveal } from "@/components/ui/reveal";

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
    <Reveal>
      <Link
        href={`/documentation/${nextStep.category}/${nextStep.slug}` as never}
        className="group flex items-center gap-4 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-transparent p-5 px-6 no-underline transition-colors hover:bg-jet/40"
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-dark-gray bg-obsidian">
          <Icon className="h-4 w-4 text-accent-secondary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-mid-gray">
            Prochain dans votre parcours {profile.label}
          </p>
          <p className="truncate text-sm font-light tracking-tight text-foreground transition-colors group-hover:text-accent-secondary">
            {nextStep.title}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-mid-gray transition-transform group-hover:translate-x-0.5 group-hover:text-accent-secondary" />
      </Link>
    </Reveal>
  );
}
