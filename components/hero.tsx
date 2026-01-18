import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="h-screen relative pt-12 pb-24 md:pt-24 md:pb-24 flex items-center overflow-hidden">

      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Text Content */}
        <div className="flex flex-col lg:col-span-7 gap-2 bg-rose-50/20 p-8 rounded-xl shadow-lg backdrop-blur-sm">
          <span className="w-max inline-flex items-center px-3 py-1 text-xs font-googletexte font-medium uppercase rounded-full bg-white text-mediumblue/60 tracking-wider">
            services et conseil
          </span>

          <h1 className="text-2xl md:text-4xl font-googletexte text-regularblue leading-tight tracking-tighter">
            Développeuse
            <div className="mt-2 font-googletitre md:text-5xl text-4xl text-coral font-medium">
              WordPress Headless
            </div>
          </h1>
          <div className="mt-4 flex gap-8">
            <Image
              src="/img/logo-wordpress-small.png"
              alt="Logo WordPress"
              width={36}
              height={36}
              className="object-contain"
            />
            <Image
              src="/img/logo-astro.png"
              alt="Logo Astro"
              width={100}
              height={48}
              className="object-contain"
            />
            <Image
              src="/img/logo-nextjs.png"
              alt="Logo Next.js"
              width={100}
              height={48}
              className="object-contain"
            />
          </div>

          <p className="mt-16 font-googletexte text-xl text-regularblue max-w-xl">
            Pour un WordPress ultra-rapide, moderne et flexible grâce au headless CMS.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-5">
            <Link href="/solutions" className="group">
              <Button
                size="lg"
                variant="outline"
                className="relative overflow-hidden rounded-full text-lg font-googletitre text-white/90 bg-regularblue border-blue-100/40 hover:bg-regularblue/90 hover:text-white/80"
              >
                Solutions
              </Button>
            </Link>
            <Link href="/demo" className="group">
              <Button
                size="lg"
                variant="outline"
                className="relative overflow-hidden rounded-full text-lg font-googletitre text-white/90 bg-coral border-blue-100/40 hover:bg-coral/90 hover:text-white/80"
              >
                Démo
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />

              </Button>
            </Link>
          </div>

        </div>

        {/* Hero Image */}
        <div className="relative lg:col-span-5">
          <div className="relative rounded-xl overflow-hidden aspect-square max-w-md mx-auto">
            {/* Placeholder for profile image - replace with actual image */}
            <div className="bg-gradient-to-br from-brand-400/80 to-brand-600/80 w-full h-full flex items-center justify-center">
              <Image
                src="/img/agathe.png" // Replace with your image path
                alt="Profile"
                className="bg-white object-cover w-full h-full rounded-xl"
                width={500} // Adjust width as needed
                height={500} // Adjust height as needed
              />
            </div>



            {/* Floating badges */}
            <div className="absolute left-6 top-6 bg-white py-2 px-4 rounded-full shadow-lg flex items-center gap-2 animate-float">
              <span className="h-3 w-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-black">Disponible</span>
            </div>

            <div className="absolute -right-3 bottom-1/4 bg-white py-2 px-4 rounded-full shadow-lg animate-float-delayed">
              <span className="text-sm font-medium text-black">
                8+ ans d'expérience
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
