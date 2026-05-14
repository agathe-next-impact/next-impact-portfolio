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
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type SubjectKey =
  | "site-web"
  | "application"
  | "oeth"
  | "audit-ia"
  | "question-technique"
  | "autre";

interface SubjectConfig {
  icon: typeof Globe;
  fr: { label: string; description: string; placeholder: string };
  en: { label: string; description: string; placeholder: string };
}

const SUBJECTS: Record<SubjectKey, SubjectConfig> = {
  "site-web": {
    icon: Globe,
    fr: {
      label: "Site web",
      description: "Création, refonte, modernisation Headless WordPress",
      placeholder:
        "Décrivez votre projet de site : type (vitrine, institutionnel, e-commerce), volumétrie, délais, contraintes éventuelles…",
    },
    en: {
      label: "Website",
      description: "New build, redesign, Headless WordPress modernization",
      placeholder:
        "Describe your website project: type (brochure, institutional, e-commerce), traffic, timing, constraints…",
    },
  },
  application: {
    icon: Smartphone,
    fr: {
      label: "Application sur-mesure",
      description: "Web app (marketplace, plateforme métier) ou app mobile (PWA)",
      placeholder:
        "Décrivez votre projet applicatif : logique métier, comptes utilisateurs, mobile / web, fonctionnalités clés…",
    },
    en: {
      label: "Custom application",
      description: "Web app (marketplace, business platform) or mobile app (PWA)",
      placeholder:
        "Describe your application project: business logic, user accounts, mobile / web, key features…",
    },
  },
  oeth: {
    icon: Scale,
    fr: {
      label: "Avantage OETH",
      description: "Déduction AGEFIPH 30 % via sous-traitance TIH",
      placeholder:
        "Précisez votre situation : effectif, taux d'emploi TH actuel, montant de contribution AGEFIPH, projet web envisagé…",
    },
    en: {
      label: "OETH benefit",
      description: "30% AGEFIPH deduction via TIH subcontracting",
      placeholder:
        "Tell us about your situation: workforce size, current disabled-worker employment rate, AGEFIPH contribution, web project considered…",
    },
  },
  "audit-ia": {
    icon: SearchCheck,
    fr: {
      label: "Audit IA gratuit",
      description: "Diagnostic performance, SEO et conversion de votre site",
      placeholder:
        "Indiquez l'URL du site à auditer et les points sur lesquels vous souhaitez un éclairage particulier.",
    },
    en: {
      label: "Free AI audit",
      description: "Performance, SEO and conversion diagnostic of your site",
      placeholder:
        "Share the URL of the site to audit and the specific points you'd like clarified.",
    },
  },
  "question-technique": {
    icon: Layers,
    fr: {
      label: "Question technique",
      description: "Conseil, accompagnement, collaboration freelance",
      placeholder:
        "Décrivez votre question, votre contexte technique ou la nature de la collaboration envisagée.",
    },
    en: {
      label: "Technical question",
      description: "Advice, support, freelance collaboration",
      placeholder:
        "Describe your question, technical context or the nature of the collaboration you have in mind.",
    },
  },
  autre: {
    icon: MessageCircle,
    fr: {
      label: "Autre",
      description: "Toute autre demande",
      placeholder: "Dites-moi en plus sur votre demande…",
    },
    en: {
      label: "Other",
      description: "Any other request",
      placeholder: "Tell me more about your request…",
    },
  },
};

const SUBJECT_ORDER: SubjectKey[] = [
  "site-web",
  "application",
  "oeth",
  "audit-ia",
  "question-technique",
  "autre",
];

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
      body: JSON.stringify({
        name,
        email,
        message: fullMessage,
        subject: subjectLabel,
        locale,
      }),
    });

    if (res.ok) setStatus("sent");
    else setStatus("error");
  };

  return (
    <div className="w-full">
      <div className="bg-darkblue/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur">
        <div className="flex items-start gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-lightyellow shrink-0 mt-1" />
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-white/50 font-googletexte">
              {isEn ? "Contact form" : "Formulaire de contact"}
            </p>
            <p className="text-white font-googletexte mt-2">
              {isEn
                ? "Pick the topic that fits your request — I'll route the message accordingly."
                : "Choisissez l'objet de votre demande — votre message sera orienté en conséquence."}
            </p>
          </div>
        </div>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-lightyellow/30 bg-lightyellow/10 p-6 md:p-8 text-center flex flex-col items-center gap-4"
          >
            <CheckCircle2 className="h-10 w-10 text-lightyellow" />
            <h3 className="text-2xl font-googletitre text-white">
              {isEn ? "Message sent" : "Message envoyé"}
            </h3>
            <p className="text-white/80 font-googletexte max-w-md">
              {isEn
                ? "Thanks — I'll get back to you within 24h. A confirmation has been sent to your inbox."
                : "Merci — je reviens vers vous sous 24h. Une confirmation a été envoyée dans votre boîte mail."}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sélecteur d'objet */}
            <div className="space-y-3">
              <p className="text-sm text-white/70 font-googletexte">
                {isEn ? "Subject of your request" : "Objet de votre demande"} <span className="text-coral">*</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {SUBJECT_ORDER.map((key) => {
                  const config = SUBJECTS[key];
                  const copy = isEn ? config.en : config.fr;
                  const Icon = config.icon;
                  const selected = subject === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSubject(key)}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition cursor-pointer ${
                        selected
                          ? "border-lightyellow bg-lightyellow/10"
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 mt-0.5 ${
                          selected ? "text-lightyellow" : "text-white/60"
                        }`}
                      />
                      <div>
                        <p className="text-white font-googletitre text-base">{copy.label}</p>
                        <p className="text-sm text-white/60 font-googletexte leading-snug">
                          {copy.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulaire — uniquement après sélection d'un objet */}
            <AnimatePresence mode="wait">
              {subject && subjectCopy && (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-sm text-white/70 font-googletexte">
                        {isEn ? "Your name" : "Votre nom"} <span className="text-coral">*</span>
                      </label>
                      <Input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isEn ? "e.g. Alice Martin" : "Ex : Alice Martin"}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-lightyellow focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-sm text-white/70 font-googletexte">
                        {isEn ? "Your email" : "Votre email"} <span className="text-coral">*</span>
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isEn ? "alice@company.com" : "alice@organisation.com"}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-lightyellow focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-org" className="text-sm text-white/70 font-googletexte">
                      {isEn ? "Organization (optional)" : "Organisation (optionnel)"}
                    </label>
                    <Input
                      id="contact-org"
                      type="text"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      placeholder={isEn ? "e.g. Atelier Martin & Co" : "Ex : Atelier Martin & Co"}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-lightyellow focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-sm text-white/70 font-googletexte">
                      {isEn ? "Your message" : "Votre message"} <span className="text-coral">*</span>
                    </label>
                    <Textarea
                      id="contact-message"
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={subjectCopy.placeholder}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-lightyellow focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="rounded-full bg-lightyellow text-darkblue hover:bg-lightyellow/90 font-googletitre font-semibold px-6 py-3"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEn ? "Sending…" : "Envoi en cours…"}
                        </>
                      ) : (
                        <>
                          {isEn ? "Send my message" : "Envoyer mon message"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-white/50 font-googletexte">
                      {isEn
                        ? "Reply within 24h · Free, no strings attached"
                        : "Réponse sous 24h · Gratuit, sans engagement"}
                    </p>
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 rounded-xl border border-coral/30 bg-coral/10 p-3 text-coral text-sm font-googletexte">
                      <AlertCircle className="h-4 w-4 shrink-0" />
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
