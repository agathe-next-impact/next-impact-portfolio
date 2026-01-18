import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="w-full pt-12 md:pt-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-medium tracking-tighter text-regularblue md:text-4xl/tight">
                  Prêt à transformer votre présence en ligne ?
                </h2>
                <p className="mx-auto max-w-[700px] text-lg text-regularblue/70">
                  Réservez une consultation gratuite de 15 minutes pour discuter de votre projet et découvrir comment
                  nous pouvons vous aider.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="gap-1 text-lg font-medium rounded-full text-white bg-regularblue hover:bg-regularblue/90 hover:text-white transition-all duration-300"
                  asChild
                >
                  <a href="https://calendar.app.google/HuwRpoVGoKBj2PkX8" target="_blank" rel="noopener noreferrer">
                    RDV en visio <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-1 text-lg font-medium rounded-full bg-coral text-white hover:bg-coral/90 hover:text-white transition-all duration-300"
                  asChild
                >
                  <a href="mailto:agathe@next-impact.digital" target="_blank" rel="noopener noreferrer">
                    Mail <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        );
};
