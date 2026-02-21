import Link from "next/link";
import Image from "next/image";
import { CTASection } from "./cta-section";

export default function Footer() {
  return (
    <footer className="w-full p-4 md:p-12 bg-mediumblue/10 backdrop-blur-sm border-t border-white/10 space-y-8">
      {/* CTA Section — 3 niveaux d'engagement */}
      <CTASection />

      {/* Footer info */}
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 py-8 border-t border-white/10">
        {/* Colonne 1 : Liens */}
        <div className="flex flex-col gap-3">
          <h3 className="font-googletitre text-white text-lg font-semibold mb-2">
            Liens utiles
          </h3>
          <nav className="flex flex-col gap-2">
            <Link href="/mentions-legales" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              Mentions légales
            </Link>
            <Link href="/a-propos" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              À propos
            </Link>
            <Link href="/services" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              Services
            </Link>
            <Link href="/etudes-de-cas" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              Études de cas
            </Link>
            <Link href="/documentation" className="text-white/70 hover:text-white transition text-sm font-googletexte">
              Documentation
            </Link>
          </nav>
        </div>

        {/* Colonne 2 : Logo certification */}
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src="/img/logo-activateurs.svg"
            alt="Certification"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="container border-t border-white/10 pt-4">
        <p className="text-center text-sm text-white/50 font-googletexte">
          © {new Date().getFullYear()} Next Impact Digital — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
