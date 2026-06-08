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
import { cn } from "@/lib/utils";
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

const fieldClass =
  "w-full bg-jet border border-dark-gray px-3.5 py-2.5 font-inter-tight text-sm text-foreground placeholder:text-mid-gray outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent-secondary focus-visible:border-accent-secondary";

const labelClass = "block mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray";

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
    <div className="h-full bg-obsidian">
      {/* Header */}
      <div className="border-b border-dark-gray px-6 py-6 lg:px-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
          {isEn ? "Contact form" : "Formulaire de contact"}
        </p>
        <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Pick the topic that fits your request — I'll route the message accordingly."
            : "Choisissez l'objet de votre demande — votre message sera orienté en conséquence."}
        </p>
      </div>

      <div className="px-6 py-8 lg:px-8">
        {status === "sent" ? (
          <div className="flex flex-col items-start gap-3 border border-dark-gray bg-jet p-6">
            <CheckCircle2 size={24} className="text-accent-secondary" />
            <h3 className="text-2xl font-light tracking-tight text-foreground">
              {isEn ? "Message sent" : "Message envoyé"}
            </h3>
            <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
              {isEn
                ? "Thanks — I'll get back to you within 24h. A confirmation has been sent to your inbox."
                : "Merci — je reviens vers vous sous 24h. Une confirmation a été envoyée dans votre boîte mail."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {/* Subject selector */}
            <div>
              <div className={labelClass}>
                {isEn ? "Subject of your request" : "Objet de votre demande"}{" "}
                <span className="text-accent-secondary">*</span>
              </div>
              <div className="grid grid-cols-1 border border-dark-gray sm:grid-cols-2">
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
                      className={cn(
                        "flex items-start gap-2.5 border-l-2 px-4 py-4 text-left transition-colors",
                        selected
                          ? "border-l-accent-secondary bg-jet"
                          : "border-l-transparent hover:bg-jet/50",
                        col === 0 && "sm:border-r sm:border-r-dark-gray",
                        row < totalRows - 1 && "border-b border-b-dark-gray",
                      )}
                    >
                      <Icon
                        size={15}
                        className={cn(
                          "mt-0.5 shrink-0",
                          selected ? "text-accent-secondary" : "text-mid-gray",
                        )}
                      />
                      <div>
                        <p className="mb-0.5 text-[13px] font-medium text-foreground">
                          {copy.label}
                        </p>
                        <p className="font-inter-tight text-xs leading-snug text-mid-gray">
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
                  className="flex flex-col gap-5"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>
                        {isEn ? "Your name" : "Votre nom"}{" "}
                        <span className="text-accent-secondary">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isEn ? "Alice Martin" : "Alice Martin"}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelClass}>
                        {isEn ? "Your email" : "Votre email"}{" "}
                        <span className="text-accent-secondary">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isEn ? "alice@company.com" : "alice@organisation.com"}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-org" className={labelClass}>
                      {isEn ? "Organization (optional)" : "Organisation (optionnel)"}
                    </label>
                    <input
                      id="contact-org"
                      type="text"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      placeholder={isEn ? "Atelier Martin & Co" : "Atelier Martin & Co"}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={labelClass}>
                      {isEn ? "Your message" : "Votre message"}{" "}
                      <span className="text-accent-secondary">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={subjectCopy.placeholder}
                      className={cn(fieldClass, "resize-y")}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex h-11 items-center gap-2 border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright disabled:opacity-60"
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
                      {isEn ? "Reply within 24h · Free, no strings attached" : "Réponse sous 24h · Gratuit, sans engagement"}
                    </p>
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 border border-accent-secondary bg-accent-secondary/5 px-4 py-3 font-inter-tight text-[13px] text-accent-secondary">
                      <AlertCircle size={14} className="shrink-0" />
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
