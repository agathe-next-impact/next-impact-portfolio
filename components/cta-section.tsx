"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import type { ProfileId } from "@/lib/documentation-profiles";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  TrendingUp,
  PiggyBank,
  Search,
  ClipboardCheck,
  Calculator,
  BarChart3,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  CircleDot,
  Award,
  Clock,
  BadgePercent,
} from "lucide-react";
import { Button } from "./ui/button";
import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* ─────────────────────────────────────────────
   1. CTA Lead Magnet — AI Audit
   ───────────────────────────────────────────── */
function CTALeadMagnet() {
  const t = useTranslations("ctaSection.audit");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="border border-lightblue/20 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-darkblue/60 to-mediumblue/40 backdrop-blur-xl h-full flex flex-col">
        <motion.div custom={0} variants={fadeUp} className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lightyellow/10 border border-lightyellow/20 text-lightyellow text-xs font-googletexte">
            <Search className="w-3.5 h-3.5" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="text-sm md:text-base text-white/70 font-googletexte text-center mx-auto mb-5 leading-relaxed"
        >
          {t("subtitleStart")}{" "}
          <span className="text-lightyellow font-semibold">
            {t("subtitleHighlight")}
          </span>{" "}
          {t("subtitleEnd")}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {[
            { icon: Zap, label: t("pillPerformance"), color: "text-coral" },
            { icon: TrendingUp, label: t("pillRoi"), color: "text-lightyellow" },
            { icon: PiggyBank, label: t("pillCost"), color: "text-lightblue" },
          ].map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-googletexte"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div custom={4} variants={fadeUp} className="flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-transparent border-2 border-lightyellow/60 text-lightyellow py-2.5 px-6 rounded-full hover:bg-lightyellow/10 hover:border-lightyellow transition-all duration-300 font-googletitre text-sm md:text-base font-semibold"
            asChild
          >
            <Link href="/audit-site-ia">
              {t("ctaLabel")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            {t("footer")}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2. CTA Conversion
   ───────────────────────────────────────────── */
function CTAConversion() {
  const t = useTranslations("ctaSection.conversion");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="relative overflow-hidden border-2 border-coral/30 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-mediumblue to-regularblue/40 h-full flex flex-col">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-lightyellow/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div custom={0} variants={fadeUp} className="relative z-10 flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/20 text-coral text-xs font-googletexte">
            <ClipboardCheck className="w-3.5 h-3.5" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          {t("promiseStart")}{" "}
          <span className="text-white font-semibold">
            {t("promiseHighlight")}
          </span>
          {t("promiseEnd")}
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          {t("secondary")}
        </motion.p>

        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-coral text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <Link href="/services/eligibilite">
              {t("ctaLabel")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            {t("footer")}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2b. CTA ROI Simulator
   ───────────────────────────────────────────── */
function CTASimulateurROI() {
  const t = useTranslations("ctaSection.roi");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="relative overflow-hidden border-2 border-lightyellow/30 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-mediumblue to-darkblue/60 h-full flex flex-col">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-lightyellow/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div custom={0} variants={fadeUp} className="relative z-10 flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lightyellow/10 border border-lightyellow/20 text-lightyellow text-xs font-googletexte">
            <Calculator className="w-3.5 h-3.5" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          {t("promiseStart")}{" "}
          <span className="text-lightyellow font-semibold">
            {t("promiseHighlight")}
          </span>{" "}
          {t("promiseEnd")}
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          {t("secondary")}
        </motion.p>

        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-lightyellow text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <Link href="/outils/simulateur-roi">
              {t("ctaLabel")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            {t("footer")}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2c. CTA Benchmarking
   ───────────────────────────────────────────── */
function CTABenchmarking() {
  const t = useTranslations("ctaSection.benchmarking");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="relative overflow-hidden border-2 border-lightblue/30 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-mediumblue to-darkblue/60 h-full flex flex-col">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-lightblue/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div custom={0} variants={fadeUp} className="relative z-10 flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lightblue/10 border border-lightblue/20 text-lightblue text-xs font-googletexte">
            <BarChart3 className="w-3.5 h-3.5" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          {t("promiseStart")}{" "}
          <span className="text-lightblue font-semibold">
            {t("promiseHighlight")}
          </span>{" "}
          {t("promiseEnd")}
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          {t("secondary")}
        </motion.p>

        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-lightblue text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <Link href="/outils/benchmarking">
              {t("ctaLabel")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            {t("footer")}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2d. CTA White Paper
   ───────────────────────────────────────────── */
function CTALivreBlanc() {
  const t = useTranslations("ctaSection.livreBlanc");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="relative overflow-hidden border-2 border-orange/30 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-mediumblue to-darkblue/60 h-full flex flex-col">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div custom={0} variants={fadeUp} className="relative z-10 flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-googletexte">
            <FileText className="w-3.5 h-3.5" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          {t("promiseStart")}{" "}
          <span className="text-orange font-semibold">
            {t("promiseHighlight")}
          </span>{" "}
          {t("promiseEnd")}
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          {t("secondary")}
        </motion.p>

        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-orange text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <a href="/ressources/livre_blanc_wp_headless.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
              {t("ctaLabel")}
            </a>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            {t("footer")}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   3. Reassurance block — direct contact
   ───────────────────────────────────────────── */
export function BlocReassurance() {
  const t = useTranslations("ctaSection.reassurance");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="w-full rounded-3xl p-8 md:p-12 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-sm">
        <motion.div custom={0} variants={fadeUp} className="text-center mb-8">
          <p className="text-white/50 font-googletexte uppercase tracking-widest text-sm mb-3">
            {t("directContact")}
          </p>
          <h3 className="text-2xl md:text-3xl font-googletitre font-medium text-white mb-2">
            {t("title")}
          </h3>
          <p className="text-white/60 font-googletexte max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          custom={1}
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-googletexte">
            <CircleDot className="w-3.5 h-3.5" />
            {t("available")}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-googletexte">
            <Clock className="w-3.5 h-3.5 text-lightyellow" />
            {t("experience")}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-googletexte">
            <Award className="w-3.5 h-3.5 text-coral" />
            {t("wpHeadlessDev")}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lightyellow/10 border border-lightyellow/20 text-lightyellow text-sm font-googletexte">
            <BadgePercent className="w-3.5 h-3.5" />
            {t("tih")}
          </span>
        </motion.div>

        <motion.div
          custom={2}
          variants={fadeUp}
          className="bg-darkblue/40 rounded-2xl p-6 md:p-8 border border-white/5"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            <div className="flex-1 space-y-1">
              <p className="font-googletitre font-semibold text-white text-lg">
                {t("company")}
              </p>
              <p className="text-white/70 font-googletexte text-sm">
                {t("owner")}
              </p>
              <div className="flex items-start gap-2 text-white/50 font-googletexte text-sm pt-1">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-white/80">{t("address")}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:agathe@next-impact.digital"
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <Mail className="w-4 h-4 text-coral shrink-0" />
                <span className="text-white/90 font-googletexte text-sm group-hover:text-white transition-colors">
                  agathe@next-impact.digital
                </span>
              </a>
              <a
                href="tel:0673981638"
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <Phone className="w-4 h-4 text-lightyellow shrink-0" />
                <span className="text-white/90 font-googletexte text-sm group-hover:text-white transition-colors">
                  06 73 98 16 38
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Card selection per profile / context
   ───────────────────────────────────────────── */
type CardId = "audit" | "conversion" | "roi" | "benchmarking" | "livre-blanc";

const CARD_COMPONENTS: Record<CardId, React.FC> = {
  audit: CTALeadMagnet,
  conversion: CTAConversion,
  roi: CTASimulateurROI,
  benchmarking: CTABenchmarking,
  "livre-blanc": CTALivreBlanc,
};

const CARD_PAGES: Record<CardId, string[]> = {
  audit: ["/audit-site-ia", "/cms-headless"],
  conversion: ["/contact"],
  roi: ["/outils/simulateur-roi", "/simulateur-tarifs"],
  benchmarking: ["/outils/benchmarking"],
  "livre-blanc": ["/documentation"],
};

const PROFILE_CARDS: Record<ProfileId | "default", CardId[]> = {
  decideur:     ["livre-blanc", "roi", "conversion", "benchmarking", "audit"],
  utilisateur:  ["benchmarking", "conversion", "livre-blanc", "roi", "audit"],
  developpeur:  ["benchmarking", "roi", "conversion", "audit", "livre-blanc"],
  default:      ["conversion", "livre-blanc", "roi", "benchmarking", "audit"],
};

const TOOL_CARDS: CardId[] = ["audit", "roi", "benchmarking"];

const TOOL_PAGE_PREFIXES = [
  "/outils",
  "/audit-site-ia",
  "/simulateur-tarifs",
  "/cms-headless",
];

function isToolPage(pathname: string) {
  return TOOL_PAGE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function useSelectedCards(): [React.FC, React.FC] {
  const pathname = usePathname();
  const { profileId } = useDocumentationMode();

  const pool = isToolPage(pathname) ? TOOL_CARDS : PROFILE_CARDS[profileId ?? "default"];

  const available = pool.filter((id) =>
    !CARD_PAGES[id].some((p) => pathname === p || pathname.startsWith(p + "/"))
  );

  const first = available[0] ?? "roi";
  const second = available[1] ?? "audit";

  return [CARD_COMPONENTS[first], CARD_COMPONENTS[second]];
}

/* ─────────────────────────────────────────────
   Export — full 3-tier structure
   ───────────────────────────────────────────── */
export function CTASection() {
  const pathname = usePathname();
  const [CardA, CardB] = useSelectedCards();
  const t = useTranslations("ctaSection");

  if (pathname === "/outils") return null;

  return (
    <section className="relative w-full py-12 md:py-20">
      <div className="container relative z-10 px-4 md:px-6 space-y-10 md:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
          <div className="md:col-span-3">
            <CardA />
          </div>
          <div className="md:col-span-2 flex flex-col items-center">
            <p className="text-sm text-white/40 font-googletexte mb-3 text-center">
              {t("secondaryCTAHelper")}
            </p>
            <CardB />
          </div>
        </div>
      </div>
    </section>
  );
}
