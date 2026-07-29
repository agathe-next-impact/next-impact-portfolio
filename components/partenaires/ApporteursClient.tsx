"use client";

/**
 * ApporteursClient — page partenaire pour les apporteurs d'affaires.
 *
 * Structure (ordre prescrit) :
 *  1. Hero — le gain d'abord (commission chiffrée)
 *  2. Sans risque pour vous — traitement de la peur réputationnelle
 *  3. Combien, concrètement — transparence chiffrée
 *  4. Comment ça marche — 3 étapes
 *  5. Pour qui c'est fait — profils qui se reconnaissent
 *  6. CTA bas engagement — formulaire court
 *
 * CONSTANTES COMMERCIALES : modifier COMMISSION_MIN, COMMISSION_MAX, EXEMPLE_MONTANT
 * avant mise en ligne — valeurs actuelles à valider par Agathe.
 *
 * Contenu en français (marché cible FR). La locale EN est noindex tant que la
 * traduction n'est pas faite (cf. app/[locale]/apporteurs/page.tsx).
 */

import { ArrowRight, CheckCircle2, Shield, Users, Repeat, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTES COMMERCIALES — À VALIDER PAR AGATHE
   ───────────────────────────────────────────────────────────────── */
const COMMISSION_MIN = 10; // % du 1er projet signé
const COMMISSION_MAX = 15; // %
const EXEMPLE_MONTANT = 4000; // € HT — exemple d'un projet Headless
const EXEMPLE_MIN = Math.round((EXEMPLE_MONTANT * COMMISSION_MIN) / 100);
const EXEMPLE_MAX = Math.round((EXEMPLE_MONTANT * COMMISSION_MAX) / 100);

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
const STEPS = [
  {
    num: "01",
    title: "Vous présentez le contact",
    body: "Un email ou un message suffit. Vous me transmettez le nom, le contexte du projet et quelques mots sur le besoin. Rien de plus.",
  },
  {
    num: "02",
    title: "Je qualifie et je gère tout",
    body: "Je prends contact, je qualifie le besoin, je fais le devis, je gère la relation client et je produis le projet. Vous n'avez rien à suivre après la mise en relation.",
  },
  {
    num: "03",
    title: "Vous êtes payé à l'encaissement",
    body: "Quand j'encaisse la facture du projet, je vous verse votre commission. Je vous confirme la date de virement — transparence totale.",
  },
];

const PROFILES = [
  "Consultant SEO ou marketing digital à qui on demande des sites",
  "Graphiste ou studio créatif sans pôle dev intégré",
  "Expert-comptable, conseiller en gestion, coach d'entreprise",
  "Agence de communication sans capacité de développement web",
  "Freelance en rédaction, UX ou stratégie qui détecte des besoins web",
  "Consultant ERP ou DSI à qui un dirigeant parle de refonte de site",
];

const PROOFS = [
  {
    value: "45 → 98",
    label: "Score Proditec sur PageSpeed Insights",
    sub: "vérifiable en direct",
  },
  {
    value: "+25",
    label: "projets WordPress & web app livrés",
    sub: "depuis 2016",
  },
  {
    value: "Forfait",
    label: "Budget et délai fixés dès le devis",
    sub: "aucune mauvaise surprise",
  },
];

const REASSURANCE = [
  {
    Icon: Shield,
    title: "Forfait budget + délai",
    body: "Chaque devis fixe le montant et la date de livraison. Pas de dépassement qui retomberait sur votre recommandation.",
  },
  {
    Icon: CheckCircle2,
    title: "Suivi transparent",
    body: "Je vous tiens informé de l'avancement. Vous pouvez répondre à votre contact s'il vous demande où ça en est.",
  },
  {
    Icon: Repeat,
    title: "Continuité pour votre contact",
    body: "Je travaille en WordPress conservé : votre contact garde l'admin qu'il connaît. Pas de rupture, pas de stress.",
  },
];

/* ─────────────────────────────────────────────────────────────────
   Composant principal
   ───────────────────────────────────────────────────────────────── */
export default function ApporteursClient() {
  return (
    <main>
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <BlueprintSection tone="obsidian" ticks innerClassName="px-6 py-16 lg:px-10 lg:py-28">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            Apporteurs d'affaires
          </p>
          <h1 className="max-w-3xl text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Vous connaissez une PME dont le site vieillit mal ?{" "}
            <span className="text-accent-secondary">
              Recommandez-la, touchez {COMMISSION_MIN} à {COMMISSION_MAX} % du projet.
            </span>
          </h1>
          <p className="mt-6 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            Consultants, freelances, graphistes, experts-comptables : si votre réseau a
            besoin d'un site rapide et sérieux, présentez-moi le contact. Je gère tout,
            vous touchez une commission à l'encaissement.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#contact-apporteur" className={BTN_PRIMARY}>
              Discutons de comment travailler ensemble
              <ArrowRight size={14} aria-hidden="true" />
            </a>
            <a href="#comment-ca-marche" className={BTN_GHOST}>
              Comment ça marche
            </a>
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* ── 2. SANS RISQUE — peur réputationnelle ───────────────── */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <SectionHeading
            index="№ 01"
            kicker="Ce que vous recommandez en confiance"
            title={
              <>
                Ce que vous recommandez{" "}
                <span className="text-accent-secondary">ne retombe jamais sur vous.</span>
              </>
            }
            description="Votre réputation est votre actif principal. Voici pourquoi ce que vous recommandez est fiable."
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-px border border-dark-gray bg-dark-gray md:grid-cols-3">
          {PROOFS.map((p) => (
            <StaggerItem key={p.value} className="flex flex-col gap-2 bg-obsidian px-6 py-8">
              <span className="font-mono text-3xl font-light tracking-tight text-foreground">
                {p.value}
              </span>
              <span className="font-inter-tight text-sm leading-snug text-mid-gray">
                {p.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
                {p.sub}
              </span>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-6 border-t border-dark-gray pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {REASSURANCE.map(({ Icon, title, body }) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon size={14} className="flex-shrink-0 text-accent-secondary" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">
                    {title}
                  </span>
                </div>
                <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* ── 3. COMBIEN CONCRÈTEMENT ─────────────────────────────── */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <SectionHeading index="№ 02" kicker="Rémunération" title="Combien, concrètement." />
        </Reveal>

        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray lg:grid-cols-2">
          <Reveal className="flex flex-col gap-4 bg-jet px-8 py-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              Taux de commission
            </p>
            <p className="text-5xl font-light tracking-tight text-foreground">
              {COMMISSION_MIN}–{COMMISSION_MAX} <span className="text-3xl text-accent-secondary">%</span>
            </p>
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              Du montant HT du premier projet signé, versée à l'encaissement. Je paie après
              avoir été payée — votre commission ne dépend jamais d'une facture en attente
              côté client.
            </p>
          </Reveal>

          <Reveal delay={0.05} className="flex flex-col gap-4 bg-jet px-8 py-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              Exemple — projet Headless WordPress
            </p>
            <p className="text-5xl font-light tracking-tight text-foreground">
              {EXEMPLE_MIN}–{EXEMPLE_MAX} <span className="text-2xl text-mid-gray">€</span>
            </p>
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              Pour un projet facturé {EXEMPLE_MONTANT.toLocaleString("fr-FR")} € HT, votre
              commission est de {EXEMPLE_MIN} à {EXEMPLE_MAX} €, versés dans les 5 jours
              suivant mon encaissement.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <p className="mt-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
            Pas de contrat cadre préalable exigé. On acte la mise en relation par email —
            c'est suffisant. Si on travaille régulièrement ensemble, on peut formaliser une
            convention apporteur simple.
          </p>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* ── 4. COMMENT ÇA MARCHE ────────────────────────────────── */}
      <BlueprintSection id="comment-ca-marche" tone="jet" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <SectionHeading
            index="№ 03"
            kicker="Process"
            title={
              <>
                3 étapes.{" "}
                <span className="text-accent-secondary">Rien à gérer après la mise en relation.</span>
              </>
            }
            description="Vous faites une introduction. Je prends le relais. C'est tout ce qu'on vous demande."
          />
        </Reveal>

        <Stagger className="mt-12 flex flex-col border-t border-dark-gray">
          {STEPS.map((step) => (
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

      {/* ── 5. POUR QUI ─────────────────────────────────────────── */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeading
              index="№ 04"
              kicker="Profils"
              title="Pour qui c'est fait ?"
              description="Si vous vous reconnaissez dans l'un de ces profils, on a probablement des raisons de travailler ensemble."
            />
          </Reveal>

          <Stagger className="flex flex-col gap-0">
            {PROFILES.map((profile) => (
              <StaggerItem
                key={profile}
                className="flex items-start gap-3 border-b border-dark-gray py-3"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-secondary"
                  aria-hidden="true"
                />
                <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {profile}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.1} className="mt-12 border-t border-dark-gray pt-12">
          <div className="flex items-start gap-4 border border-dark-gray bg-jet px-6 py-5">
            <Users size={16} className="mt-0.5 flex-shrink-0 text-accent-secondary" aria-hidden="true" />
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              Ce dispositif n'est pas réservé aux professionnels du web. Si vous évoluez dans
              un réseau de dirigeants de PME ou d'artisans, vous détectez probablement des
              besoins de modernisation sans le savoir.
            </p>
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />

      {/* ── 6. CTA BAS ENGAGEMENT ───────────────────────────────── */}
      <BlueprintSection id="contact-apporteur" tone="jet" innerClassName="px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeading
              index="№ 05"
              kicker="Démarrer"
              title={
                <>
                  Parlons de comment{" "}
                  <span className="text-accent-secondary">on travaille ensemble.</span>
                </>
              }
              description="Pas de contrat en ligne. Juste un échange pour voir si ça a du sens. Si vous avez déjà un contact en tête, dites-le moi : je réponds sous 24 h."
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
            <PartnerIntroForm />
          </Reveal>
        </div>
      </BlueprintSection>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Formulaire court — mise en relation apporteur
   Note : câbler sur /api/contact avant mise en ligne — actuellement
   mailto: en fallback (cf. TODO dans le résumé d'intégration).
   ───────────────────────────────────────────────────────────────── */
function PartnerIntroForm() {
  return (
    <form
      action="mailto:agathe@next-impact.digital"
      method="post"
      encType="text/plain"
      className="flex flex-col gap-5 border border-dark-gray bg-obsidian p-6 lg:p-8"
      aria-label="Formulaire de mise en relation apporteur"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
        Parlez-moi du contact
      </p>

      <div>
        <label htmlFor="ap-name" className={LABEL}>
          Votre nom <span aria-hidden="true">*</span>
        </label>
        <input
          id="ap-name"
          name="Votre nom"
          type="text"
          required
          autoComplete="name"
          className={FIELD}
          placeholder="Prénom Nom"
        />
      </div>

      <div>
        <label htmlFor="ap-email" className={LABEL}>
          Votre email <span aria-hidden="true">*</span>
        </label>
        <input
          id="ap-email"
          name="Votre email"
          type="email"
          required
          autoComplete="email"
          className={FIELD}
          placeholder="vous@exemple.fr"
        />
      </div>

      <div>
        <label htmlFor="ap-context" className={LABEL}>
          Le contact et son besoin
        </label>
        <textarea
          id="ap-context"
          name="Contact et besoin"
          rows={4}
          className={FIELD}
          placeholder="Ex. : Marie Dupont, dirigeante d'une PME industrielle, veut moderniser son site WordPress vieillissant. Budget estimé : 4 000–6 000 €."
        />
      </div>

      <button type="submit" className={BTN_PRIMARY} style={{ width: "fit-content" }}>
        Envoyer la mise en relation
        <ArrowRight size={14} aria-hidden="true" />
      </button>

      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
        Pas d'engagement · Réponse sous 24 h · Commission à l'encaissement
      </p>
    </form>
  );
}
