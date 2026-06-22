"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { TICKETS, PACKS } from "@/lib/wordpress-express";

const fieldClass =
  "w-full bg-jet border border-dark-gray px-3.5 py-2.5 font-inter-tight text-sm text-foreground placeholder:text-mid-gray outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent-secondary focus-visible:border-accent-secondary";

const labelClass =
  "block mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray";

const URGENCY = [
  { id: "asap", fr: "Site en panne — dès que possible", en: "Site down — as soon as possible" },
  { id: "24h", fr: "Sous 24h", en: "Within 24h" },
  { id: "week", fr: "Cette semaine", en: "This week" },
  { id: "flexible", fr: "Pas urgent", en: "Not urgent" },
];

export default function InterventionForm({
  defaultOffer,
  id = "demande",
}: {
  defaultOffer?: string;
  id?: string;
}) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const [offer, setOffer] = useState(defaultOffer ?? "");
  const [url, setUrl] = useState("");
  const [urgency, setUrgency] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const offerOptions = [
    ...TICKETS.map((t) => ({ id: t.id, label: `${(isEn ? t.en : t.fr).name} — ${t.price}${t.unit ? (isEn ? t.unit.en : t.unit.fr) : ""}` })),
    ...PACKS.map((p) => ({ id: p.id, label: `${(isEn ? p.en : p.fr).name} — ${p.price}` })),
    { id: "autre", label: isEn ? "Other / not sure yet" : "Autre / je ne sais pas encore" },
  ];
  const offerLabel = offerOptions.find((o) => o.id === offer)?.label ?? (isEn ? "Not specified" : "Non précisé");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const urgencyLabel = URGENCY.find((u) => u.id === urgency);
    const fullMessage = [
      `[${isEn ? "WordPress support" : "Dépannage WordPress"}]`,
      `${isEn ? "Requested" : "Demande"} : ${offerLabel}`,
      url ? `${isEn ? "Site URL" : "URL du site"} : ${url}` : null,
      urgencyLabel ? `${isEn ? "Urgency" : "Urgence"} : ${isEn ? urgencyLabel.en : urgencyLabel.fr}` : null,
      organisation ? `${isEn ? "Organization" : "Organisation"} : ${organisation}` : null,
      phone ? `${isEn ? "Phone" : "Téléphone"} : ${phone}` : null,
      "",
      message,
    ]
      .filter((l) => l !== null)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: fullMessage,
          subject: isEn ? "WordPress support" : "Dépannage WordPress",
          locale,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div id={id} className="flex flex-col items-start gap-3 border border-dark-gray bg-jet p-6 lg:p-8">
        <CheckCircle2 size={24} className="text-accent-secondary" />
        <h3 className="text-2xl font-light tracking-tight text-foreground">
          {isEn ? "Request sent" : "Demande envoyée"}
        </h3>
        <p className="max-w-xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Thanks — I'll get back to you within 24 business hours with a diagnosis and, if I can handle it, a secure payment link. Otherwise, a clear quote. A confirmation has been sent to your inbox."
            : "Merci — je reviens vers vous sous 24h ouvrées avec un diagnostic et, si je peux intervenir, un lien de paiement sécurisé. Sinon, un devis clair. Une confirmation vient d'être envoyée dans votre boîte mail."}
        </p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wpx-offer" className={labelClass}>
            {isEn ? "What do you need?" : "De quoi avez-vous besoin ?"}
          </label>
          <select
            id="wpx-offer"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className={fieldClass}
          >
            <option value="">{isEn ? "Select…" : "Sélectionnez…"}</option>
            {offerOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="wpx-url" className={labelClass}>
            {isEn ? "WordPress site URL" : "URL du site WordPress"}
          </label>
          <input
            id="wpx-url"
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://monsite.fr"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="wpx-urgency" className={labelClass}>
          {isEn ? "Urgency" : "Urgence"}
        </label>
        <select
          id="wpx-urgency"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className={fieldClass}
        >
          <option value="">{isEn ? "Select…" : "Sélectionnez…"}</option>
          {URGENCY.map((u) => (
            <option key={u.id} value={u.id}>
              {isEn ? u.en : u.fr}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="wpx-message" className={labelClass}>
          {isEn ? "Describe the problem" : "Décrivez le problème"}{" "}
          <span className="text-accent-secondary">*</span>
        </label>
        <textarea
          id="wpx-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isEn
              ? "What's happening, since when, what you've already tried, hosting / WordPress access if known…"
              : "Ce qui se passe, depuis quand, ce que vous avez déjà tenté, l'hébergement / les accès WordPress si vous les avez…"
          }
          className={cn(fieldClass, "resize-y")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wpx-name" className={labelClass}>
            {isEn ? "Your name" : "Votre nom"} <span className="text-accent-secondary">*</span>
          </label>
          <input
            id="wpx-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alice Martin"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="wpx-email" className={labelClass}>
            {isEn ? "Your email" : "Votre email"} <span className="text-accent-secondary">*</span>
          </label>
          <input
            id="wpx-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEn ? "alice@company.com" : "alice@organisation.com"}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wpx-org" className={labelClass}>
            {isEn ? "Organization (optional)" : "Organisation (optionnel)"}
          </label>
          <input
            id="wpx-org"
            type="text"
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
            placeholder="Atelier Martin & Co"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="wpx-phone" className={labelClass}>
            {isEn ? "Phone (optional)" : "Téléphone (optionnel)"}
          </label>
          <input
            id="wpx-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 12 34 56 78"
            className={fieldClass}
          />
        </div>
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
              {isEn ? "Send my request" : "Envoyer ma demande"}
              <ArrowRight size={14} />
            </>
          )}
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
          {isEn
            ? "Reply within 24 business hours · Payment link only if validated"
            : "Réponse sous 24h ouvrées · Lien de paiement seulement si validé"}
        </p>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 border border-accent-secondary bg-accent-secondary/5 px-4 py-3 font-inter-tight text-[13px] text-accent-secondary">
          <AlertCircle size={14} className="shrink-0" />
          {isEn
            ? "Something went wrong. Please try again, or reach out by email or phone."
            : "Une erreur est survenue. Réessayez, ou contactez-moi par email ou téléphone."}
        </div>
      )}
    </form>
  );
}
