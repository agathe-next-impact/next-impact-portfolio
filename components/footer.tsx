import Link from "next/link"
import { CTASection } from "./cta-section"


export default function Footer() {
    return (
    <footer className="w-full bg-white/60 backdrop-blur-md border-t border-regularblue/20 md:py-0">
    <CTASection />
    <div className="mt-8 md:mt-0 pb-8 container flex flex-col md:items-center md:justify-between gap-4 md:h-24 md:flex-row">
      <p className="text-center text-sm leading-loose text-mediumblue md:text-left">
        2025
      </p>
      <nav className="flex gap-4 sm:gap-6 mr-24 text-center md:text-left">
        <Link
          href="/mentions-legales"
          className="text-mediumblue text-sm font-googletexte hover:underline underline-offset-4">
          Mentions légales
        </Link>
      </nav>
    </div>
  </footer>
    )
}