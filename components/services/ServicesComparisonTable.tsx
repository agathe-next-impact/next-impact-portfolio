import { Card } from "@/components/ui/card";
import { CheckCircle2, X } from "lucide-react";

export function ServicesComparisonTable() {
  const comparison = [
    {
      feature: "Autonomie Marketing",
      pack1: "Basique",
      pack2: "Avancée (Blocks)",
      pack3: "Totale",
    },
    { feature: "Vitesse < 1s", pack1: true, pack2: true, pack3: true },
    { feature: "Sécurité accrue", pack1: true, pack2: true, pack3: true },
    { feature: "Design flexible", pack1: true, pack2: true, pack3: true },
    { feature: "Interface utilisateur avancée - UI", pack1: false, pack2: true, pack3: true },
    { feature: "Expérience utilisateur optimale - UX", pack1: false, pack2: true, pack3: true },
    {
      feature: "Recherche Instantanée",
      pack1: false,
      pack2: true,
      pack3: true,
    },
    { feature: "Multi-sources API", pack1: false, pack2: false, pack3: true },
    {
      feature: "Support Prioritaire",
      pack1: false,
      pack2: "3 mois",
      pack3: "12 mois",
    },
  ];

  return (
    <section className="py-0 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-white/80 text-center mb-10">
          Comparatif des packs
        </h2>

        {/* Table desktop */}
        <div className="hidden md:block">
          <Card className="overflow-hidden bg-mediumblue/60 backdrop-blur-xl border-[#719ED9]/30 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#719ED9]/30 bg-[#D0DCF2]/10">
                    <th className="text-left p-6 text-white font-semibold font-googletitre text-xl">
                      Fonctionnalité
                    </th>
                    <th className="text-center p-6 text-lightyellow font-semibold font-googletitre text-xl">
                      Essentiel
                    </th>
                    <th className="text-center p-6 text-coral font-semibold font-googletitre text-xl">
                      Premium
                    </th>
                    <th className="text-center p-6 text-orange font-semibold font-googletitre text-xl">
                      Ultimate
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
                            <CheckCircle2 className="h-5 w-5 text-lightyellow mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-lightyellow/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-white/80">{row.pack1}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.pack2 === "boolean" ? (
                          row.pack2 ? (
                            <CheckCircle2 className="h-5 w-5 text-coral mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-coral/30 mx-auto" />
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
                            <CheckCircle2 className="h-5 w-5 text-orange mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-[#F29F05]/30 mx-auto" />
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
            <Card key={idx} className="p-6 bg-mediumblue/60 border-[#719ED9]/30 shadow-md">
              <div className="md:font-semibold text-white mb-2 text-2xl md:text-lg">{row.feature}</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-lightyellow text-xl">Essentiel</span>
                  {typeof row.pack1 === "boolean" ? (
                    row.pack1 ? (
                      <CheckCircle2 className="h-5 w-5 text-lightyellow" />
                    ) : (
                      <X className="h-5 w-5 text-lightyellow" />
                    )
                  ) : (
                    <span className="text-white/80 text-lg">{row.pack1}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-coral text-xl">Premium</span>
                  {typeof row.pack2 === "boolean" ? (
                    row.pack2 ? (
                      <CheckCircle2 className="h-5 w-5 text-coral" />
                    ) : (
                      <X className="h-5 w-5 text-coral/30" />
                    )
                  ) : (
                    <span className="text-white/80 font-medium text-lg">{row.pack2}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-orange text-xl">Ultimate</span>
                  {typeof row.pack3 === "boolean" ? (
                    row.pack3 ? (
                      <CheckCircle2 className="h-5 w-5 text-orange" />
                    ) : (
                      <X className="h-5 w-5 text-[#F29F05]/30" />
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
