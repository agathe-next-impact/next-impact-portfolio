"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { dejaInstallee } from "./pwa-commun";

// ─────────────────────────────────────────────────────────────────────────────
// Le lecteur de pièces intégré aux deux applications installées.
//
// Dans l'application installée, un PDF ouvert « dans un nouvel onglet » sort
// vers le navigateur (Android le télécharge, l'iPhone l'affiche sans bouton
// retour). Ce composant intercepte donc, en mode installé seulement, les liens
// vers une pièce (`…/fichiers/<empreinte>`) ou le dossier de restitution, et
// les affiche par-dessus l'écran : PDF rendu par pdf.js (chargé à la première
// ouverture seulement), image telle quelle, autre format proposé au partage.
//
// Le fichier est lu en `fetch` : le service worker le garde (`sw-commun.ts`),
// il se relit donc hors ligne. Dans un onglet de navigateur, rien ne change :
// le lien garde son comportement habituel.
//
// Le bouton retour d'Android ferme le lecteur : une entrée d'historique est
// poussée à l'ouverture, avec l'état du routeur Next recopié (sans lui, Next
// rechargerait la page au retour).
// ─────────────────────────────────────────────────────────────────────────────

const CIBLE = /\/(?:fichiers\/[a-f0-9]{64}|restitution)$/;

interface Document {
  adresse: string;
  titre: string;
}

type Etat =
  | { phase: "chargement" }
  | { phase: "pdf"; fichier: File }
  | { phase: "image"; fichier: File; url: string }
  | { phase: "autre"; fichier: File }
  | { phase: "erreur"; message: string };

function nomDepuis(entete: string | null, repli: string): string {
  const etoile = entete?.match(/filename\*=UTF-8''([^;]+)/i);
  if (etoile) {
    try {
      return decodeURIComponent(etoile[1]);
    } catch {
      // Nom mal encodé : on passe au suivant.
    }
  }
  return entete?.match(/filename="?([^";]+)"?/i)?.[1] ?? repli;
}

export function LecteurPdf() {
  const [document, setDocument] = useState<Document | null>(null);
  const historique = useRef(false);

  useEffect(() => {
    function intercepter(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!dejaInstallee()) return;

      const lien = (event.target as Element | null)?.closest?.("a[href]");
      if (!(lien instanceof HTMLAnchorElement)) return;
      const url = new URL(lien.href, window.location.href);
      if (url.origin !== window.location.origin || !CIBLE.test(url.pathname)) return;

      event.preventDefault();
      event.stopPropagation();
      window.history.pushState({ ...(window.history.state ?? {}), __lecteurPdf: true }, "");
      historique.current = true;
      setDocument({
        adresse: url.pathname + url.search,
        titre: lien.getAttribute("title") || lien.textContent?.trim() || "Document",
      });
    }

    function retour() {
      if (historique.current && !window.history.state?.__lecteurPdf) {
        historique.current = false;
        setDocument(null);
      }
    }

    // Phase de capture sur `window` : avant le `onClick` de `next/link`.
    window.addEventListener("click", intercepter, true);
    window.addEventListener("popstate", retour);
    return () => {
      window.removeEventListener("click", intercepter, true);
      window.removeEventListener("popstate", retour);
    };
  }, []);

  const fermer = useCallback(() => {
    if (historique.current) window.history.back();
    else setDocument(null);
  }, []);

  if (!document) return null;
  return <Visionneuse key={document.adresse} document={document} fermer={fermer} />;
}

function Visionneuse({ document: doc, fermer }: { document: Document; fermer: () => void }) {
  const [etat, setEtat] = useState<Etat>({ phase: "chargement" });
  const bouton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    bouton.current?.focus();
    const precedent = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    const clavier = (event: KeyboardEvent) => {
      if (event.key === "Escape") fermer();
    };
    window.addEventListener("keydown", clavier);
    return () => {
      window.document.body.style.overflow = precedent;
      window.removeEventListener("keydown", clavier);
    };
  }, [fermer]);

  useEffect(() => {
    let annule = false;
    let urlImage: string | null = null;

    (async () => {
      try {
        const reponse = await fetch(doc.adresse, { credentials: "same-origin" });
        if (!reponse.ok) throw new Error(String(reponse.status));
        const type = reponse.headers.get("Content-Type")?.split(";")[0] ?? "application/octet-stream";
        const repli = doc.adresse.endsWith("/restitution") ? "restitution.pdf" : "document";
        const fichier = new File([await reponse.blob()], nomDepuis(reponse.headers.get("Content-Disposition"), repli), {
          type,
        });
        if (annule) return;
        if (type === "application/pdf") setEtat({ phase: "pdf", fichier });
        else if (type.startsWith("image/")) {
          urlImage = URL.createObjectURL(fichier);
          setEtat({ phase: "image", fichier, url: urlImage });
        } else setEtat({ phase: "autre", fichier });
      } catch {
        if (!annule) {
          setEtat({
            phase: "erreur",
            message: navigator.onLine
              ? "Ce document n'a pas pu être ouvert."
              : "Hors ligne : ce document n'a pas encore été ouvert sur cet appareil.",
          });
        }
      }
    })();

    return () => {
      annule = true;
      if (urlImage) URL.revokeObjectURL(urlImage);
    };
  }, [doc.adresse]);

  const fichier = "fichier" in etat ? etat.fichier : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={doc.titre}
      className="fixed inset-0 z-[70] flex flex-col bg-obsidian text-foreground"
    >
      <div className="flex items-center gap-2 border-b border-dark-gray px-3 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))]">
        <button
          ref={bouton}
          type="button"
          onClick={fermer}
          aria-label="Fermer le document"
          className="grid h-10 w-10 shrink-0 place-items-center text-mid-gray hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-secondary"
        >
          <X aria-hidden className="h-5 w-5" strokeWidth={1.8} />
        </button>
        <p className="min-w-0 flex-1 truncate font-inter-tight text-sm">{fichier?.name ?? doc.titre}</p>
        {fichier ? <Actions fichier={fichier} /> : null}
      </div>

      <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-jet/40 pb-[env(safe-area-inset-bottom)]">
        {etat.phase === "chargement" ? (
          <p role="status" className="p-6 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
            Chargement…
          </p>
        ) : etat.phase === "erreur" ? (
          <p role="alert" className="p-6 font-inter-tight text-sm text-mid-gray">
            {etat.message}
          </p>
        ) : etat.phase === "pdf" ? (
          <PagesPdf fichier={etat.fichier} />
        ) : etat.phase === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob local, hors de l'optimiseur d'images
          <img src={etat.url} alt={doc.titre} className="mx-auto block max-w-full" />
        ) : (
          <p className="p-6 font-inter-tight text-sm text-mid-gray">
            Ce format ne s&rsquo;affiche pas ici : enregistrez-le ou partagez-le vers
            l&rsquo;application qui l&rsquo;ouvre.
          </p>
        )}
      </div>
    </div>
  );
}

const ACTION =
  "inline-flex h-10 items-center gap-1.5 px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-secondary";

function Actions({ fichier }: { fichier: File }) {
  const [url, setUrl] = useState<string | null>(null);
  const partageable =
    typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({ files: [fichier] });

  useEffect(() => {
    const adresse = URL.createObjectURL(fichier);
    setUrl(adresse);
    return () => URL.revokeObjectURL(adresse);
  }, [fichier]);

  async function partager() {
    try {
      await navigator.share({ files: [fichier], title: fichier.name });
    } catch {
      // Partage annulé : rien à signaler.
    }
  }

  return (
    <>
      {partageable ? (
        <button type="button" onClick={partager} className={ACTION}>
          <Share aria-hidden className="h-4 w-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">Partager</span>
          <span className="sr-only sm:hidden">Partager</span>
        </button>
      ) : null}
      {url ? (
        <a href={url} download={fichier.name} className={ACTION}>
          <Download aria-hidden className="h-4 w-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">Enregistrer</span>
          <span className="sr-only sm:hidden">Enregistrer</span>
        </a>
      ) : null}
    </>
  );
}

/** Les pages d'un PDF, rendues l'une après l'autre à la largeur de l'écran. */
function PagesPdf({ fichier }: { fichier: File }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    let annule = false;
    let detruire: (() => void) | null = null;

    (async () => {
      try {
        // Build « legacy » : il tourne aussi sur les Safari d'iPhone plus anciens.
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const tache = pdfjs.getDocument({ data: new Uint8Array(await fichier.arrayBuffer()) });
        detruire = () => void tache.destroy();
        const pdf = await tache.promise;
        const cible = conteneur.current;
        if (!cible || annule) return;

        const largeur = Math.min(cible.clientWidth - 16, 1000);
        const densite = Math.min(window.devicePixelRatio || 1, 2);

        for (let numero = 1; numero <= pdf.numPages && !annule; numero++) {
          const page = await pdf.getPage(numero);
          const base = page.getViewport({ scale: 1 });
          const vue = page.getViewport({ scale: (largeur / base.width) * densite });
          const toile = window.document.createElement("canvas");
          toile.width = Math.floor(vue.width);
          toile.height = Math.floor(vue.height);
          toile.style.width = `${Math.floor(vue.width / densite)}px`;
          toile.setAttribute("aria-label", `Page ${numero} sur ${pdf.numPages}`);
          toile.setAttribute("role", "img");
          toile.className = "mx-auto my-2 block bg-white shadow";
          cible.appendChild(toile);
          await page.render({ canvas: toile, viewport: vue }).promise;
        }
      } catch {
        if (!annule) setErreur(true);
      }
    })();

    return () => {
      annule = true;
      detruire?.();
    };
  }, [fichier]);

  return (
    <>
      {erreur ? (
        <p role="alert" className="p-6 font-inter-tight text-sm text-mid-gray">
          Ce PDF n&rsquo;a pas pu être affiché : enregistrez-le ou partagez-le pour l&rsquo;ouvrir.
        </p>
      ) : null}
      <div ref={conteneur} className="px-2 py-2" />
    </>
  );
}
