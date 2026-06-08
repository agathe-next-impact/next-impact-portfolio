"use client"

import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"
import type { ProjectItem } from "@/lib/data/headless-explainer"

interface ProjectGridProps {
  items: ProjectItem[]
}

// Statut → liseré accent + libellé. L'accent (bleu clair) structure les statuts
// positifs (plein vs atténué) ; « à éviter » reste neutre (mid-gray).
const statusConfigFr = {
  ideal: { label: "Ideal", className: "border-accent-secondary/50 text-accent-secondary" },
  evaluate: { label: "A evaluer", className: "border-accent-secondary/30 text-accent-secondary/70" },
  avoid: { label: "A eviter", className: "border-dark-gray text-mid-gray" },
} as const

const statusConfigEn = {
  ideal: { label: "Ideal", className: "border-accent-secondary/50 text-accent-secondary" },
  evaluate: { label: "Evaluate", className: "border-accent-secondary/30 text-accent-secondary/70" },
  avoid: { label: "Avoid", className: "border-dark-gray text-mid-gray" },
} as const

export default function ProjectGrid({ items }: ProjectGridProps) {
  const locale = useLocale() as Locale
  const statusConfig = locale === "en" ? statusConfigEn : statusConfigFr
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {items.map((item, i) => {
        const config = statusConfig[item.status]
        return (
          <div
            key={item.label}
            className={cn(
              "border-b border-dark-gray p-6 transition-colors hover:bg-jet",
              (i + 1) % 3 !== 0 && "md:border-r",
            )}
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h4 className="text-lg font-light tracking-tight text-foreground">{item.label}</h4>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
                  config.className,
                )}
              >
                {config.label}
              </span>
            </div>
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{item.description}</p>
          </div>
        )
      })}
    </div>
  )
}
