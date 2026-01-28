import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SolutionsOffers({ offers }: { offers: any[] }) {
  return (
    <section id="offres">
      <div className="mx-auto max-w-7xl py-14 px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, idx) => (
            <Card
              key={idx}
              className={`relative p-4 md:p-8 bg-mediumblue rounded-2xl border-[1px] shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                offer.recommended
                  ? "border-orange/70"
                  : "border-lightblue/30 hover:border-regularblue/50"
              }`}
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {offer.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange text-white font-m px-4 py-1 rounded-full text-sm shadow-md">
                  Recommandé
                </div>
              )}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${offer.color}20` }}
                >
                  <img src={offer.icon || "/placeholder.svg"} alt={offer.name} className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-googletitre font-semibold text-lightyellow">{offer.name}</h3>
                  <p className="text-2xl md:text-lg text-white">{offer.tech}</p>
                </div>
              </div>
              <p className={`text-xl mb-6 ${
                  offer.recommended
                    ? "text-lightyellow hover:text-lightyellow/90"
                    : "text-amber-300 hover:text-amber-300/90"
                }`}
              >{offer.concept}</p>
              <ul className="space-y-3 mb-8">
                {offer.features.map((feature: string, fidx: number) => (
                  <li key={fidx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: offer.color }} />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full h-12 font-medium font-googletitre text-base rounded-full shadow ${
                  offer.recommended
                    ? "bg-lightyellow hover:bg-lightyellow/90 text-darkblue"
                    : "bg-orange hover:bg-orange/90 text-darkblue"
                }`}
              >
                <Link href="/simulateur-tarif-wordpress-headless" className="flex items-center justify-center w-full font-medium text-xl text-darkblue hover:text-darkblue/90">
                Simuler mon tarif
                <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
