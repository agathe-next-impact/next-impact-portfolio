import Link from "next/link";
import { Logos } from "./logos";
import { CTASection } from "./cta-section";


export default function Footer() {
    return (
    <footer className="w-full p-4 md:p-12 bg-mediumblue/10 backdrop-blur-sm border-t border-white/10 space-y-8">
    {/* CTA Section */}
        <CTASection />   
    
    <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
      <p className="text-center text-sm leading-loose text-white md:text-left">
        2025
      </p>
    </div>
  </footer>
    )
}