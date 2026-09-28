import { Hr, Link, Section, Text } from "@react-email/components";
import type { DiagnosticCase, DiagnosticTonalite, ScanDiagnostic } from "@sentinelle/types";
import {
  BESOIN_LABELS,
  CASES_TITRES,
  ECHANGE_URL,
  PRESTATIONS,
  TONALITE_LABELS,
  techniqueDe,
} from "@sentinelle/audit/prestations";
import { Layout, SITE_URL } from "./Layout";
import { COLORS, FONTS, styles } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// L'audit du scan public (la grille en quatre cases), envoyé à l'adresse
// laissée sur la page d'attente ou dans le popup de fin.
//
// Même contenu que le rapport en ligne, dans le même ordre : la réponse
// d'abord, puis les trois cases qui la justifient et la recommandation. Le
// détail (mesures comparées, sources, composants) reste en ligne : l'e-mail y
// ramène.
// ─────────────────────────────────────────────────────────────────────────────

export type DiagnosticDone = Extract<ScanDiagnostic, { status: "done" }>;

export interface AuditEmailProps {
  diagnostic: DiagnosticDone;
  siteUrl: string;
  /** Nom de l'organisation lu sur le site, à défaut son domaine. */
  nom: string;
  genereLe: Date;
  /** Adresse du rapport en ligne (`/scan/[id]`). */
  rapportUrl: string;
}

const TONALITE_COULEURS: Record<DiagnosticTonalite, string> = {
  solide: "#7fd8a4",
  a_renforcer: "#f5c451",
  fragile: "#ff8a7a",
  indetermine: COLORS.faint,
};

function Case({
  numero,
  titre,
  etiquette,
  couleur,
  lignes,
}: {
  numero: string;
  titre: string;
  etiquette: string;
  couleur: string;
  lignes: string[];
}) {
  return (
    <Section style={{ margin: "0 0 26px" }}>
      <Text style={{ ...styles.label, margin: "0 0 8px" }}>
        {numero} · {titre}
      </Text>
      {lignes.map((ligne) => (
        <Text key={ligne} style={{ ...styles.paragraph, margin: "0 0 8px" }}>
          {ligne}
        </Text>
      ))}
      <Text style={{ ...styles.muted, color: couleur, margin: 0 }}>● {etiquette}</Text>
    </Section>
  );
}

function caseProps(contenu: DiagnosticCase) {
  return {
    etiquette: TONALITE_LABELS[contenu.tonalite],
    couleur: TONALITE_COULEURS[contenu.tonalite],
    lignes: contenu.lignes,
  };
}

export function AuditEmail({ diagnostic, siteUrl, nom, genereLe, rapportUrl }: AuditEmailProps) {
  const { conclusion } = diagnostic;
  const pack = PRESTATIONS[conclusion.issue];
  const besoin = BESOIN_LABELS[conclusion.besoin];

  return (
    <Layout
      preview={`${pack.nom} : ${besoin.toLowerCase()}. ${conclusion.objectif}`}
      kicker="Audit de votre site"
      sentAt={genereLe}
      siteUrl={siteUrl}
      reason={
        "Vous recevez ce message parce que vous avez demandé l'envoi de cet audit " +
        "sur next-impact.digital. Aucun autre envoi ne suivra. Une question ? " +
        "Répondez à cet e-mail, il arrive directement chez Agathe."
      }
    >
      <Section style={styles.section}>
        <Text style={styles.h1}>Audit de {nom}</Text>
        <Text style={styles.label}>Ma réponse</Text>
        <Section style={styles.panel}>
          <Text
            style={{
              ...styles.paragraph,
              color: COLORS.fg,
              fontFamily: FONTS.title,
              fontSize: "20px",
              margin: "0 0 8px",
            }}
          >
            {pack.nom} : {besoin.toLowerCase()}
          </Text>
          {conclusion.issue === "refonte" && diagnostic.refonte && (
            <Text style={{ ...styles.paragraph, margin: "0 0 8px" }}>
              <span style={{ color: COLORS.muted }}>
                {techniqueDe("refonte", diagnostic.refonte)} :{" "}
              </span>
              {diagnostic.refonte.raison}
            </Text>
          )}
          <Text style={{ ...styles.paragraph, margin: 0 }}>
            <span style={{ color: COLORS.muted }}>Objectif : </span>
            {conclusion.objectif}
          </Text>
        </Section>
        <Section style={{ margin: "20px 0 0" }}>
          <Link href={ECHANGE_URL} style={styles.button}>
            Échange gratuit
          </Link>
        </Section>
        <Text style={{ ...styles.muted, margin: "14px 0 0" }}>
          <Link href={`${SITE_URL}${pack.href}`} style={styles.link}>
            Voir l&apos;offre {pack.nom}
          </Link>
        </Text>
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Case numero="1" titre={CASES_TITRES.organisation} {...caseProps(diagnostic.organisation)} />
        <Case numero="2" titre={CASES_TITRES.ecosysteme} {...caseProps(diagnostic.ecosysteme)} />
        <Case numero="3" titre={CASES_TITRES.dispositif} {...caseProps(diagnostic.dispositif)} />
        <Case
          numero="4"
          titre={`Ma recommandation : ${pack.nom}`}
          etiquette={besoin}
          couleur={COLORS.accent}
          lignes={conclusion.lignes}
        />
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={{ ...styles.muted, margin: "0 0 14px" }}>
          Le détail (mesures comparées à vos concurrents, sources, composants
          détectés) reste en ligne :{" "}
          <Link href={rapportUrl} style={styles.link}>
            revoir votre audit
          </Link>
          .
        </Text>
        <Text style={{ ...styles.footer, fontStyle: "italic", margin: 0 }}>
          Diagnostic généré automatiquement à partir d&apos;une analyse externe
          {diagnostic.sources.length > 0 ? " et de recherches publiques" : ""}, non
          relu. Il ne voit ni vos chiffres, ni vos objectifs, ni votre
          organisation interne : c&apos;est un premier regard, pas un audit
          approfondi.
        </Text>
      </Section>
    </Layout>
  );
}

export default AuditEmail;
