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

  const switchTo = (target: Locale) => {
    if (target === locale || pending) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error – next-intl typing for dynamic pathnames
        { pathname, params },
        { locale: target }
      );
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid var(--rule)",
        height: 28,
        overflow: "hidden",
      }}
    >
      {routing.locales.map((loc, index) => {
        const active = loc === locale;
        const targetLabel = loc === "fr" ? t("fr") : t("en");
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            disabled={pending || active}
            aria-pressed={active}
            aria-label={active ? undefined : t("switchTo", { target: targetLabel })}
            title={active ? undefined : t("switchTo", { target: targetLabel })}
            style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              height: "100%",
              padding: "0 9px",
              border: "none",
              borderLeft: index === 0 ? "none" : "1px solid var(--rule)",
              background: active ? "var(--ink)" : "transparent",
              color: active ? "var(--paper)" : "var(--muted-color)",
              cursor: active ? "default" : "pointer",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = "var(--muted-color)";
            }}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}

export const LOCALES = routing.locales;
