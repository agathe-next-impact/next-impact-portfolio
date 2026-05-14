"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, X } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export function ServicesComparisonTable() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const labels = isEn
    ? {
        title: "Tier comparison",
        feature: "Feature",
        essential: "Classic",
        growth: "Headless",
        custom: "Web app",
      }
    : {
        title: "Comparatif des forfaits",
        feature: "Fonctionnalité",
        essential: "Classique",
        growth: "Headless",
        custom: "Web app",
      };

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

  return (
    <section className="py-0 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-white/80 text-center mb-10">
          {labels.title}
        </h2>

        {/* Table desktop */}
        <div className="hidden md:block">
          <Card className="overflow-hidden bg-mediumblue/60 backdrop-blur-xl border-[#719ED9]/30 ">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#719ED9]/30 bg-[#D0DCF2]/10">
                    <th className="text-left p-6 text-white font-semibold font-googletitre text-xl">
                      {labels.feature}
                    </th>
                    <th className="text-center p-6 text-coral font-semibold font-googletitre text-xl">
                      {labels.essential}
                    </th>
                    <th className="text-center p-6 text-lightyellow font-semibold font-googletitre text-xl">
                      {labels.growth}
                    </th>
                    <th className="text-center p-6 text-extralightblue font-semibold font-googletitre text-xl">
                      {labels.custom}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#719ED9]/20 hover:bg-[#D0DCF2]/10 transition-colors"
                    >
                      <td className="p-6 text-white/80 text-lg">{row.feature}</td>
                      <td className="p-6 text-center text-lg">
                        {typeof row.pack1 === "boolean" ? (
                          row.pack1 ? (
                            <CheckCircle2 className="h-5 w-5 text-coral mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-coral/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-white/80">{row.pack1}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.pack2 === "boolean" ? (
                          row.pack2 ? (
                            <CheckCircle2 className="h-5 w-5 text-lightyellow mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-lightyellow/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-white/80">
                            {row.pack2}
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.pack3 === "boolean" ? (
                          row.pack3 ? (
                            <CheckCircle2 className="h-5 w-5 text-extralightblue mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-extralightblue/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-white/80">
                            {row.pack3}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Mobile version: cartes empilées */}
        <div className="md:hidden space-y-8">
          {comparison.map((row, idx) => (
            <Card key={idx} className="p-6 bg-mediumblue/60 border-[#719ED9]/30 ">
              <div className="md:font-semibold text-white mb-2 text-2xl md:text-lg">{row.feature}</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-coral text-xl">{labels.essential}</span>
                  {typeof row.pack1 === "boolean" ? (
                    row.pack1 ? (
                      <CheckCircle2 className="h-5 w-5 text-coral" />
                    ) : (
                      <X className="h-5 w-5 text-coral/30" />
                    )
                  ) : (
                    <span className="text-white/80 text-lg">{row.pack1}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-lightyellow text-xl">{labels.growth}</span>
                  {typeof row.pack2 === "boolean" ? (
                    row.pack2 ? (
                      <CheckCircle2 className="h-5 w-5 text-lightyellow" />
                    ) : (
                      <X className="h-5 w-5 text-lightyellow/30" />
                    )
                  ) : (
                    <span className="text-white/80 font-medium text-lg">{row.pack2}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-extralightblue text-xl">{labels.custom}</span>
                  {typeof row.pack3 === "boolean" ? (
                    row.pack3 ? (
                      <CheckCircle2 className="h-5 w-5 text-extralightblue" />
                    ) : (
                      <X className="h-5 w-5 text-extralightblue/30" />
                    )
                  ) : (
                    <span className="text-white/80 font-medium text-lg">{row.pack3}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
