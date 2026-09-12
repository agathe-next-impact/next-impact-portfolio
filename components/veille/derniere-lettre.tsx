import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { getDernieresLettres } from "@/lib/substack";

// ─────────────────────────────────────────────────────────────────────────────
// « Le dernier numéro » — preuve vivante dans le héros de /veille.
//
// Rôle : prouver que la lettre paraît vraiment, juste sous le CTA qui demande
// de s'y abonner (règle d'or : prouver avant de demander). Ce n'est PAS une
// deuxième décision — le numéro se lit, il ne s'achète pas — donc pas de
// bouton : un bloc cliquable sobre, sous la bande des trois offres.
//
// Contenu FR uniquement, comme le reste de la page.
//
// Deux contraintes tirées des données réelles du flux :
//   · la majorité des numéros n'ont PAS d'image de une → la carte est
//     typographique par défaut, la vignette n'est qu'un bonus ;
//   · deux numéros peuvent paraître le même jour (éditions sectorielles) →
//     on en montre trois, sinon « le dernier » désigne une lettre ciblée.
// ─────────────────────────────────────────────────────────────────────────────

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function DerniereLettre() {
  const [derniere, ...precedentes] = await getDernieresLettres(3);

  // Flux indisponible : le héros garde son CTA d'abonnement, sans trou visible
  // ni message d'erreur. Une panne chez Substack ne se raconte pas au prospect.
  if (!derniere) return null;

  return (
    <section
      aria-label="Le dernier numéro de la lettre"
      className="mt-8 border border-dark-gray bg-jet"
    >
      <p className="border-b border-dark-gray px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
        Le dernier numéro
        <span className="text-foreground/70">
          {" · "}
          <time dateTime={derniere.date}>
            {FORMAT_DATE.format(new Date(derniere.date))}
          </time>
        </span>
      </p>

      <a
        href={derniere.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-4 p-4 no-underline transition-colors hover:bg-obsidian sm:gap-5"
      >
        {derniere.image && (
          /* Vignette bornée à 160 px : elle illustre sans jamais pouvoir
             devenir l'élément LCP du héros. */
          <Image
            src={derniere.image}
            alt=""
            width={320}
            height={180}
            sizes="160px"
            className="hidden aspect-[16/9] w-40 shrink-0 border border-dark-gray object-cover sm:block"
          />
        )}

        <span className="min-w-0 flex-1">
          {derniere.etiquette && (
            <span className="mb-2 inline-block border border-dark-gray px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
              {derniere.etiquette}
            </span>
          )}
          <span className="block text-lg font-light leading-snug tracking-tight text-foreground">
            {derniere.titreCourt}
          </span>
          {derniere.sousTitre && (
            <span className="mt-1.5 block font-inter-tight text-sm leading-relaxed text-mid-gray">
              {derniere.sousTitre}
            </span>
          )}
          <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
            Lire ce numéro
            <ArrowUpRight
              size={11}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </span>
      </a>

      {precedentes.length > 0 && (
        <div className="border-t border-dark-gray px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
            Numéros précédents
          </p>
          <ul className="mt-2 space-y-1.5">
            {precedentes.map((lettre) => (
              <li key={lettre.url}>
                <a
                  href={lettre.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter-tight text-sm leading-snug text-foreground/70 no-underline transition-colors hover:text-accent-secondary"
                >
                  {/* L'étiquette reste affichée ici : deux éditions
                        sectorielles du même mois partagent le même titre, et
                        seul le secteur les distingue dans la liste. */}
                  {lettre.etiquette && (
                    <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                      {lettre.etiquette}
                    </span>
                  )}
                  {lettre.titreCourt}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
