import React from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SolutionsOffers({ offers }: { offers: any[] }) {
  return (
    <section id="offres">
      <div className="mx-auto max-w-7xl py-14 px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-primary/10">
              <CardHeader>
                <div className="relative w-12 h-12 mb-4">
                  <Image 
                    src={offer.icon} 
                    alt={offer.title} 
                    fill
                    className="object-contain"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-primary">{offer.title}</CardTitle>
              </CardHeader>
              <CardDescription className="text-2xl font-googletitre font-semibold text-lightyellow">{offer.name}</CardDescription>
              <CardContent>
                <p className="text-2xl md:text-lg text-white">{offer.tech}</p>
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
              </CardContent>
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
