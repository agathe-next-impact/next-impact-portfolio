import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export function LivreBlancBanner() {
  return (
    <Link
      href="/ressources/livre_blanc_wp_headless.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-orange/20 bg-gradient-to-r from-orange/10 via-mediumblue/40 to-darkblue/60 backdrop-blur-sm p-5 md:p-6 hover:border-orange/40 hover:shadow-[0_0_20px_rgba(242,159,5,0.3)] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange/10 group-hover:bg-orange/20 transition-colors">
          <FileText className="h-6 w-6 text-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-googletitre text-base font-medium text-white group-hover:text-white transition-colors">
            Livre blanc : Qu&apos;est-ce que WordPress Headless ?
          </p>
          <p className="text-sm text-white/50 font-googletexte mt-0.5">
            Le guide complet pour comprendre, évaluer et adopter l&apos;architecture headless.
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-orange shrink-0 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
