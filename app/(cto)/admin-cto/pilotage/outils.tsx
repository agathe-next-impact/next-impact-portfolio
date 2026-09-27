"use client";

import { useActionState } from "react";
import { buttonClass, Label, Notice, Panel } from "../../espace-direction/ui";
import { prevenir, synchroniser, type RapportState } from "./actions";
import { Points } from "./points";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux gestes d'exploitation, depuis l'écran plutôt que depuis le terminal :
// synchroniser l'atelier Notion et prévenir les clients. Mêmes fonctions que
// `npm run cto:sync` et `npm run cto:notify`, même séparation : la synchro
// n'envoie rien, la notification ne lit pas Notion.
//
// Chaque panneau propose d'abord « à blanc » : on relit le rapport, puis on
// applique. Le rapport reste affiché sous les boutons jusqu'au clic suivant.
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL: RapportState = { ok: true, lines: [], warnings: [], alerts: [], at: null };

function Rapport({ state }: { state: RapportState }) {
  if (!state.at) return null;
  return (
    <div className="mt-4 space-y-3" aria-live="polite">
      <Notice tone={state.ok ? "succes" : "erreur"}>
        {state.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </Notice>
      <Points warnings={state.warnings} alerts={state.alerts} />
    </div>
  );
}

function Outil({
  titre,
  texte,
  action,
  libelle,
  enCours,
}: {
  titre: string;
  texte: string;
  action: (prev: RapportState, formData: FormData) => Promise<RapportState>;
  libelle: string;
  enCours: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);

  return (
    <Panel className="p-5">
      <Label>{titre}</Label>
      <p className="mt-2 max-w-prose font-inter-tight text-sm text-mid-gray">{texte}</p>
      <form action={formAction} className="mt-4 flex flex-wrap gap-3">
        <button type="submit" name="mode" value="a-blanc" className={buttonClass.ghost} disabled={pending}>
          À blanc
        </button>
        <button type="submit" name="mode" value="appliquer" className={buttonClass.primary} disabled={pending}>
          {pending ? enCours : libelle}
        </button>
      </form>
      <Rapport state={state} />
    </Panel>
  );
}

export function OutilsExploitation() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Outil
        titre="Synchro Notion"
        texte="Lit l'atelier maintenant, sans attendre le balayage de 4 h : nouvelles fiches, personnes, livrables. N'envoie aucun e-mail. Peut prendre une minute avec des audits."
        action={synchroniser}
        libelle="Synchroniser"
        enCours="Synchro en cours…"
      />
      <Outil
        titre="Prévenir les clients"
        texte="Un e-mail par personne active des accompagnements actifs qui ont du nouveau depuis leur dernière notification. Des nombres et un lien, jamais de contenu."
        action={prevenir}
        libelle="Prévenir"
        enCours="Envoi en cours…"
      />
    </div>
  );
}
