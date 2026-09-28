"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, Mail, MessageSquareText, Phone, Video, Newspaper, type LucideIcon } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ECHANGE_URL } from "@/lib/visio-conseil";
import { NEWSLETTER_SUBSCRIBE_URL } from "@/lib/newsletter";

// Page contact : un onglet par mode de contact, le contenu du mode sous les
// onglets (demande d'Agathe du 2026-09-28). Le formulaire est passé par la page
// (composant serveur) pour ne pas dupliquer son import ici.
//
// Un lien peut ouvrir un onglet précis par son ancre : /contact#visio,
// /contact#telephone, /contact#email, /contact#newsletter.

const PHONE = "0673981638";
const PHONE_DISPLAY = "06 73 98 16 38";
const EMAIL = "agathe@next-impact.digital";

type ModeKey = "message" | "visio" | "telephone" | "email" | "newsletter";

type Mode = {
  key: ModeKey;
  Icon: LucideIcon;
  label: { fr: string; en: string };
};

const MODES: Mode[] = [
  { key: "message", Icon: MessageSquareText, label: { fr: "Message", en: "Message" } },
  { key: "visio", Icon: Video, label: { fr: "Visio", en: "Video call" } },
  { key: "telephone", Icon: Phone, label: { fr: "Téléphone", en: "Phone" } },
  { key: "email", Icon: Mail, label: { fr: "E-mail", en: "Email" } },
  { key: "newsletter", Icon: Newspaper, label: { fr: "Newsletter", en: "Newsletter" } },
];

const BUTTON =
  "inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent-secondary px-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85";

function Panel({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="px-6 py-10 lg:px-8 lg:py-12">
      <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">{kicker}</p>
      <p className="text-2xl font-light tracking-tight text-foreground lg:text-3xl">{title}</p>
      <div className="mt-6 max-w-xl">{children}</div>
    </div>
  );
}

export function ContactTabs({ form }: { form: ReactNode }) {
  const locale = useLocale() as Locale;
  const l = locale === "en" ? "en" : "fr";
  const isEn = l === "en";
  const [tab, setTab] = useState<ModeKey>("message");
  const tabRefs = useRef<Partial<Record<ModeKey, HTMLButtonElement | null>>>({});

  // Ancre d'entrée (#visio…) : lue côté client, la page reste statique.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1) as ModeKey;
      if (MODES.some((m) => m.key === hash)) setTab(hash);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = MODES.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const key = MODES[next].key;
    setTab(key);
    tabRefs.current[key]?.focus();
  };

  const panels: Record<ModeKey, ReactNode> = {
    message: form,
    visio: (
      <Panel
        kicker={isEn ? "Free · 15 minutes" : "Gratuit · 15 minutes"}
        title={isEn ? "A 15-minute video call, free" : "Un échange de 15 minutes en visio, gratuit"}
      >
        <p className="text-base leading-relaxed text-mid-gray">
          {isEn
            ? "You describe your site and the decision in front of you; I tell you what I would do in your place, and whether I am the right person for it. No commitment."
            : "Vous me décrivez votre site et la décision à prendre ; je vous dis ce que je ferais à votre place, et si je suis la bonne personne pour le faire. Sans engagement."}
        </p>
        <a href={ECHANGE_URL} target="_blank" rel="noopener noreferrer" className={cn(BUTTON, "mt-6")}>
          {isEn ? "Free call" : "Échange gratuit"}
          <ArrowRight size={14} aria-hidden />
        </a>
      </Panel>
    ),
    telephone: (
      <Panel kicker={isEn ? "Weekdays" : "En semaine"} title={PHONE_DISPLAY}>
        <p className="text-base leading-relaxed text-mid-gray">
          {isEn
            ? "Call me directly. If I am with a client, leave a message: I call back within 24 hours."
            : "Appelez-moi directement. Si je suis avec un client, laissez un message : je vous rappelle sous 24 h."}
        </p>
        <a href={`tel:${PHONE}`} className={cn(BUTTON, "mt-6")}>
          {isEn ? "Call" : "Appeler"}
          <ArrowRight size={14} aria-hidden />
        </a>
      </Panel>
    ),
    email: (
      <Panel kicker={isEn ? "Reply within 24 hours" : "Réponse sous 24 h"} title={<span className="break-all">{EMAIL}</span>}>
        <p className="text-base leading-relaxed text-mid-gray">
          {isEn
            ? "Write to me directly, with the address of your site if you have one."
            : "Écrivez-moi directement, avec l'adresse de votre site si vous en avez un."}
        </p>
        <a href={`mailto:${EMAIL}`} className={cn(BUTTON, "mt-6")}>
          {isEn ? "Write an email" : "Écrire un e-mail"}
          <ArrowRight size={14} aria-hidden />
        </a>
      </Panel>
    ),
    newsletter: (
      <Panel
        kicker={isEn ? "Free · on Substack" : "Gratuit · sur Substack"}
        title={isEn ? "Not ready to talk yet?" : "Pas encore prêt à en parler ?"}
      >
        <p className="text-base leading-relaxed text-mid-gray">
          {isEn
            ? "Subscribe to the newsletter: technical and strategic watch for those who run a website. You can reply to any issue, it reaches me."
            : "Abonnez-vous à la lettre : la veille technique et stratégique pour ceux qui pilotent un site. Vous pouvez répondre à chaque numéro, il m'arrive."}
        </p>
        <a href={NEWSLETTER_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className={cn(BUTTON, "mt-6")}>
          {isEn ? "Subscribe" : "S'abonner"}
          <ArrowRight size={14} aria-hidden />
        </a>
      </Panel>
    ),
  };

  return (
    <div className="border-t border-dark-gray">
      <div
        role="tablist"
        aria-label={isEn ? "Choose how to contact me" : "Choisir un mode de contact"}
        className="scrollbar-hide flex overflow-x-auto border-b border-dark-gray"
      >
        {MODES.map((m, i) => {
          const selected = m.key === tab;
          const Icon = m.Icon;
          return (
            <button
              key={m.key}
              id={`contact-tab-${m.key}`}
              ref={(el) => {
                tabRefs.current[m.key] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`contact-panel-${m.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(m.key)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={cn(
                "-mb-px flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-200 sm:px-6 sm:text-sm",
                selected
                  ? "border-accent-secondary text-accent-secondary"
                  : "border-transparent text-mid-gray hover:text-foreground",
              )}
            >
              <Icon size={15} strokeWidth={1.5} aria-hidden />
              {m.label[l]}
            </button>
          );
        })}
      </div>

      {/* Tous les panneaux restent rendus (le formulaire garde sa saisie). */}
      {MODES.map((m) => (
        <div
          key={m.key}
          id={`contact-panel-${m.key}`}
          role="tabpanel"
          aria-labelledby={`contact-tab-${m.key}`}
          tabIndex={0}
          hidden={m.key !== tab}
        >
          {panels[m.key]}
        </div>
      ))}
    </div>
  );
}
