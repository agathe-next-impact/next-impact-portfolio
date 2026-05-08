"use client";

import Image from "next/image";
import { BrandLogo } from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowLeftRightIcon,
  ArrowRightLeftIcon,
  ArrowRightSquare,
  LucideArrowUpRight,
  PresentationIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import AiAuditBannerSVG from "./AiAuditBannerSVG";
import EligibilityForm from "@/components/tarifs/EligibilityForm";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getHeroVariants } from "@/lib/homepage-profiles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default function Hero() {
  const { profileId } = useDocumentationMode();
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const heroVariants = getHeroVariants(locale);
  const variant = profileId ? heroVariants[profileId] : heroVariants.default;

  return (
    <>
      <main className="h-full md:h-screen flex items-center relative overflow-hidden">

        <div className="container flex flex-col lg:flex-row justify-between lg:justify-evenly items-end gap-12 lg:gap-24 px-4 md:px-6 relative">
          {/* Text Content */}
          <div className="flex flex-col lg:col-span-7 bg-darkblue/60 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-2xl mt-4 md:mt-12 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={profileId || "default"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="mb-1 text-3xl lg:text-4xl text-white/80 font-googletexte">
                  {variant.headline}
                </h1>
                <p className="mt-2 text-4xl lg:text-5xl text-coral font-googletitre font-medium">
                  {variant.subHeadline}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-4">
              <BrandLogo
                src="/img/logo-wordpress-blanc.webp"
                srcLight="/img/logo-wordpress-small.webp"
                alt={t("wordpressLogoAlt")}
                width={45}
                height={60}
                priority
                fetchPriority="high"
              />
              <BrandLogo
                src="/img/logo-nextjs-blanc.webp"
                srcLight="/img/logo-nextjs.webp"
                alt={t("nextjsLogoAlt")}
                width={80}
                height={80}
                priority
                fetchPriority="high"
              />
              <BrandLogo
                src="/img/logo-astro-blanc.webp"
                srcLight="/img/logo-astro.webp"
                alt={t("astroLogoAlt")}
                width={90}
                height={80}
                className="mt-1.5"
                priority
                fetchPriority="high"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${profileId || "default"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="mt-10 md:mt-16 font-googletexte md:text-xl text-white/80 max-w-xl">
                  {variant.description}
                </p>

                <p className="mt-4 mb-4 font-googletexte italic text-white/70 text-base">
                  {variant.valueProposition}
                </p>
                <div className="flex flex-col sm:flex-row content-start justify-start gap-4">
                  <Button className="mx-0 inline-flex bg-orange py-2 px-8 rounded-2xl hover:scale-[1.02] transition-all duration-300 ease-in">
                    <Link
                      href={variant.ctaPrimary.href}
                      className="gap-2 text-darkblue font-googletitre font-semibold text-lg"
                    >
                      {variant.ctaPrimary.label}
                    </Link>
                    <LucideArrowUpRight className="w-8 h-8 text-darkblue" />
                  </Button>
                  <Button className="mx-0 inline-flex border border-white/30 bg-transparent py-2 px-8 rounded-2xl hover:bg-white/10 transition-all duration-300 ease-in">
                    <Link
                      href={variant.ctaSecondary.href}
                      className="gap-2 text-white font-googletitre font-semibold text-lg"
                    >
                      {variant.ctaSecondary.label}
                    </Link>
                    <LucideArrowUpRight className="w-8 h-8 text-white/70" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Hero Image */}
          <div className="relative lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden aspect-square max-w-md mx-auto">
              {/* Placeholder for profile image - replace with actual image */}
              <div className="bg-gradient-to-br from-brand-400/80 to-brand-600/80 w-full h-full flex items-center justify-center">
                <Image
                  src="/img/avatar.jpg"
                  alt={t("profileImageAlt")}
                  className="bg-white object-cover w-full h-full rounded-xl"
                  width={500}
                  height={500}
                  priority
                  fetchPriority="high"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>

              {/* Floating badges */}
              <div className="absolute left-6 top-6 bg-extralightblue py-2 px-4 rounded-full flex items-center gap-2 animate-float">
                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-black">
                  {t("available")}
                </span>
              </div>

              <div className="absolute right-4 bottom-12 bg-extralightblue py-2 px-4 rounded-full animate-float-delayed">
                <span className="text-sm font-medium text-black">
                  {t("experience")}
                </span>
              </div>

              <div className="absolute left-4 bottom-4 bg-lightyellow py-1.5 px-3 rounded-full animate-float hidden md:flex items-center gap-1.5">
                <span className="text-xs font-medium text-darkblue">
                  {t("tihMention")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Diagnostic de stack — formulaire interactif */}
      <section id="audit" className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 md:py-32 relative">

          <h2 className="font-googletitre text-white text-4xl md:text-5xl font-medium flex items-end justify-center px-4 gap-4 z-10 text-center">
            {variant.auditTitle}
          </h2>
        <div className="w-full max-w-full mx-auto xl:max-w-5xl flex flex-col relative px-4 md:px-20 md:mt-8 xl:mt-0 xl:px-0">
          <div className="text-left mt-1 xxl:mt-24 lg:pt-6 z-10">
            <h3 className="font-googletexte text-2xl lg:text-3xl">
              <span className="text-3xl md:text-4xl font-googletitre text-coral dark:text-lightyellow font-medium">
                {variant.auditSubtitle}
              </span>
              {" "}
              <span className="text-white/70">
               {t("auditTimer")}
              </span>
            </h3>
            <p className="text-white/70 text-lg md:text-xl mt-2 md:mb-8">
              {variant.auditDescription}
            </p>
          </div>
          <div style={{
          position: "absolute",
          top: 140,
          left: 0,
          width: "70vw",
          height: "100vh",
          zIndex: 0,
          overflow: "hidden",
          opacity: 0.4,
        }}
        className="md:top-[-120px]">
            <AiAuditBannerSVG />
          </div>
          <div className="w-full max-w-6xl mx-auto relative h-full overflow-hidden">
            <div className="relative z-10">
              <div className="relative md:max-w-5xl my-16 mx-0 md:mx-auto">
                <EligibilityForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
