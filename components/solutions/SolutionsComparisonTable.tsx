import { Card } from "@/components/ui/card";
import { CheckCircle2, X } from "lucide-react";

export function SolutionsComparisonTable() {
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
    <section className="bg-white/50 backdrop-blur-lg py-20 md:py-28 border-b border-1 border-lightblue/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-regularblue text-center mb-10">
          Comparatif des Packs
        </h2>

        {/* Table desktop */}
        <div className="hidden md:block">
          <Card className="overflow-hidden bg-white border-[#719ED9]/30 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#719ED9]/30 bg-[#D0DCF2]/30">
                    <th className="text-left p-6 text-mediumblue font-semibold font-googletitre text-lg">
                      Fonctionnalité
                    </th>
                    <th className="text-center p-6 text-regularblue font-semibold font-googletitre text-lg">
                      Essentiel
                    </th>
                    <th className="text-center p-6 text-coral font-semibold font-googletitre text-lg">
                      Premium
                    </th>
                    <th className="text-center p-6 text-orange font-semibold font-googletitre text-lg">
                      Ultimate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#719ED9]/20 hover:bg-[#D0DCF2]/20 transition-colors"
                    >
                      <td className="p-6 text-[#021373]">{row.feature}</td>
                      <td className="p-6 text-center">
                        {typeof row.pack1 === "boolean" ? (
                          row.pack1 ? (
                            <CheckCircle2 className="h-5 w-5 text-[#719ED9] mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-[#719ED9]/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-[#021373]">{row.pack1}</span>
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
                          <span className="text-[#021373] font-semibold">
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
                          <span className="text-[#021373] font-semibold">
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
            <Card key={idx} className="p-6 bg-white border-[#719ED9]/30 shadow-md">
              <div className="font-semibold text-regularblue mb-2 text-lg">{row.feature}</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-regularblue">Essentiel</span>
                  {typeof row.pack1 === "boolean" ? (
                    row.pack1 ? (
                      <CheckCircle2 className="h-5 w-5 text-[#719ED9]" />
                    ) : (
                      <X className="h-5 w-5 text-[#719ED9]/30" />
                    )
                  ) : (
                    <span className="text-[#021373]">{row.pack1}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-coral">Premium</span>
                  {typeof row.pack2 === "boolean" ? (
                    row.pack2 ? (
                      <CheckCircle2 className="h-5 w-5 text-coral" />
                    ) : (
                      <X className="h-5 w-5 text-coral/30" />
                    )
                  ) : (
                    <span className="text-[#021373] font-semibold">{row.pack2}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-googletitre text-orange">Ultimate</span>
                  {typeof row.pack3 === "boolean" ? (
                    row.pack3 ? (
                      <CheckCircle2 className="h-5 w-5 text-orange" />
                    ) : (
                      <X className="h-5 w-5 text-[#F29F05]/30" />
                    )
                  ) : (
                    <span className="text-[#021373] font-semibold">{row.pack3}</span>
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
