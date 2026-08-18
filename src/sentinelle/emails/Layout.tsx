import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { COLORS, FONTS, formatDate, styles } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Enveloppe commune aux e-mails Sentinelle : en-tête, pied, mentions.
//
// Un seul endroit pour ce qui est vrai de tous les envois — l'identité, la
// raison pour laquelle le destinataire reçoit ce message, le lien de contact.
// Une alerte et un numéro de newsletter ne diffèrent que par leur contenu.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://next-impact.digital";

export interface LayoutProps {
  /** Texte d'aperçu affiché par le client mail après l'objet. */
  preview: string;
  /** Libellé mono en tête — « Alerte de veille », « Numéro du 15 août ». */
  kicker: string;
  sentAt: Date;
  /** Nom affiché du destinataire, quand on l'a. */
  siteUrl?: string | null;
  /**
   * Pourquoi le destinataire voit ce message. Par défaut : parce que son site
   * est sous surveillance — faux pour la lettre-échantillon du scan public,
   * qui fournit sa propre phrase.
   */
  reason?: string;
  children: ReactNode;
}

export function Layout({ preview, kicker, sentAt, siteUrl, reason, children }: LayoutProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={{ ...styles.section, paddingBottom: "18px" }}>
            <Text style={styles.kicker}>Sentinelle · {kicker}</Text>
            <Text
              style={{
                color: COLORS.faint,
                fontFamily: FONTS.mono,
                fontSize: "11px",
                letterSpacing: "0.14em",
                margin: "6px 0 0",
                textTransform: "uppercase",
              }}
            >
              {formatDate(sentAt)}
              {siteUrl ? ` · ${siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}` : ""}
            </Text>
          </Section>

          <Hr style={styles.rule} />

          {children}

          <Hr style={styles.rule} />

          <Section style={styles.section}>
            <Text style={styles.footer}>
              {reason ??
                "Vous recevez ce message parce que votre site est sous surveillance " +
                  "Sentinelle. Une question, un doute sur ce qui est écrit ? Répondez " +
                  "à cet e-mail, il arrive directement chez Agathe."}
            </Text>
            <Text style={styles.footer}>
              Next Impact Digital ·{" "}
              <Link href={SITE_URL} style={styles.link}>
                next-impact.digital
              </Link>{" "}
              ·{" "}
              <Link href={`${SITE_URL}/confidentialite`} style={styles.link}>
                confidentialité
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
