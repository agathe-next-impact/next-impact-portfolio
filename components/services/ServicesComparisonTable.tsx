"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { cn } from "@/lib/utils";

export function ServicesComparisonTable() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);
  const labels = isEn
    ? { title: "Tier comparison", feature: "Feature", essential: "Classic", growth: "Headless", custom: "Web app" }
    : { title: "Comparatif des forfaits", feature: "Fonctionnalité", essential: "Classique", growth: "Headless", custom: "Web app" };

  const comparison = isEn
    ? [
        { feature: "Design", pack1: "Eco-designed", pack2: "Custom", pack3: "Fully bespoke" },
        { feature: "Pages included", pack1: "5 key pages", pack2: "Custom", pack3: "Unlimited" },
        { feature: "Speed < 1s", pack1: true, pack2: true, pack3: true },
        { feature: "Maximum security", pack1: true, pack2: true, pack3: true },
        { feature: "Advanced SEO strategy", pack1: false, pack2: true, pack3: true },
        { feature: "Data migration", pack1: false, pack2: true, pack3: true },
        { feature: "Multisite architecture", pack1: false, pack2: false, pack3: true },
        { feature: "Specific API integrations", pack1: false, pack2: false, pack3: true },
        { feature: "Support", pack1: "Training", pack2: "Strategic", pack3: "Priority" },
        { feature: "Maintenance", pack1: false, pack2: "3 months", pack3: "12 months" },
        { feature: "OETH attestation (TIH)", pack1: true, pack2: true, pack3: "Optimized for OETH deduction" },
      ]
    : [
        { feature: "Design", pack1: "Éco-conçu", pack2: "Personnalisé", pack3: "Sur-mesure total" },
        { feature: "Pages incluses", pack1: "5 pages clés", pack2: "Sur-mesure", pack3: "Illimité" },
        { feature: "Vitesse < 1s", pack1: true, pack2: true, pack3: true },
        { feature: "Sécurité maximale", pack1: true, pack2: true, pack3: true },
        { feature: "Stratégie SEO avancée", pack1: false, pack2: true, pack3: true },
        { feature: "Migration de données", pack1: false, pack2: true, pack3: true },
        { feature: "Architecture multisite", pack1: false, pack2: false, pack3: true },
        { feature: "Intégrations API spécifiques", pack1: false, pack2: false, pack3: true },
        { feature: "Accompagnement", pack1: "Formation", pack2: "Stratégique", pack3: "Prioritaire" },
        { feature: "Support", pack1: false, pack2: "3 mois", pack3: "12 mois" },
        { feature: "Attestation OETH (TIH)", pack1: true, pack2: true, pack3: "Optimisé pour la déduction OETH" },
      ];

  const renderCell = (val: boolean | string) =>
    val === true ? "✓" : val === false ? "—" : val;

  const cellBase = "border-r border-dark-gray px-5 py-3.5 text-center font-inter-tight text-[13px]";

  return (
    <BlueprintSection tone="obsidian">
      {/* Bouton accordéon — en-tête */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-6 py-8 text-left lg:px-8",
          open && "border-b border-dark-gray",
        )}
      >
        <div className="flex items-baseline gap-5">
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            № 03
          </span>
          <span className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
            {labels.title}
          </span>
        </div>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 text-mid-gray transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Corps du comparatif */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-out",
          open ? "max-h-[1400px]" : "max-h-0",
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-charcoal">
                <th className="border-r border-dark-gray px-5 py-3.5 text-left font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
                  {labels.feature}
                </th>
                {[labels.essential, labels.growth, labels.custom].map((col, i, arr) => (
                  <th
                    key={col}
                    className={cn(
                      "px-5 py-3.5 text-center font-mono text-[9px] uppercase tracking-[0.15em]",
                      i === 1 ? "text-accent-secondary" : "text-mid-gray",
                      i < arr.length - 1 && "border-r border-dark-gray",
                    )}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn("border-b border-dark-gray", idx % 2 === 1 && "bg-jet")}
                >
                  <td className="border-r border-dark-gray px-5 py-3.5 text-[13px] text-foreground">
                    {row.feature}
                  </td>
                  <td className={cn(cellBase, row.pack1 === false ? "text-mid-gray/60" : "text-mid-gray")}>
                    {renderCell(row.pack1)}
                  </td>
                  <td
                    className={cn(
                      cellBase,
                      "font-medium",
                      row.pack2 === false ? "text-mid-gray/60" : "text-foreground",
                    )}
                  >
                    {renderCell(row.pack2)}
                  </td>
                  <td
                    className={cn(
                      "px-5 py-3.5 text-center font-inter-tight text-[13px]",
                      row.pack3 === false ? "text-mid-gray/60" : "text-mid-gray",
                    )}
                  >
                    {renderCell(row.pack3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BlueprintSection>
  );
}
