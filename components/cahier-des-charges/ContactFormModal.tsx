"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";
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

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--rule)",
  background: "var(--paper)",
  color: "var(--ink)",
  fontFamily: "var(--sans)",
  fontSize: 14,
  padding: "10px 12px",
  width: "100%",
  outline: "none",
};

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
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(14,14,12,0.72)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--rule)",
            borderTop: "3px solid var(--accent-color)",
            maxWidth: 480, width: "100%",
            padding: "32px",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label={isEn ? "Close" : "Fermer"}
            type="button"
            style={{
              position: "absolute", top: 16, right: 16,
              background: "none", border: "none",
              color: "var(--muted-color)", cursor: "pointer",
              display: "flex", alignItems: "center",
            }}
          >
            <X size={18} />
          </button>

          {sent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <CheckCircle2 size={40} style={{ color: "#2a7a2a", margin: "0 auto 16px" }} />
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--ink)", marginBottom: 8 }}>
                {isEn ? "Thank you!" : "Merci !"}
              </h2>
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", marginBottom: 24 }}>
                {isEn ? "Your request has been sent." : "Votre demande a bien été envoyée."}
              </p>
              <button
                onClick={onClose}
                style={{
                  border: "1px solid var(--ink)", background: "var(--ink)", color: "var(--paper)",
                  fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em",
                  textTransform: "uppercase", padding: "10px 24px", cursor: "pointer",
                }}
              >
                {isEn ? "Close" : "Fermer"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--ink)", marginBottom: 4 }}>
                  {isEn ? "Request a quote" : "Demander un devis"}
                </h2>
                <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted-color)" }}>
                  {isEn
                    ? "Your specifications document will be attached automatically"
                    : "Votre cahier des charges sera joint automatiquement"}
                </p>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  {isEn ? "Your name" : "Votre nom"}
                </label>
                <input type="text" name="nom" value={fields.nom} onChange={handleChange} required style={inputStyle}
                  placeholder={isEn ? "Jane Doe" : "Jean Dupont"} disabled={sending} />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  {isEn ? "Your email" : "Votre email"}
                </label>
                <input type="email" name="email" value={fields.email} onChange={handleChange} required style={inputStyle}
                  placeholder={isEn ? "jane@example.com" : "jean@exemple.com"} disabled={sending} />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  {isEn ? "Message" : "Message"}{" "}
                  <span style={{ fontWeight: 400, color: "var(--muted-color)" }}>
                    {isEn ? "(optional)" : "(optionnel)"}
                  </span>
                </label>
                <textarea name="message" value={fields.message} onChange={handleChange}
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  placeholder={isEn ? "Project details..." : "Des précisions sur votre projet..."}
                  rows={3} disabled={sending} />
              </div>

              {error && (
                <div style={{ border: "1px solid var(--accent-color)", borderLeft: "3px solid var(--accent-color)", padding: "10px 12px", background: "var(--paper-2)", fontSize: 13, color: "var(--accent-color)", fontFamily: "var(--sans)" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                style={{
                  border: "1px solid var(--ink)", background: "var(--ink)", color: "var(--paper)",
                  fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em",
                  textTransform: "uppercase", padding: "12px 24px", cursor: sending ? "not-allowed" : "pointer",
                  opacity: sending ? 0.6 : 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {sending ? (
                  <>
                    <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "var(--paper)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
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
