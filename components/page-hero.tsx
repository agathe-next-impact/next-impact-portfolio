import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface PageHeroProps {
  badge: string
  titre1: string
  titre2: string
  sousTitre: string
  cta1Text: string
  cta1Link: string
  cta2Text: string
  cta2Link: string
  illustration: string
}

export default function PageHero({
  badge,
  titre1,
  titre2,
  sousTitre,
  cta1Text,
  cta1Link,
  cta2Text,
  cta2Link,
  illustration,
}: PageHeroProps) {
  return (
    <section className="h-full grid grid-cols-1 md:grid-cols-2 items-end place-content-end gap-8 container mx-auto px-4 md:py-16 pt-16 text-center">
      <div className="flex flex-col items-start gap-6 mb-8 md:mb-12 bg-white/40 p-8 rounded-xl shadow-lg backdrop-blur-sm max-w-3xl animate-fadeInUp">
        <span className="w-max inline-flex items-center px-3 py-1 text-xs font-googletexte font-medium uppercase rounded-full bg-white text-mediumblue/60 tracking-wider">
          {badge}
        </span>
        <h1 className="text-4xl text-left md:text-5xl font-medium text-coral tracking-tight mb-6">
          {titre1} <div className="mt-2 text-regularblue text-2xl md:text-4xl">{titre2}</div>
        </h1>
        <p className="text-xl text-regularblue/80 text-left mb-8">
          {sousTitre}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
        {cta1Link && cta1Text && (
          <Link href={cta1Link}>
            <Button
              size="lg"
              className="gap-1 rounded-full text-lg font-googletitre text-white bg-regularblue/90 hover:bg-regularblue/80"
            >
              {cta1Text}
            </Button>
          </Link>
        )}

          {cta2Link && cta2Text && (
          <Link href={cta2Link} target="_blank">
            <Button
              size="lg"
              className="gap-1 rounded-full text-lg font-googletitre text-white bg-coral hover:bg-coral/90"
            >
              {cta2Text}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}

        </div>
      </div>
      <div className="mx-auto max-w-md md:max-w-none animate-fadeInUp">
        <img
          src={illustration}
          alt="Illustration Hero"
          className="h-[34vh] w-auto mx-auto bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg "
        />
      </div>
    </section>
  )
}
