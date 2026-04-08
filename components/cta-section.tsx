"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
   1. CTA Secondaire — Lead Magnet (Audit IA)
   ───────────────────────────────────────────── */
function CTALeadMagnet() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="border border-lightblue/20 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-darkblue/60 to-mediumblue/40 backdrop-blur-xl h-full flex flex-col">
        {/* Badge */}
        <motion.div custom={0} variants={fadeUp} className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lightyellow/10 border border-lightyellow/20 text-lightyellow text-xs font-googletexte">
            <Search className="w-3.5 h-3.5" />
            Audit gratuit
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          custom={1}
          variants={fadeUp}
          className="text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          Évaluez votre site en 5 minutes
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUp}
          className="text-sm md:text-base text-white/70 font-googletexte text-center mx-auto mb-5 leading-relaxed"
        >
          Recevez un{" "}
          <span className="text-lightyellow font-semibold">
            rapport complet avec des recommandations personnalisées
          </span>{" "}
          — gratuit, sans engagement.
        </motion.p>

        {/* Benefits pills */}
        <motion.div
          custom={3}
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {[
            { icon: Zap, label: "Performance ↑", color: "text-coral" },
            { icon: TrendingUp, label: "ROI Projection", color: "text-lightyellow" },
            { icon: PiggyBank, label: "Cost Efficiency", color: "text-lightblue" },
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

        {/* CTA Button — style outline secondaire */}
        <motion.div custom={4} variants={fadeUp} className="flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-transparent border-2 border-lightyellow/60 text-lightyellow py-2.5 px-6 rounded-full hover:bg-lightyellow/10 hover:border-lightyellow transition-all duration-300 font-googletitre text-sm md:text-base font-semibold"
            asChild
          >
            <Link href="/audit-site-ia">
              Lancer mon audit gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            Gratuit · Rapport en 5 minutes · Sans engagement
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2. CTA Principal — Entonnoir de Conversion
   ───────────────────────────────────────────── */
function CTAConversion() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="relative overflow-hidden border-2 border-coral/30 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-mediumblue to-regularblue/40 h-full flex flex-col">
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-lightyellow/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <motion.div custom={0} variants={fadeUp} className="relative z-10 flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/20 text-coral text-xs font-googletexte">
            <ClipboardCheck className="w-3.5 h-3.5" />
            Questionnaire interactif
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          Déterminez l&apos;offre adaptée
        </motion.h2>

        {/* Promise */}
        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          Obtenez une estimation personnalisée pour{" "}
          <span className="text-white font-semibold">
            un site combinant performance et le back-office le plus utilisé au monde
          </span>
          .
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          Répondez à quelques questions pour recevoir une offre adaptée à votre profil et votre budget.
        </motion.p>

        {/* CTA Button — le plus voyant */}
        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-coral text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <Link href="/contact">
              Démarrer mon projet
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            Disponible · Réponse sous 24h · 8+ ans d&apos;expérience
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2b. CTA Simulateur ROI (affiché sur /contact)
   ───────────────────────────────────────────── */
function CTASimulateurROI() {
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
            Simulateur gratuit
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          Calculez votre ROI
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          Mesurez le{" "}
          <span className="text-lightyellow font-semibold">
            manque à gagner dû à un site lent
          </span>{" "}
          et projetez vos revenus après migration headless.
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          Résultats instantanés basés sur vos données réelles de trafic et de conversion.
        </motion.p>

        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-lightyellow text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <Link href="/outils/simulateur-roi">
              Simuler mon ROI
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            Gratuit · Résultats instantanés · Sans engagement
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
            Outil gratuit
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          Comparez vos performances
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          Mesurez les{" "}
          <span className="text-lightblue font-semibold">
            performances réelles de votre site face à vos concurrents
          </span>{" "}
          via Google PageSpeed.
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          Audit Core Web Vitals et analyse concurrentielle en quelques secondes.
        </motion.p>

        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-lightblue text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <Link href="/outils/benchmarking">
              Lancer le benchmarking
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            Gratuit · Analyse Core Web Vitals · Sans engagement
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2d. CTA Livre Blanc
   ───────────────────────────────────────────── */
function CTALivreBlanc() {
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
            Guide gratuit
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          className="relative z-10 text-2xl md:text-3xl font-googletitre font-medium text-white text-center tracking-tight mb-3"
        >
          Qu&apos;est-ce que WordPress Headless ?
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="relative z-10 text-sm md:text-base text-white/80 font-googletexte text-center mx-auto mb-3 leading-relaxed"
        >
          Découvrez dans notre livre blanc{" "}
          <span className="text-orange font-semibold">
            tout ce qu&apos;il faut savoir sur l&apos;architecture headless
          </span>{" "}
          : avantages, cas d&apos;usage et mise en œuvre.
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="relative z-10 text-xs md:text-sm text-white/60 font-googletexte text-center mx-auto mb-6"
        >
          Un guide complet pour comprendre, évaluer et adopter WordPress Headless.
        </motion.p>

        <motion.div custom={4} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-auto gap-2">
          <Button
            className="inline-flex items-center gap-2 bg-orange text-darkblue py-3 px-8 rounded-full hover:scale-[1.02] transition-all duration-300 font-googletitre text-base md:text-lg font-semibold"
            asChild
          >
            <Link href="/ressources/livre_blanc_wp_headless.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
              Télécharger le livre blanc
            </Link>
          </Button>
          <span className="text-xs text-white/40 font-googletexte">
            Gratuit · PDF complet · Sans inscription
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   3. Bloc Réassurance — Coordonnées directes
   ───────────────────────────────────────────── */
export function BlocReassurance() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full"
    >
      <div className="w-full rounded-3xl p-8 md:p-12 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-sm">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} className="text-center mb-8">
          <p className="text-white/50 font-googletexte uppercase tracking-widest text-sm mb-3">
            Contact direct
          </p>
          <h3 className="text-2xl md:text-3xl font-googletitre font-medium text-white mb-2">
            Parlons de votre projet
          </h3>
          <p className="text-white/60 font-googletexte max-w-md mx-auto">
            Pas besoin de tester ? Contactez-moi directement.
          </p>
        </motion.div>

        {/* Credibility badges */}
        <motion.div
          custom={1}
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-googletexte">
            <CircleDot className="w-3.5 h-3.5" />
            Disponible
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-googletexte">
            <Clock className="w-3.5 h-3.5 text-lightyellow" />
            8+ ans d&apos;expérience
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-googletexte">
            <Award className="w-3.5 h-3.5 text-coral" />
            Développeur WordPress Headless
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lightyellow/10 border border-lightyellow/20 text-lightyellow text-sm font-googletexte">
            <BadgePercent className="w-3.5 h-3.5" />
            Prestataire TIH
          </span>
        </motion.div>

        {/* Contact card */}
        <motion.div
          custom={2}
          variants={fadeUp}
          className="bg-darkblue/40 rounded-2xl p-6 md:p-8 border border-white/5"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            {/* Identity */}
            <div className="flex-1 space-y-1">
              <p className="font-googletitre font-semibold text-white text-lg">
                Next Impact Digital
              </p>
              <p className="text-white/70 font-googletexte text-sm">
                EI Agathe Karinthi-Martin
              </p>
              <div className="flex items-start gap-2 text-white/50 font-googletexte text-sm pt-1">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-white/80">4 rue du centre, 15400 Trizac</span>
              </div>
            </div>

            {/* Contact links */}
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
   Sélection des cartes par profil / contexte
   ───────────────────────────────────────────── */
type CardId = "audit" | "conversion" | "roi" | "benchmarking" | "livre-blanc";

const CARD_COMPONENTS: Record<CardId, React.FC> = {
  audit: CTALeadMagnet,
  conversion: CTAConversion,
  roi: CTASimulateurROI,
  benchmarking: CTABenchmarking,
  "livre-blanc": CTALivreBlanc,
};

/** Pages où chaque carte est redondante — si on est dessus, on l'exclut */
const CARD_PAGES: Record<CardId, string[]> = {
  audit: ["/audit-site-ia", "/cms-headless"],
  conversion: ["/contact"],
  roi: ["/outils/simulateur-roi", "/simulateur-tarifs"],
  benchmarking: ["/outils/benchmarking"],
  "livre-blanc": ["/documentation"],
};

/** Ordre de priorité des cartes par profil (pages classiques) */
const PROFILE_CARDS: Record<ProfileId | "default", CardId[]> = {
  decideur:     ["livre-blanc", "roi", "conversion", "benchmarking", "audit"],
  utilisateur:  ["benchmarking", "conversion", "livre-blanc", "roi", "audit"],
  developpeur:  ["benchmarking", "roi", "conversion", "audit", "livre-blanc"],
  default:      ["conversion", "livre-blanc", "roi", "benchmarking", "audit"],
};

/** Ordre des cartes outils (pages outils) */
const TOOL_CARDS: CardId[] = ["audit", "roi", "benchmarking"];

/** Pages considérées comme « page outil » */
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
   Export : Structure complète 3 niveaux
   ───────────────────────────────────────────── */
export function CTASection() {
  const pathname = usePathname();
  const [CardA, CardB] = useSelectedCards();

  // Pas de boîtes CTA sur la page Boîte à outils
  if (pathname === "/outils") return null;

  return (
    <section className="relative w-full py-12 md:py-20">
      <div className="container relative z-10 px-4 md:px-6 space-y-10 md:space-y-12">
        {/* Grille asymétrique — CTA principal dominant (~60/40) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
          <div className="md:col-span-3">
            <CardA />
          </div>
          <div className="md:col-span-2 flex flex-col items-center">
            <p className="text-sm text-white/40 font-googletexte mb-3 text-center">
              Pas encore prêt ? Commencez par un outil gratuit
            </p>
            <CardB />
          </div>
        </div>

        {/* Bloc Réassurance retiré — coordonnées déplacées dans le footer */}
      </div>
    </section>
  );
}
