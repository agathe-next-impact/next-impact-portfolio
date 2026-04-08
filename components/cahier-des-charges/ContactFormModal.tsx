"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, CheckCircle2 } from "lucide-react";

type ContactFormModalProps = {
  formData: Record<string, any>;
  onClose: () => void;
};

async function sendContactForm({
  nom,
  email,
  message,
  formData,
}: {
  nom: string;
  email: string;
  message: string;
  formData: Record<string, any>;
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
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Erreur lors de l'envoi du message.");
  }
}

export function ContactFormModal({ formData, onClose }: ContactFormModalProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      await sendContactForm({
        nom: fields.nom,
        email: fields.email,
        message: fields.message,
        formData,
      });
      setSent(true);
    } catch {
      setError("Erreur lors de l'envoi. Merci de réessayer.");
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
        className="fixed inset-0 z-50 bg-mediumblue/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/10 bg-darkblue/80 backdrop-blur-xl max-w-md w-full p-6 md:p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-white/40 hover:text-white transition p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
            aria-label="Fermer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>

          {sent ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl text-white font-googletitre font-bold">Merci !</h2>
              <p className="text-white/60 font-googletexte">Votre demande a bien été envoyée.</p>
              <button
                className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition font-googletitre"
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-googletitre mb-1">
                  Demander un devis
                </h2>
                <p className="text-sm text-white/50 font-googletexte">
                  Votre cahier des charges sera joint automatiquement
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/80 font-googletitre font-semibold">
                  Votre nom
                </label>
                <Input
                  type="text"
                  name="nom"
                  value={fields.nom}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-lightblue/40 h-11 rounded-xl"
                  placeholder="Jean Dupont"
                  disabled={sending}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/80 font-googletitre font-semibold">
                  Votre email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-lightblue/40 h-11 rounded-xl"
                  placeholder="jean@exemple.com"
                  disabled={sending}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/80 font-googletitre font-semibold">
                  Message <span className="text-white/40 font-normal">(optionnel)</span>
                </label>
                <Textarea
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-lightblue/40 rounded-xl min-h-[80px]"
                  placeholder="Des précisions sur votre projet..."
                  rows={3}
                  disabled={sending}
                />
              </div>

              {error && (
                <div className="rounded-xl bg-coral/10 border border-coral/20 p-3 text-sm text-coral font-googletexte">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold bg-coral text-darkblue transition-all duration-300 font-googletitre disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-darkblue/20 border-t-darkblue" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer la demande
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
