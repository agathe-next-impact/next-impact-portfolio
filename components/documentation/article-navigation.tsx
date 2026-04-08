"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { JOURNEYS, PROFILES } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { cn } from "@/lib/utils";

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

  // If this article isn't in the journey, find the next unread article
  const nextStep =
    currentIndex >= 0 && currentIndex < journey.length - 1
      ? journey[currentIndex + 1]
      : journey.find((s) => !readArticles.includes(`${s.category}/${s.slug}`));

  if (!nextStep) return null;

  const Icon = profile.icon;

  return (
    <div className="mt-6">
      <Link
        href={`/documentation/${nextStep.category}/${nextStep.slug}`}
        className={cn(
          "group flex items-center gap-4 rounded-3xl p-5 border transition-all duration-300",
          "bg-gradient-to-r from-mediumblue/80 to-darkblue/60 backdrop-blur-sm",
          "border-lightblue/10 hover:border-lightblue/30 "
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            profile.gradient
          )}
        >
          <Icon className={cn("h-5 w-5", profile.accentColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 font-googletexte flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3 w-3" />
            Prochain dans votre parcours {profile.label}
          </p>
          <p className="text-sm font-medium text-white font-googletexte truncate group-hover:text-white/90">
            {nextStep.title}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-white/80 group-hover:text-white/80 group-hover:translate-x-1 transition-all shrink-0" />
      </Link>
    </div>
  );
}
