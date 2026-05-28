"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Layers,
  MessageCircle,
  Scale,
  Smartphone,
  SearchCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type SubjectKey = "site-web" | "application" | "oeth" | "audit-ia" | "question-technique" | "autre";

interface SubjectConfig {
  icon: typeof Globe;
  fr: { label: string; description: string; placeholder: string };
  en: { label: string; description: string; placeholder: string };
}

const SUBJECTS: Record<SubjectKey, SubjectConfig> = {
  "site-web": { icon: Globe, fr: { label: "Site web", description: "Création, refonte, modernisation Headless WordPress", placeholder: "Décrivez votre projet de site : type (vitrine, institutionnel, e-commerce), volumétrie, délais, contraintes éventuelles…" }, en: { label: "Website", description: "New build, redesign, Headless WordPress modernization", placeholder: "Describe your website project: type (brochure, institutional, e-commerce), traffic, timing, constraints…" } },
  application: { icon: Smartphone, fr: { label: "Application sur-mesure", description: "Web app (marketplace, plateforme métier) ou app mobile (PWA)", placeholder: "Décrivez votre projet applicatif : logique métier, comptes utilisateurs, mobile / web, fonctionnalités clés…" }, en: { label: "Custom application", description: "Web app (marketplace, business platform) or mobile app (PWA)", placeholder: "Describe your application project: business logic, user accounts, mobile / web, key features…" } },
  oeth: { icon: Scale, fr: { label: "Avantage OETH", description: "Déduction AGEFIPH 30 % via sous-traitance TIH", placeholder: "Précisez votre situation : effectif, taux d'emploi TH actuel, montant de contribution AGEFIPH, projet web envisagé…" }, en: { label: "OETH benefit", description: "30% AGEFIPH deduction via TIH subcontracting", placeholder: "Tell us about your situation: workforce size, current disabled-worker employment rate, AGEFIPH contribution, web project considered…" } },
  "audit-ia": { icon: SearchCheck, fr: { label: "Audit IA gratuit", description: "Diagnostic performance, SEO et conversion de votre site", placeholder: "Indiquez l'URL du site à auditer et les points sur lesquels vous souhaitez un éclairage particulier." }, en: { label: "Free AI audit", description: "Performance, SEO and conversion diagnostic of your site", placeholder: "Share the URL of the site to audit and the specific points you'd like clarified." } },
  "question-technique": { icon: Layers, fr: { label: "Question technique", description: "Conseil, accompagnement, collaboration freelance", placeholder: "Décrivez votre question, votre contexte technique ou la nature de la collaboration envisagée." }, en: { label: "Technical question", description: "Advice, support, freelance collaboration", placeholder: "Describe your question, technical context or the nature of the collaboration you have in mind." } },
  autre: { icon: MessageCircle, fr: { label: "Autre", description: "Toute autre demande", placeholder: "Dites-moi en plus sur votre demande…" }, en: { label: "Other", description: "Any other request", placeholder: "Tell me more about your request…" } },
};

const SUBJECT_ORDER: SubjectKey[] = ["site-web", "application", "oeth", "audit-ia", "question-technique", "autre"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "var(--sans)",
  color: "var(--ink)",
  background: "var(--paper)",
  border: "1px solid var(--rule)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--mono)",
  fontSize: 9,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--muted-color)",
  marginBottom: 8,
};

export default function MultiSubjectContactForm() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const [subject, setSubject] = useState<SubjectKey | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const subjectConfig = subject ? SUBJECTS[subject] : null;
  const subjectCopy = useMemo(() => {
    if (!subjectConfig) return null;
    return isEn ? subjectConfig.en : subjectConfig.fr;
  }, [subjectConfig, isEn]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject) return;
    setStatus("loading");
    const subjectLabel = (isEn ? SUBJECTS[subject].en : SUBJECTS[subject].fr).label;
    const fullMessage =
      `[${isEn ? "Subject" : "Objet"} : ${subjectLabel}]` +
      (organisation ? ` — ${isEn ? "Organization" : "Organisation"} : ${organisation}` : "") +
      `\n\n${message}`;
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message: fullMessage, subject: subjectLabel, locale }),
    });
    if (res.ok) setStatus("sent");
    else setStatus("error");
  };

  return (
    <div style={{ border: "1px solid var(--rule)" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-color)", marginBottom: 8 }}>
          {isEn ? "Contact form" : "Formulaire de contact"}
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65 }}>
          {isEn
            ? "Pick the topic that fits your request — I'll route the message accordingly."
            : "Choisissez l'objet de votre demande — votre message sera orienté en conséquence."}
        </p>
      </div>

      <div style={{ padding: "32px" }}>
        {status === "sent" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 12,
              padding: "24px",
              border: "1px solid var(--rule)",
              background: "var(--paper-2)",
            }}
          >
            <CheckCircle2 size={24} style={{ color: "var(--accent-color)" }} />
            <h3 className="ni-serif" style={{ fontSize: 24, color: "var(--ink)" }}>
              {isEn ? "Message sent" : "Message envoyé"}
            </h3>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65 }}>
              {isEn
                ? "Thanks — I'll get back to you within 24h. A confirmation has been sent to your inbox."
                : "Merci — je reviens vers vous sous 24h. Une confirmation a été envoyée dans votre boîte mail."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Subject selector */}
            <div>
              <div style={labelStyle}>
                {isEn ? "Subject of your request" : "Objet de votre demande"}{" "}
                <span style={{ color: "var(--accent-color)" }}>*</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid var(--rule)" }}>
                {SUBJECT_ORDER.map((key, i) => {
                  const config = SUBJECTS[key];
                  const copy = isEn ? config.en : config.fr;
                  const Icon = config.icon;
                  const selected = subject === key;
                  const col = i % 2;
                  const row = Math.floor(i / 2);
                  const totalRows = Math.ceil(SUBJECT_ORDER.length / 2);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSubject(key)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "16px 18px",
                        textAlign: "left",
                        cursor: "pointer",
                        background: selected ? "var(--paper-2)" : "transparent",
                        borderLeft: selected ? "3px solid var(--accent-color)" : "3px solid transparent",
                        borderRight: col === 0 ? "1px solid var(--rule)" : "none",
                        borderBottom: row < totalRows - 1 ? "1px solid var(--rule)" : "none",
                        borderTop: "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <Icon
                        size={15}
                        style={{ color: selected ? "var(--accent-color)" : "var(--muted-color)", flexShrink: 0, marginTop: 2 }}
                      />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>
                          {copy.label}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
                          {copy.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form fields — shown after subject selection */}
            <AnimatePresence mode="wait">
              {subject && subjectCopy && (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label htmlFor="contact-name" style={labelStyle}>
                        {isEn ? "Your name" : "Votre nom"}{" "}
                        <span style={{ color: "var(--accent-color)" }}>*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isEn ? "Alice Martin" : "Alice Martin"}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" style={labelStyle}>
                        {isEn ? "Your email" : "Votre email"}{" "}
                        <span style={{ color: "var(--accent-color)" }}>*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isEn ? "alice@company.com" : "alice@organisation.com"}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-org" style={labelStyle}>
                      {isEn ? "Organization (optional)" : "Organisation (optionnel)"}
                    </label>
                    <input
                      id="contact-org"
                      type="text"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      placeholder={isEn ? "Atelier Martin & Co" : "Atelier Martin & Co"}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" style={labelStyle}>
                      {isEn ? "Your message" : "Votre message"}{" "}
                      <span style={{ color: "var(--accent-color)" }}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={subjectCopy.placeholder}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn primary"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          {isEn ? "Sending…" : "Envoi en cours…"}
                        </>
                      ) : (
                        <>
                          {isEn ? "Send my message" : "Envoyer mon message"}
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--muted-color)", textTransform: "uppercase" }}>
                      {isEn ? "Reply within 24h · Free, no strings attached" : "Réponse sous 24h · Gratuit, sans engagement"}
                    </p>
                  </div>

                  {status === "error" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 16px",
                        border: "1px solid var(--accent-color)",
                        background: "rgba(216, 58, 26, 0.05)",
                        fontSize: 13,
                        color: "var(--accent-color)",
                      }}
                    >
                      <AlertCircle size={14} style={{ flexShrink: 0 }} />
                      {isEn
                        ? "Something went wrong. Please try again, or reach out via email or phone."
                        : "Une erreur est survenue. Réessayez ou contactez-moi par email ou téléphone."}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </div>
    </div>
  );
}
