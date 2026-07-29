"use client";

import { Info } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

/**
 * Banner shown above a localized page when its content is not yet translated
 * to the requested locale and is being served from the default-locale fallback.
 */
export function TranslationFallbackBanner({ show }: { show?: boolean }) {
  const locale = useLocale() as Locale;
  if (!show || locale === "fr") return null;

  return (
    <div className="container px-4 md:px-6 mt-4">
      <div className="rounded-xl border border-lightyellow/30 bg-lightyellow/5 p-4 flex items-start gap-3 max-w-3xl">
        <Info className="size-5 text-lightyellow shrink-0 mt-0.5" />
        <p className="text-sm text-white/80 font-googletexte leading-relaxed">
          <strong className="text-lightyellow">Translation in progress.</strong>{" "}
          The English version of this article isn't ready yet — the original
          French text is shown below. We're working on translating the rest of
          the content.
        </p>
      </div>
    </div>
  );
}
