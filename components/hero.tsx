import Image from "next/image";
import { useScroll } from "framer-motion";
import ClientGeminiBlock from "./client-gemini-block";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowLeftRightIcon,
  ArrowRightLeftIcon,
  ArrowRightSquare,
  LucideArrowUpRight,
  PresentationIcon,
} from "lucide-react";
import DataFlowAnimatedSVG from "./DataFlowAnimatedSVG";
import AiAuditBannerSVG from "./AiAuditBannerSVG";
import GeminiSearchHomepage from "./gemini/gemini-search-homepage";

export default function Hero() {
  const { scrollY } = useScroll();

  return (
    <>
      <section className="h-screen flex items-center relative overflow-hidden">

        <div className="container flex flex-col lg:flex-row justify-between lg:justify-evenly items-end gap-12 lg:gap-24 px-4 md:px-6 relative">
          {/* Text Content */}
          <div className="flex flex-col lg:col-span-7 bg-white/10 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-2xl mt-12 lg:mt-0">
            <div className="mb-1 text-2xl md:text-3xl lg:text-4xl text-white/80 font-googletexte">
              Développeuse 
            </div>
            <div className="mt-2 text-3xl md:text-4xl lg:text-5xl text-lightyellow font-googletitre font-medium">
              WordPress Headless
            </div>            
            <div className="mt-5 flex items-center justify-start gap-4">
              <Image
                src="/img/logo-wordpress-blanc.png"
                alt="Logo WordPress"
                width={45}
                height={60}
              />
              <Image
                src="/img/logo-nextjs-blanc.png"
                alt="Logo Next.js"
                width={80}
                height={80}
              />
              <Image
                src="/img/logo-astro-blanc.png"
                alt="Logo Astro"
                width={90}
                height={80}
                className="mt-1.5"
              />
            </div>
            <p className="mt-16 font-googletexte md:text-xl text-white/80 max-w-xl">
              Pour un WordPress ultra-rapide, moderne et flexible grâce au
              headless CMS.
            </p>


            <p className="mt-4 mb-4 font-googletitre font-semibold text-white text-lg">Prêt à passer en headless ?</p>
            <div className="flex flex-col sm:flex-row content-start justify-start gap-4">
              <Button className="mx-0 inline-flex bg-lightyellow py-1 px-6 rounded-2xl shadow-lg hover:bg-lightyellow/80 transition duration-300 ease-in">
                <Link
                  href="/demo"
                  className="gap-2 text-darkblue font-googletitre font-semibold text-lg"
                >
                  Démo
                </Link>
                <LucideArrowUpRight className="w-8 h-8 text-darkblue" />
              </Button>
              <Button className="mx-0 inline-flex bg-coral py-1 px-6 rounded-2xl shadow-lg hover:bg-coral/80 transition duration-300 ease-in">
                <Link
                  href="#audit"
                  className="gap-2 text-darkblue font-googletitre font-semibold text-lg"
                >
                  Tester votre site 
                </Link>
                <LucideArrowUpRight className="w-8 h-8 text-darkblue" />
              </Button>
            </div>


          </div>

          {/* Hero Image */}
          <div className="relative lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden aspect-square max-w-md mx-auto">
              {/* Placeholder for profile image - replace with actual image */}
              <div className="bg-gradient-to-br from-brand-400/80 to-brand-600/80 w-full h-full flex items-center justify-center">
                <Image
                  src="/img/avatar.png" // Replace with your image path
                  alt="Profile"
                  className="bg-white object-cover w-full h-full rounded-xl"
                  width={500} // Adjust width as needed
                  height={500} // Adjust height as needed
                />
              </div>

              {/* Floating badges */}
              <div className="absolute left-6 top-6 bg-extralightblue py-2 px-4 rounded-full shadow-lg flex items-center gap-2 animate-float">
                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-black">
                  Disponible
                </span>
              </div>

              <div className="absolute right-4 bottom-12 bg-extralightblue py-2 px-4 rounded-full shadow-lg animate-float-delayed">
                <span className="text-sm font-medium text-black">
                  8+ ans d'expérience
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Gemini Search Section */}
      <section id="audit" className="bg-white/5 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 py-32 relative">

          <h2 className="font-googletitre text-white text-5xl font-medium flex items-end justify-center gap-4">
            Faut-il migrer en headless ?
          </h2>
        <div className="max-w-3xl xxl:max-w-4xl flex flex-col relative md:pl-48 xxl:pl-72 mt-8 xxl:mt-0">
          <div className="text-left font-googletexte text-2xl lg:text-3xl text-darkblue font-regular mt-1 xxl:mt-24 lg:pt-6 z-10">
            <span className="text-5xl font-googletitre text-lightyellow font-medium">
              Audit gratuit 
            </span>
            {" "}
            <span className="text-white/70">
             en 10 secondes
            </span>
            <p className="text-white/70 text-xl mt-2 mb-8">
              Analysez votre site WordPress et recevez un rapport complet avec des recommandations personnalisées pour une migration en headless CMS.
            </p>
          </div>
          <div style={{
          position: "absolute",
          top: -120,
          left: 0,
          width: "90vw",
          height: "100vh",
          zIndex: 0,
          overflow: "hidden"
        }}>
            <AiAuditBannerSVG />
          </div>
          <div className="max-w-2xl relative h-full overflow-hidden">
            <div className="relative z-10">
              <GeminiSearchHomepage />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
