import { Hr, Link, Section, Text } from "@react-email/components";
import type { Lettre } from "@sentinelle/lettre/schema";
import { Layout } from "./Layout";
import { COLORS, FONTS, styles } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Gabarit d'un numéro de la lettre de veille.
//
// Onze parties, dans l'ordre de lecture : titre → méthode → chapeau → le site
// en une phrase → les tendances → la synthèse → les cinq axes → l'échéancier
// → les trois questions → les sources → le périmètre. La génération, elle, écrit
// les axes d'abord (ils établissent le profil), mais la lettre se lit dans cet
// ordre-ci.
//
// Deux choses ne sont jamais rendues ici, et c'est délibéré :
//
//  · **l'encart de production** (hypothèses, points à confirmer, consommation) —
//    il est écrit pour la personne qui relit, pas pour le client ;
//  · **le dossier de collecte** — la lettre en porte les sources, pas la matière
//    brute.
//
// La lettre vise 1 500 à 2 250 mots (format court : cinq axes). Gmail tronque un
// e-mail au-delà d'environ 102 Ko et affiche « message tronqué » : c'est la
// limite à surveiller si les numéros s'allongent encore. Le rendu figé à la
// validation est mesuré à l'envoi et le poids apparaît dans l'admin.
// ─────────────────────────────────────────────────────────────────────────────

export interface NewsletterEmailProps {
  lettre: Lettre;
  siteUrl?: string | null;
  /** Date de parution — celle de la période, jamais celle de l'expédition. */
  issueDate: Date;
  /**
   * Mode lettre-échantillon du scan public : même numéro, même gabarit, mais
   * l'enveloppe dit ce que c'est (généré automatiquement, non relu, site pas
   * sous surveillance) et un encart final annonce ce que l'abonnement ajoute.
   * `rapportUrl` ramène au rapport en ligne quand la lettre part par e-mail.
   */
  echantillon?: { rapportUrl?: string | null };
}

const STATUT_STYLE: Record<Lettre["axes"][number]["statut"], { label: string; color: string }> = {
  agir: { label: "Agir", color: "#ff8a7a" },
  surveiller: { label: "Surveiller", color: "#f5c451" },
  nonConcerne: { label: "Non concerné", color: "#7fd8a4" },
};

const SENS_LABEL: Record<Lettre["tendances"]["duMois"][number]["sens"], string> = {
  opportunite: "Opportunité",
  menace: "Menace",
  "les-deux": "Opportunité et menace",
};

const TRAJECTOIRE_LABEL: Record<
  Lettre["tendances"]["marche"][number]["trajectoire"],
  string
> = {
  hausse: "↗ en hausse",
  stable: "→ stable",
  baisse: "↘ en baisse",
  incertain: "? incertain",
};

function paragraphes(texte: string): string[] {
  return texte
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function Prose({ texte }: { texte: string }) {
  return (
    <>
      {paragraphes(texte).map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </>
  );
}

function Partie({ numero, titre }: { numero: string; titre: string }) {
  return (
    <Text style={{ ...styles.label, color: COLORS.accent, margin: "0 0 16px" }}>
      {numero} · {titre}
    </Text>
  );
}

export function NewsletterEmail({ lettre, siteUrl, issueDate, echantillon }: NewsletterEmailProps) {
  const aAgir = lettre.axes.filter((axe) => axe.statut === "agir").length;

  return (
    <Layout
      preview={
        aAgir > 0
          ? `${aAgir} point(s) à traiter ce mois-ci. ${lettre.synthese.actions[0]?.action ?? ""}`
          : "Rien à traiter ce mois-ci — voici pourquoi."
      }
      kicker={echantillon ? "Lettre de veille · échantillon" : "Lettre de veille"}
      sentAt={issueDate}
      siteUrl={siteUrl}
      reason={
        echantillon
          ? "Vous lisez un échantillon généré à partir d'une analyse externe " +
            "publique de votre site, sans relecture humaine. Votre site n'est " +
            "pas sous surveillance — c'est la démonstration de ce que " +
            "l'abonnement Sentinelle vous livrerait."
          : undefined
      }
    >
      <Section style={styles.section}>
        <Text style={styles.h1}>{lettre.titre}</Text>
        <Text style={{ ...styles.footer, fontStyle: "italic", margin: "0 0 20px" }}>
          {lettre.ligneContexte}
        </Text>
        <Prose texte={lettre.chapeau} />
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={styles.label}>Votre site en une phrase</Text>
        <Section style={styles.panel}>
          <Text
            style={{
              ...styles.paragraph,
              color: COLORS.fg,
              fontFamily: FONTS.title,
              fontSize: "17px",
              margin: 0,
            }}
          >
            {lettre.siteEnUnePhrase}
          </Text>
        </Section>
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Partie numero="Première partie" titre="Tendances : opportunités et menaces" />

        <Text style={styles.label}>Les tendances du mois</Text>
        {lettre.tendances.duMois.map((tendance, index) => (
          <Section key={index} style={{ margin: "0 0 16px" }}>
            <Text style={{ ...styles.paragraph, color: COLORS.fg, margin: "0 0 4px" }}>
              {tendance.tendance}
            </Text>
            <Text style={{ ...styles.footer, margin: "0 0 4px" }}>{tendance.faitDate}</Text>
            <Text style={{ ...styles.muted, margin: 0 }}>
              <span style={{ color: COLORS.accent }}>{SENS_LABEL[tendance.sens]}</span> —{" "}
              {tendance.pourCeSite}
            </Text>
          </Section>
        ))}

        <Hr style={{ ...styles.rule, margin: "20px 0" }} />

        <Text style={styles.label}>Le marché des solutions : où va chaque famille</Text>
        {lettre.tendances.marche.map((famille, index) => (
          <Section key={index} style={{ margin: "0 0 14px" }}>
            <Text style={{ ...styles.paragraph, color: COLORS.fg, margin: "0 0 2px" }}>
              {famille.famille} · {TRAJECTOIRE_LABEL[famille.trajectoire]}
            </Text>
            <Text style={{ ...styles.footer, margin: "0 0 4px" }}>{famille.mouvement}</Text>
            <Text style={{ ...styles.muted, margin: 0 }}>{famille.lecture}</Text>
          </Section>
        ))}

        {lettre.tendances.signauxDeDemande.length > 0 && (
          <>
            <Text style={{ ...styles.label, margin: "20px 0 8px" }}>Signaux de demande</Text>
            {lettre.tendances.signauxDeDemande.map((signal, index) => (
              <Text key={index} style={{ ...styles.muted, margin: "0 0 6px" }}>
                {signal}
              </Text>
            ))}
          </>
        )}

        <Hr style={{ ...styles.rule, margin: "20px 0" }} />

        <Text style={styles.label}>Les tendances de fond</Text>
        {lettre.tendances.deFond.map((fond, index) => (
          <Section key={index} style={{ margin: "0 0 14px" }}>
            <Text style={{ ...styles.paragraph, color: COLORS.fg, margin: "0 0 2px" }}>
              {fond.mouvement}
            </Text>
            <Text style={{ ...styles.footer, margin: "0 0 4px" }}>{fond.faitDate}</Text>
            <Text style={{ ...styles.muted, margin: 0 }}>{fond.qualification}</Text>
          </Section>
        ))}

        {lettre.tendances.ceQuiNeChangePas.length > 0 && (
          <>
            <Text style={{ ...styles.label, margin: "20px 0 8px" }}>Ce qui ne change pas</Text>
            {lettre.tendances.ceQuiNeChangePas.map((invariant, index) => (
              <Text key={index} style={{ ...styles.muted, margin: "0 0 6px" }}>
                {invariant}
              </Text>
            ))}
          </>
        )}
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Partie numero="Deuxième partie" titre="Synthèse : actions, scénarios, décision" />

        <Text style={styles.label}>Ce qui compte ce mois-ci</Text>
        {lettre.synthese.actions.map((action, index) => (
          <Section key={index} style={{ ...styles.panel, margin: "0 0 12px" }}>
            <Text
              style={{
                ...styles.paragraph,
                color: COLORS.fg,
                fontFamily: FONTS.title,
                fontSize: "16px",
                margin: "0 0 6px",
              }}
            >
              {action.action}
            </Text>
            <Text style={{ ...styles.muted, margin: 0 }}>
              <span style={{ color: COLORS.accent }}>{action.horizon}</span> — {action.pourquoi}
            </Text>
          </Section>
        ))}
        {lettre.synthese.reste.trim() !== "" && (
          <Text style={{ ...styles.muted, margin: "8px 0 0" }}>{lettre.synthese.reste}</Text>
        )}

        <Text style={{ ...styles.label, margin: "24px 0 8px" }}>Trois scénarios</Text>
        {lettre.synthese.scenarios.map((scenario, index) => (
          <Section key={index} style={{ margin: "0 0 20px" }}>
            <Text style={{ ...styles.paragraph, color: COLORS.fg, margin: "0 0 6px" }}>
              {scenario.nom}
            </Text>
            <Text style={{ ...styles.muted, margin: "0 0 4px" }}>
              Ce qui le commande : {scenario.commandePar}
            </Text>
            <Text style={{ ...styles.muted, margin: "0 0 4px" }}>
              Ce qui l&apos;appuie : {scenario.faitsDeMarche}
            </Text>
            <Text style={{ ...styles.muted, margin: "0 0 4px" }}>
              Axes couverts : {scenario.axesCouverts}
            </Text>
            <Text style={{ ...styles.muted, margin: "0 0 4px" }}>
              Ordre de coût : {scenario.ordreDeCout} — retour attendu : {scenario.retourAttendu}
            </Text>
            <Text style={{ ...styles.muted, color: COLORS.accent, margin: 0 }}>
              On y va si : {scenario.conditionDeDeclenchement}
            </Text>
          </Section>
        ))}

        {lettre.synthese.aDifferer.length > 0 && (
          <>
            <Text style={{ ...styles.label, margin: "20px 0 8px" }}>À différer</Text>
            {lettre.synthese.aDifferer.map((choix, index) => (
              <Text key={index} style={{ ...styles.muted, margin: "0 0 6px" }}>
                {choix.choix} — {choix.raison}
              </Text>
            ))}
          </>
        )}

        <Text style={{ ...styles.label, margin: "24px 0 8px" }}>
          Budget et retour sur investissement — la méthode
        </Text>
        <Text style={styles.paragraph}>{lettre.synthese.budget.coutTroisACinqAns}</Text>
        {lettre.synthese.budget.indicateurs.map((indicateur, index) => (
          <Text key={index} style={{ ...styles.muted, margin: "0 0 6px" }}>
            {indicateur}
          </Text>
        ))}
        <Text style={styles.paragraph}>{lettre.synthese.budget.pointDEquilibre}</Text>
        <Text style={{ ...styles.muted, margin: 0 }}>
          {lettre.synthese.budget.siPasDeChiffres}
        </Text>

        <Text style={{ ...styles.label, margin: "24px 0 8px" }}>Comment décider</Text>
        {lettre.synthese.commentDecider.map((entree, index) => (
          <Text key={index} style={{ ...styles.muted, margin: "0 0 8px" }}>
            <span style={{ color: COLORS.fgSoft }}>{entree.entree}</span> — {entree.ceQuElleTeste}
            {entree.date.trim() !== "" ? ` (${entree.date})` : ""}
          </Text>
        ))}
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Partie numero="Troisième partie" titre="Votre site lu par les cinq axes" />

        {lettre.axes.map((axe) => {
          const statut = STATUT_STYLE[axe.statut];
          return (
            <Section key={axe.numero} style={{ margin: "0 0 26px" }}>
              <Text style={{ ...styles.label, margin: "0 0 6px" }}>
                Axe {axe.numero} · {axe.nom}
              </Text>
              <Text
                style={{
                  ...styles.muted,
                  fontStyle: "italic",
                  color: COLORS.fgSoft,
                  margin: "0 0 10px",
                }}
              >
                {axe.question}
              </Text>
              <Prose texte={axe.analyse} />
              <Text style={{ ...styles.muted, color: statut.color, margin: 0 }}>
                ● {statut.label}
                {axe.horizon.trim() !== "" ? ` — ${axe.horizon}` : ""}
              </Text>
            </Section>
          );
        })}
      </Section>

      {lettre.echeancier.length > 0 && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>Échéancier à six mois</Text>
            {lettre.echeancier.map((entree, index) => (
              <Text key={index} style={{ ...styles.muted, margin: "0 0 6px" }}>
                <span style={{ color: COLORS.fgSoft }}>{entree.date}</span> — {entree.echeance}{" "}
                <span style={{ color: COLORS.faint }}>(axe {entree.axe})</span>
              </Text>
            ))}
          </Section>
        </>
      )}

      {lettre.questions.length > 0 && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>Trois questions à poser à votre prestataire</Text>
            {lettre.questions.map((question, index) => (
              <Text key={index} style={{ ...styles.paragraph, margin: "0 0 10px" }}>
                {index + 1}. {question.question}{" "}
                <span style={{ color: COLORS.faint }}>
                  (axe{question.axes.length > 1 ? "s" : ""} {question.axes.join(", ")})
                </span>
              </Text>
            ))}
          </Section>
        </>
      )}

      {lettre.sources.length > 0 && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>Sources</Text>
            {lettre.sources.map((groupe, index) => (
              <Section key={index} style={{ margin: "0 0 14px" }}>
                <Text style={{ ...styles.muted, color: COLORS.fgSoft, margin: "0 0 4px" }}>
                  {groupe.theme}
                </Text>
                {groupe.faits.map((fait, faitIndex) => (
                  <Text key={faitIndex} style={{ ...styles.footer, margin: "0 0 4px" }}>
                    {fait.enonce} — {fait.date} —{" "}
                    <Link href={fait.source} style={styles.link}>
                      {fait.source}
                    </Link>
                  </Text>
                ))}
              </Section>
            ))}
          </Section>
        </>
      )}

      {echantillon && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>Ce que l&apos;abonnement ajoute à cet échantillon</Text>
            <Text style={{ ...styles.muted, margin: 0 }}>
              Une fiche technique complétée avec vous (ce qu&apos;une analyse
              externe ne voit pas), des alertes entre les numéros quand un fait
              vous concerne, la continuité d&apos;un numéro à l&apos;autre — et
              une relecture humaine avant chaque envoi. Cet échantillon, lui,
              est généré automatiquement et n&apos;est pas relu.
            </Text>
            {echantillon.rapportUrl && (
              <Text style={{ ...styles.muted, margin: "14px 0 0" }}>
                Le rapport complet — composants détectés et activation de la
                surveillance — reste en ligne :{" "}
                <Link href={echantillon.rapportUrl} style={styles.link}>
                  revoir votre rapport
                </Link>
                .
              </Text>
            )}
          </Section>
        </>
      )}

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={{ ...styles.footer, fontStyle: "italic", margin: 0 }}>
          {lettre.ligneCloture}
        </Text>
      </Section>
    </Layout>
  );
}

export default NewsletterEmail;
