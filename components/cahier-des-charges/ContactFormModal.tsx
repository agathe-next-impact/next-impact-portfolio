"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

type ContactFormModalProps = {
  formData: Record<string, any>;
  onClose: () => void;
};

async function sendContactForm({
  nom,
  email,
  message,
  formData,
  locale,
}: {
  nom: string;
  email: string;
  message: string;
  formData: Record<string, any>;
  locale: string;
}) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nom,
      email,
      message,
      formData,
      type: "cahier-des-charges",
      locale,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Erreur lors de l'envoi du message.");
  }
}

const fieldClass =
  "w-full bg-jet border border-dark-gray px-3.5 py-2.5 font-inter-tight text-sm text-foreground placeholder:text-mid-gray outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent-secondary focus-visible:border-accent-secondary disabled:opacity-60";

const labelClass =
  "block mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray";

export function ContactFormModal({ formData, onClose }: ContactFormModalProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({ nom: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await sendContactForm({ nom: fields.nom, email: fields.email, message: fields.message, formData, locale });
      setSent(true);
    } catch {
      setError(isEn ? "Sending failed. Please try again." : "Erreur lors de l'envoi. Merci de réessayer.");
    } finally {
      setSending(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[480px] border border-dark-gray border-t-2 border-t-accent-secondary bg-jet p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label={isEn ? "Close" : "Fermer"}
            type="button"
            className="absolute right-4 top-4 flex items-center text-mid-gray transition-colors hover:text-foreground"
          >
            <X size={18} />
          </button>

          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle2 size={40} className="mx-auto mb-4 text-accent-secondary" />
              <h2 className="mb-2 text-2xl font-light tracking-tight text-foreground">
                {isEn ? "Thank you!" : "Merci !"}
              </h2>
              <p className="mb-6 font-inter-tight text-sm text-mid-gray">
                {isEn ? "Your request has been sent." : "Votre demande a bien été envoyée."}
              </p>
              <button
                onClick={onClose}
                className="border border-dark-gray bg-obsidian px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray transition-colors hover:text-foreground"
              >
                {isEn ? "Close" : "Fermer"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h2 className="mb-1 text-2xl font-light tracking-tight text-foreground">
                  {isEn ? "Request a quote" : "Demander un devis"}
                </h2>
                <p className="font-inter-tight text-[13px] text-mid-gray">
                  {isEn
                    ? "Your specifications document will be attached automatically"
                    : "Votre cahier des charges sera joint automatiquement"}
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  {isEn ? "Your name" : "Votre nom"}
                </label>
                <input type="text" name="nom" value={fields.nom} onChange={handleChange} required className={fieldClass}
                  placeholder={isEn ? "Jane Doe" : "Jean Dupont"} disabled={sending} />
              </div>

              <div>
                <label className={labelClass}>
                  {isEn ? "Your email" : "Votre email"}
                </label>
                <input type="email" name="email" value={fields.email} onChange={handleChange} required className={fieldClass}
                  placeholder={isEn ? "jane@example.com" : "jean@exemple.com"} disabled={sending} />
              </div>

              <div>
                <label className={labelClass}>
                  {isEn ? "Message" : "Message"}{" "}
                  <span className="text-mid-gray/70">
                    {isEn ? "(optional)" : "(optionnel)"}
                  </span>
                </label>
                <textarea name="message" value={fields.message} onChange={handleChange}
                  className={cn(fieldClass, "min-h-[80px] resize-y")}
                  placeholder={isEn ? "Project details..." : "Des précisions sur votre projet..."}
                  rows={3} disabled={sending} />
              </div>

              {error && (
                <div className="border border-vermilion/60 border-l-2 border-l-vermilion bg-obsidian px-3 py-2.5 font-inter-tight text-[13px] text-vermilion">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 border border-charcoal bg-vermilion px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {isEn ? "Sending…" : "Envoi en cours..."}
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    {isEn ? "Send request" : "Envoyer la demande"}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
