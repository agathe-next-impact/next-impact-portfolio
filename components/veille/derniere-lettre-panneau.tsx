import Image from "next/image";

import { NEWSLETTER_SUBSCRIBE_URL } from "@/lib/newsletter";
import type { LettreSubstack } from "@/lib/substack";

// ─────────────────────────────────────────────────────────────────────────────
// Panneau « dernier numéro » du héros d'accueil, onglet Veille.
//
// Le héros d'accueil a trois onglets mais n'avait que deux visuels : l'onglet
// Veille empruntait le portrait de l'onglet Conseil. Ce panneau lui donne sa
// preuve propre — la lettre paraît vraiment, la voici.
//
// Purement présentationnel : aucune I/O, aucun état. La donnée est lue côté
// serveur dans app/[locale]/page.tsx puis descendue en props, parce que le
// héros est un composant client et ne peut pas interroger le flux lui-même.
//
// Format imposé par le conteneur : une boîte 4/5, donc portrait. L'image de une
// (16/9, absente sur la plupart des numéros) coiffe un bloc typographique qui
// tient seul quand elle manque.
//
// Le panneau entier est un lien vers l'abonnement : le numéro montre ce qu'on
// reçoit, le clic permet de le recevoir. D'où la ligne « S'abonner » en pied —
// une zone cliquable sans action visible ne se clique pas.
// ─────────────────────────────────────────────────────────────────────────────

export function DerniereLettrePanneau({
  lettre,
  isEn,
}: {
  lettre: LettreSubstack;
  isEn: boolean;
}) {
  // Fuseau explicite : sans lui, un numéro publié en fin de soirée UTC se date
  // au jour suivant côté serveur et au jour même côté navigateur — soit une
  // erreur d'hydratation sur un héros rendu client.
  const dateLisible = new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(lettre.date));

  return (
    <a
      href={NEWSLETTER_SUBSCRIBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      /* Le titre du numéro reste lisible à l'écran ; l'intitulé accessible, lui,
         annonce où mène le clic — s'abonner, pas lire ce numéro. */
      aria-label={
        isEn
          ? `Subscribe to the free newsletter — latest issue: ${lettre.titreCourt}`
          : `S'abonner à la lettre gratuite — dernier numéro : ${lettre.titreCourt}`
      }
      className="group flex h-full flex-col no-underline transition-colors hover:bg-jet"
    >
      {lettre.image && (
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-dark-gray">
          <Image
            src={lettre.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-1 flex-col justify-center gap-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            {isEn ? "Latest issue" : "Dernier numéro"}
            <span className="text-foreground/70">
              {" · "}
              <time dateTime={lettre.date}>{dateLisible}</time>
            </span>
          </p>

          {lettre.etiquette && (
            <span className="inline-block self-start border border-dark-gray px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
              {lettre.etiquette}
            </span>
          )}

          <p className="text-lg font-light leading-snug tracking-tight text-foreground">
            {lettre.titreCourt}
          </p>

          {lettre.sousTitre && (
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {lettre.sousTitre}
            </p>
          )}
        </div>

        <span
          aria-hidden
          className="mt-4 inline-flex items-center gap-1.5 border-t border-dark-gray pt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary"
        >
          {isEn ? "Subscribe — free" : "S'abonner — gratuit"}
          <span className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
            &#8599;
          </span>
        </span>
      </div>
    </a>
  );
}
