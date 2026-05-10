"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className = "" }: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("localeSwitcher");
  const [pending, startTransition] = React.useTransition();

  const otherLocale: Locale = locale === "fr" ? "en" : "fr";
  const targetLabel = otherLocale === "fr" ? t("fr") : t("en");

  const handleClick = () => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error – next-intl typing for dynamic pathnames
        { pathname, params },
        { locale: otherLocale }
      );
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={t("switchTo", { target: targetLabel })}
      title={t("switchTo", { target: targetLabel })}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-white/20 px-2 text-xs font-semibold uppercase tracking-wider text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-regularblue disabled:opacity-60 ${className}`}
    >
      {otherLocale}
    </button>
  );
}

export const LOCALES = routing.locales;
