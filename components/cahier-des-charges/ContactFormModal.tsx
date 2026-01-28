"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormModalProps = {
  formData: Record<string, any>;
  onClose: () => void;
};

// Fonction dédiée pour envoyer les infos du formulaire
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
  // Envoie la requête à l'API
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nom,
      email,
      message,
      formData, // On envoie les données brutes à l'API
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
    } catch (err) {
      setError("Erreur lors de l'envoi. Merci de réessayer.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-regularblue hover:text-mediumblue text-xl"
            onClick={onClose}
            aria-label="Fermer"
            type="button"
          >
            ×
          </button>
          {sent ? (
            <div className="text-center space-y-4 py-8">
              <div className="text-2xl text-regularblue font-googletitre font-bold">Merci !</div>
              <div className="text-regularblue">Votre demande a bien été envoyée.</div>
              <button
                className="mt-4 px-6 py-2 bg-regularblue text-white rounded hover:bg-mediumblue"
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-regularblue mb-2">Demander le devis pour ce cahier des charges</h2>
              <div>
                <label className="block text-sm text-mediumblue mb-1">Votre nom</label>
                <Input
                  type="text"
                  name="nom"
                  value={fields.nom}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block text-sm text-mediumblue mb-1">Votre email</label>
                <Input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block text-sm text-mediumblue mb-1">Message (optionnel)</label>
                <Textarea
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  disabled={sending}
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-regularblue hover:bg-regularblue/80 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                disabled={sending}
              >
                {sending ? "Envoi en cours..." : "Envoyer"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}