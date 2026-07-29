"use client";

/**
 * AgencesClient — page partenaire pour les agences & studios.
 *
 * Structure (ordre prescrit) :
 *  1. Hero — la capacité sans le risque
 *  2. Engagement de non-démarchage — EN HAUT, visible immédiatement
 *  3. Ce que vous gagnez — capacité prod + tarif net partenaire
 *  4. Comment on travaille — 4 phases côté agence
 *  5. Preuves techniques — CWV + études de cas recadrées
 *  6. CTA — projet pilote test
 *
 * CONSTANTES COMMERCIALES : modifier TARIF_NET_REMISE avant mise en ligne.
 * Valeur actuelle (−20 %) à valider par Agathe.
 *
 * Contenu en français (marché cible FR). La locale EN est noindex tant que la
 * traduction n'est pas faite (cf. app/[locale]/agences/page.tsx).
 */

import { ArrowRight, Lock, ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTES COMMERCIALES — À VALIDER PAR AGATHE
   ───────────────────────────────────────────────────────────────── */
const TARIF_NET_REMISE = 20; // % de remise par rapport au tarif public

/* ─────────────────────────────────────────────────────────────────
   Styles partagés
   ───────────────────────────────────────────────────────────────── */
const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";

const BTN_GHOST =
  "inline-flex h-11 items-center gap-2 border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

const FIELD =
  "w-full bg-jet border border-dark-gray px-3.5 py-2.5 font-inter-tight text-sm text-foreground placeholder:text-mid-gray outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent-secondary focus-visible:border-accent-secondary";

const LABEL = "block mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray";

/* ─────────────────────────────────────────────────────────────────
   Données de contenu
   ───────────────────────────────────────────────────────────────── */
const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Vous briefez",
    body: "Vous me transmettez le brief de votre client. Je pose les questions techniques nécessaires, vous gardez la relation et la vision globale du projet.",
  },
  {
    num: "02",
    title: "Je devise en net partenaire",
    body: `Vous recevez un devis au tarif net partenaire (−${TARIF_NET_REMISE} % du tarif public). Vous revendez avec votre marge, votre tarification reste la vôtre.`,
  },
  {
    num: "03",
    title: "Je produis, vous coordonnez",
    body: "Je développe. Vous restez l'interlocuteur de votre client. Je livre les éléments techniques directement dans votre workflow (repo, staging, etc.).",
  },
  {
    num: "04",
    title: "Vous livrez sous votre marque",
    body: "Le livrable est le vôtre. Votre client ne sait pas que j'existe sauf si vous souhaitez le mentionner. La relation reste intégralement la vôtre.",
  },
];

const GAINS = [
  {
    title: "Capacité de production à la demande",
    body: "Pas de salarié dev à porter entre deux projets. Vous activez la ressource quand vous en avez besoin.",
  },
  {
    title: `Tarif net −${TARIF_NET_REMISE} % + votre marge`,
    body: "Le tarif partenaire vous laisse de la marge pour revendre au prix que vous estimez juste pour votre client.",
  },
  {
    title: "Signature technique soignée",
    body: "Core Web Vitals au vert, code propre, WordPress conservé côté admin : votre livrable est défendable techniquement devant votre client.",
  },
  {
    title: "Double culture WordPress + web moderne",
    body: "15 ans d'usage WordPress côté édition, 6 ans de développement. Je comprends vos contraintes et celles de votre client.",
  },
];

const PROOFS = [
  {
    value: "45 → 98",
    label: "Score PageSpeed Proditec après refonte",
    sub: "vérifiable sur PageSpeed Insights",
  },
  {
    value: "+25",
    label: "projets livrés sous votre marque",
    sub: "WordPress, Headless, web app",
  },
  {
    value: "Forfait",
    label: "Délai et budget fixés dès le devis",
    sub: "ce que vous annoncez à votre client tient",
  },
];

/* ─────────────────────────────────────────────────────────────────
   Composant principal
   ───────────────────────────────────────────────────────────────── */
export default function AgencesClient() {
  return (
    <main>
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <BlueprintSection tone="obsidian" ticks innerClassName="px-6 py-16 lg:px-10 lg:py-28">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            Agences &amp; studios
          </p>
          <h1 className="max-w-3xl text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Votre client veut un site rapide et moderne.{" "}
            <span className="text-accent-secondary">
              Vous n'avez pas le pôle dev ? Je le construis sous votre marque.
            </span>
          </h1>
          <p className="mt-6 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            Double culture WordPress + web moderne, forfait garanti, délais tenus. Vous
            gardez la relation client — je prends la technique.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#contact-agence" className={BTN_PRIMARY}>
              Parlons d'un premier projet test
              <ArrowRight size={14} aria-hidden="true" />
            </a>
            <a href="#comment-on-travaille" className={BTN_GHOST}>
              Comment on travaille
            </a>
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* ── 2. ENGAGEMENT NON-DÉMARCHAGE — EN HAUT ──────────────── */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-14 lg:px-10 lg:py-16">
        <Reveal>
          <div className="flex flex-col gap-6 border border-accent-secondary/30 bg-obsidian px-6 py-8 lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:py-10">
            <div className="flex-shrink-0">
              <Lock size={28} className="text-accent-secondary" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                Engagement de non-démarchage — Marque blanche
              </p>
              <p className="max-w-2xl text-xl font-light tracking-tight text-foreground md:text-2xl">
                Je ne contacte jamais vos clients en direct. La relation reste la vôtre,
                intégralement et définitivement.
              </p>
              <p className="max-w-2xl font-inter-tight text-sm leading-relaxed text-mid-gray">
                Cet engagement n'est pas enterré dans des CGV. Il est ici, en haut de page,
                parce que c'est la condition de confiance sur laquelle repose tout le reste.
                Votre client ne sait pas que j'existe sauf si vous le décidez.
              </p>
            </div>
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* ── 3. CE QUE VOUS GAGNEZ ───────────────────────────────── */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <SectionHeading
            index="№ 01"
            kicker="Bénéfices"
            title={
              <>
                Ce que vous gagnez{" "}
                <span className="text-accent-secondary">en travaillant avec moi.</span>
              </>
            }
          />
        </Reveal>

        <Stagger className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2">
          {GAINS.map((g) => (
            <StaggerItem key={g.title} className="flex flex-col gap-3 bg-jet px-6 py-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="flex-shrink-0 text-accent-secondary" aria-hidden="true" />
                <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">
                  {g.title}
                </h3>
              </div>
              <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{g.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* ── 4. COMMENT ON TRAVAILLE ─────────────────────────────── */}
      <BlueprintSection id="comment-on-travaille" tone="jet" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <SectionHeading
            index="№ 02"
            kicker="Process"
            title={
              <>
                Vous gardez la relation.{" "}
                <span className="text-accent-secondary">Je prends la technique.</span>
              </>
            }
            description="4 phases, toutes sous votre contrôle."
          />
        </Reveal>

        <Stagger className="mt-12 flex flex-col border-t border-dark-gray">
          {WORKFLOW_STEPS.map((step) => (
            <StaggerItem
              key={step.num}
              className="grid gap-4 border-b border-dark-gray py-8 sm:grid-cols-[80px_1fr] sm:gap-8"
            >
              <span className="font-mono text-2xl font-light text-accent-secondary">{step.num}</span>
              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-[13px] uppercase tracking-[0.08em] text-foreground">
                  {step.title}
                </h3>
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>

      <Separator />

      {/* ── 5. PREUVES TECHNIQUES ───────────────────────────────── */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <SectionHeading
            index="№ 03"
            kicker="Ce que je livre sous votre marque"
            title={
              <>
                Des livrables{" "}
                <span className="text-accent-secondary">défendables devant votre client.</span>
              </>
            }
            description="Mêmes standards que ce que je livre en direct — Core Web Vitals vérifiables, WordPress conservé, code documenté."
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-px border border-dark-gray bg-dark-gray md:grid-cols-3">
          {PROOFS.map((p) => (
            <StaggerItem key={p.value} className="flex flex-col gap-2 bg-obsidian px-6 py-8">
              <span className="font-mono text-3xl font-light tracking-tight text-foreground">
                {p.value}
              </span>
              <span className="font-inter-tight text-sm leading-snug text-mid-gray">{p.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
                {p.sub}
              </span>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-dark-gray pt-8">
            <Link href="/etudes-de-cas" className={BTN_GHOST}>
              Voir les études de cas
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <a
              href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.next-impact.digital"
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_GHOST}
            >
              Vérifier les Core Web Vitals de ce site
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* ── 6. CTA — projet pilote ───────────────────────────────── */}
      <BlueprintSection id="contact-agence" tone="jet" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeading
              index="№ 04"
              kicker="Démarrer"
              title={
                <>
                  Parlons d'un{" "}
                  <span className="text-accent-secondary">premier projet test.</span>
                </>
              }
              description="Le meilleur moyen de voir si on travaille bien ensemble, c'est de le tester sur un projet réel, sans s'engager sur un flux permanent. Envoyez-moi un brief — je réponds sous 24 h avec un devis net partenaire."
            />

            <div className="mt-8 flex flex-col gap-3">
              <a href="mailto:agathe@next-impact.digital" className={BTN_GHOST}>
                <Mail size={14} aria-hidden="true" />
                agathe@next-impact.digital
              </a>
              <Link href="/contact" className={BTN_GHOST}>
                Ou via le formulaire de contact
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <AgencyContactForm tarif={TARIF_NET_REMISE} />
          </Reveal>
        </div>
      </BlueprintSection>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Formulaire court — premier brief agence
   Note : câbler sur /api/contact avant mise en ligne (cf. TODO).
   ───────────────────────────────────────────────────────────────── */
function AgencyContactForm({ tarif }: { tarif: number }) {
  return (
    <form
      action="mailto:agathe@next-impact.digital"
      method="post"
      encType="text/plain"
      className="flex flex-col gap-5 border border-dark-gray bg-obsidian p-6 lg:p-8"
      aria-label="Formulaire de contact agence partenaire"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
        Brief du premier projet test
      </p>

      <div>
        <label htmlFor="ag-agency" className={LABEL}>
          Votre agence / studio <span aria-hidden="true">*</span>
        </label>
        <input
          id="ag-agency"
          name="Agence"
          type="text"
          required
          className={FIELD}
          placeholder="Nom de l'agence"
        />
      </div>

      <div>
        <label htmlFor="ag-email" className={LABEL}>
          Votre email <span aria-hidden="true">*</span>
        </label>
        <input
          id="ag-email"
          name="Email"
          type="email"
          required
          autoComplete="email"
          className={FIELD}
          placeholder="vous@agence.fr"
        />
      </div>

      <div>
        <label htmlFor="ag-brief" className={LABEL}>
          Le projet en quelques mots
        </label>
        <textarea
          id="ag-brief"
          name="Brief"
          rows={4}
          className={FIELD}
          placeholder="Type de projet (WordPress, Headless, web app), budget client estimé, délai souhaité, contraintes techniques particulières."
        />
      </div>

      <button type="submit" className={BTN_PRIMARY} style={{ width: "fit-content" }}>
        Envoyer le brief
        <ArrowRight size={14} aria-hidden="true" />
      </button>

      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
        Devis net partenaire −{tarif} % · Réponse sous 24 h · Non-démarchage garanti
      </p>
    </form>
  );
}
