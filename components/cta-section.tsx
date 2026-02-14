import { Button } from "./ui/button";
import { LucideArrowUpRight } from "lucide-react";
export function CTASection() {
  return (
    <section className="relative w-full py-8 md:py-16">
      <div className="container relative z-10 flex flex-col items-center justify-center px-0 md:px-6">
        <div className="border border-white/20 rounded-2xl shadow-lg p-8 md:p-12 max-w-2xl w-full flex flex-col items-center bg-mediumblue text-center gap-6">
          <h2 className="text-4xl md:text-5xl font-googletitre font-medium text-white tracking-tight mb-2">
            Prêt à transformer votre présence en ligne ?
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-4 font-googletexte">
            Réservez une consultation gratuite de 15 minutes pour discuter de votre projet et découvrir comment je peux vous aider.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-2">
            <Button className="inline-flex bg-coral py-2 px-8 rounded-2xl shadow-lg hover:bg-coral/80 transition duration-300 ease-in font-googletitre text-white text-lg font-semibold w-full sm:w-auto" asChild>
              <a href="mailto:agathe@next-impact.digital">
                Envoyer un mail <LucideArrowUpRight className="ml-2 h-5 w-5 text-white" />
              </a>
            </Button>
            <Button className="inline-flex bg-lightyellow py-2 px-8 rounded-2xl shadow-lg hover:bg-lightyellow/80 transition duration-300 ease-in font-googletitre text-darkblue text-lg font-semibold w-full sm:w-auto" asChild>
              <a href="https://calendar.app.google/RwZqaabSR5aDMnk46" target="_blank">
                Prendre rdv <LucideArrowUpRight className="ml-2 h-5 w-5 text-darkblue" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
