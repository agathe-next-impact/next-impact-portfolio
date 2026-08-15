import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getFiche,
  parseDeclaredComponents,
  saveDeclaredStack,
  watchedCount,
  DECLARABLE_TYPES,
  type DeclaredInput,
} from "@sentinelle/onboarding";
import type { StackItemType } from "@sentinelle/types";
import { normalizeSiteUrl } from "@sentinelle/url";
import {
  BackLink,
  buttonClass,
  FAMILY_LABEL,
  inputClass,
  Label,
  Notice,
  Panel,
} from "../ui";
import { currentClientId, ESPACE_PATH } from "../session";

export const metadata: Metadata = {
  title: "Sentinelle — votre fiche",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const FICHE_PATH = "/espace/fiche";

/** Lignes vierges proposées en plus de ce qui est déjà déclaré. */
const BLANK_ROWS = 5;

export default async function FichePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; erreur?: string }>;
}) {
  const clientId = await currentClientId();
  if (!clientId) redirect(ESPACE_PATH);

  const fiche = await getFiche(clientId);
  if (!fiche) redirect(ESPACE_PATH);

  const { message, erreur } = await searchParams;

  const detectes = fiche.components.filter((component) => component.source === "scanned");
  const declares = fiche.components.filter((component) => component.source === "declared");
  const suivis = watchedCount(fiche.components);

  async function enregistrer(formData: FormData) {
    "use server";

    // Revérification : une action serveur est une URL publique.
    const id = await currentClientId();
    if (!id) redirect(ESPACE_PATH);

    const courant = await getFiche(id);
    if (!courant) redirect(ESPACE_PATH);

    const labels = formData.getAll("label").map(String);
    const types = formData.getAll("type").map(String);
    const versions = formData.getAll("version").map(String);

    const rows: DeclaredInput[] = labels.map((label, index) => ({
      label,
      type: (types[index] ?? "saas") as StackItemType,
      version: versions[index] ?? "",
    }));

    const outcome = parseDeclaredComponents(rows, { platform: courant.platform });

    if (outcome.rejected.length > 0) {
      const detail = outcome.rejected
        .map((rejet) => `${rejet.label} — ${rejet.reason}`)
        .join(" · ");
      redirect(`${FICHE_PATH}?message=${encodeURIComponent(`Rien n'a été enregistré. ${detail}`)}&erreur=1`);
    }

    await saveDeclaredStack(id, outcome.items, {
      company: String(formData.get("company") ?? "").trim() || null,
      siteUrl: normalizeSiteUrl(String(formData.get("siteUrl") ?? "")) ?? undefined,
      sector: String(formData.get("sector") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    });

    // On le dit plutôt que de le taire : un composant déclaré qu'aucun
    // catalogue public ne couvre ne produira jamais d'alerte automatique, et
    // laisser croire l'inverse serait la pire des promesses.
    const restants = outcome.unwatched.length;
    const sans =
      restants === 0
        ? ""
        : restants === 1
          ? " Un composant est affiché sans veille automatique : aucun catalogue public ne le couvre, je le regarde à la main."
          : ` ${restants} composants sont affichés sans veille automatique : aucun catalogue public ne les couvre, je les regarde à la main.`;

    redirect(`${FICHE_PATH}?message=${encodeURIComponent(`Fiche enregistrée.${sans}`)}`);
  }

  const lignes = [
    ...declares.map((component) => ({
      label: component.label,
      type: component.type as StackItemType,
      version: component.version ?? "",
    })),
    ...Array.from({ length: BLANK_ROWS }, () => ({
      label: "",
      type: "cms_plugin" as StackItemType,
      version: "",
    })),
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <BackLink href={ESPACE_PATH}>Mon espace</BackLink>

      <h1 className="mt-6 text-3xl font-light tracking-tight text-foreground lg:text-4xl">
        Votre fiche
      </h1>
      <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
        {fiche.components.length} composant{fiche.components.length > 1 ? "s" : ""}, dont{" "}
        {suivis} suivi{suivis > 1 ? "s" : ""} par une source de veille automatique. Les
        autres restent affichés : je les regarde à la main, mais aucun catalogue public ne
        les couvre.
      </p>

      {message && (
        <div className="mt-8">
          <Notice message={message} tone={erreur ? "erreur" : "ok"} />
        </div>
      )}

      <section className="mt-12">
        <Label>Détecté sur votre site</Label>
        {detectes.length === 0 ? (
          <p className="mt-4 font-inter-tight text-base leading-relaxed text-mid-gray">
            L&apos;analyse publique n&apos;a rien pu identifier — cela arrive sur les sites
            très épurés ou protégés par un pare-feu. Votre fiche repose alors entièrement
            sur ce que vous déclarez ci-dessous.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-dark-gray border-y border-dark-gray">
            {detectes.map((component) => (
              <li
                key={component.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
              >
                <span className="font-inter-tight text-base text-foreground">
                  {component.label}
                  <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {FAMILY_LABEL[component.type] ?? component.type}
                  </span>
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                  {component.version ? `v${component.version}` : "version inconnue"}
                  {component.ecosystem ? "" : " · non surveillé"}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
          Une version fausse ou un composant absent&nbsp;? Redéclarez-le ci-dessous : ce
          que vous écrivez remplace ce que l&apos;analyse a cru voir, et le fait pour de
          bon.
        </p>
      </section>

      <form action={enregistrer} className="mt-14">
        <Label>Ce que l&apos;analyse ne peut pas voir</Label>
        <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
          Les extensions qui ne se chargent qu&apos;en administration, votre version de PHP,
          votre hébergeur, les services branchés sur le site. Laissez la version vide si
          vous ne l&apos;avez pas sous les yeux — mieux vaut rien qu&apos;une approximation.
        </p>

        <div className="mt-6 space-y-3">
          {lignes.map((ligne, index) => (
            <Panel key={index} className="p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <div>
                  <label
                    htmlFor={`label-${index}`}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
                  >
                    Nom du composant
                  </label>
                  <input
                    id={`label-${index}`}
                    name="label"
                    type="text"
                    defaultValue={ligne.label}
                    placeholder="Contact Form 7, PHP, o2switch…"
                    className={`${inputClass} mt-2`}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`type-${index}`}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
                  >
                    Famille
                  </label>
                  <select
                    id={`type-${index}`}
                    name="type"
                    defaultValue={ligne.type}
                    className={`${inputClass} mt-2 sm:w-56`}
                  >
                    {DECLARABLE_TYPES.map((entry) => (
                      <option key={entry.value} value={entry.value}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`version-${index}`}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
                  >
                    Version
                  </label>
                  <input
                    id={`version-${index}`}
                    name="version"
                    type="text"
                    inputMode="decimal"
                    defaultValue={ligne.version}
                    placeholder="8.2.15"
                    className={`${inputClass} mt-2 sm:w-32`}
                  />
                </div>
              </div>
            </Panel>
          ))}
        </div>

        <p className="mt-4 font-inter-tight text-sm leading-relaxed text-mid-gray">
          Pour retirer une ligne, videz son nom et enregistrez.
        </p>

        <div className="mt-12">
          <Label>Votre contexte</Label>
          <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">
            Ces deux champs ne servent qu&apos;à une chose : écrire des alertes qui parlent
            de votre situation plutôt que d&apos;un site abstrait.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="company"
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
              >
                Structure
              </label>
              <input
                id="company"
                name="company"
                type="text"
                defaultValue={fiche.client.company ?? ""}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label
                htmlFor="siteUrl"
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
              >
                Adresse du site
              </label>
              <input
                id="siteUrl"
                name="siteUrl"
                type="text"
                defaultValue={fiche.client.siteUrl}
                className={`${inputClass} mt-2`}
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="sector"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
            >
              Activité et taille
            </label>
            <input
              id="sector"
              name="sector"
              type="text"
              defaultValue={fiche.client.sector ?? ""}
              placeholder="Cabinet d'expertise comptable, 25 salariés"
              className={`${inputClass} mt-2`}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="notes"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
            >
              Ce qu&apos;il faut savoir sur votre site
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              defaultValue={fiche.client.notes ?? ""}
              placeholder="Qui l'administre, ce qui ne doit jamais tomber, un prestataire qui intervient dessus…"
              className={`${inputClass} mt-2`}
            />
          </div>
        </div>

        <button type="submit" className={`${buttonClass.primary} mt-10`}>
          Enregistrer ma fiche
        </button>
      </form>
    </main>
  );
}
