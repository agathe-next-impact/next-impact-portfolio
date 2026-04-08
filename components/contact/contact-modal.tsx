"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProfileType, PainPoint, BudgetRange, SiteType } from "./step-result";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  funnelData: {
    profile: ProfileType;
    painPoint: PainPoint;
    budget: BudgetRange;
    siteType: SiteType;
  };
}

const profileLabels: Record<ProfileType, string> = {
  association: "Association / Acteur de l'ESS",
  pme: "PME / ETI / Institution",
  "grand-compte": "Grand Compte / Agence",
};

const painPointLabels: Record<PainPoint, string> = {
  lenteur: "Lenteurs (perte de trafic)",
  securite: "Sécurité défaillante",
  refonte: "Refonte visuelle complète",
  carbone: "Empreinte carbone trop forte",
};

const budgetLabels: Record<BudgetRange, string> = {
  "less-3000": "Moins de 3 000 €",
  "3000-5000": "Entre 3 000 € et 5 000 €",
  "more-5000": "Plus de 5 000 €",
};

const siteTypeLabels: Record<SiteType, string> = {
  vitrine: "Site vitrine",
  institutionnel: "Site institutionnel",
  blog: "Blog / Média",
  application: "Application web",
  landing: "Landing page",
};

export function ContactModal({ open, onClose, funnelData }: ContactModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: formData.get("email") as string,
      message: [
        `Profil : ${profileLabels[funnelData.profile]}`,
        `Type de site : ${siteTypeLabels[funnelData.siteType]}`,
        `Défi principal : ${painPointLabels[funnelData.painPoint]}`,
        `Budget : ${budgetLabels[funnelData.budget]}`,
        formData.get("siteUrl") ? `Site actuel : ${formData.get("siteUrl")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-darkblue/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md border border-white/10 rounded-2xl bg-mediumblue/90 backdrop-blur-xl p-5 sm:p-6 md:p-8">
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {status === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 space-y-4"
                >
                  <CheckCircle className="w-12 h-12 text-lightyellow mx-auto" />
                  <h3 className="text-xl font-googletitre font-semibold text-white">
                    Merci pour votre confiance !
                  </h3>
                  <p className="text-white/70 font-googletexte leading-relaxed">
                    Votre demande a bien été envoyée. Je vous recontacte sous 24h.
                  </p>
                  <Button
                    onClick={onClose}
                    className="h-12 px-8 font-bold font-googletitre rounded-full bg-coral text-darkblue transition-all duration-300 cursor-pointer"
                  >
                    Fermer
                  </Button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-googletitre font-semibold text-white mb-1">
                    Vos coordonnées
                  </h3>
                  <p className="text-sm font-googletexte text-white/60 mb-6">
                    Pour que je puisse revenir vers vous rapidement.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        type="text"
                        name="firstName"
                        required
                        placeholder="Prénom"
                        className="border border-lightblue/20 bg-mediumblue/60 text-white placeholder:text-white/60 rounded-full"
                      />
                      <Input
                        type="text"
                        name="lastName"
                        required
                        placeholder="Nom"
                        className="border border-lightblue/20 bg-mediumblue/60 text-white placeholder:text-white/60 rounded-full"
                      />
                    </div>
                    <Input
                      type="url"
                      name="siteUrl"
                      placeholder="URL du site actuel (optionnel)"
                      className="border border-lightblue/20 bg-mediumblue/60 text-white placeholder:text-white/60 rounded-full"
                    />
                    <Input
                      type="email"
                      name="email"
                      required
                      placeholder="Email professionnel"
                      className="border border-lightblue/20 bg-mediumblue/60 text-white placeholder:text-white/60 rounded-full"
                    />

                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 rounded-full bg-coral text-darkblue font-bold font-googletitre transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                      {status === "loading" ? "Envoi en cours..." : "Envoyer ma demande"}
                    </motion.button>

                    {status === "error" && (
                      <p className="text-sm text-coral text-center font-googletexte">
                        Une erreur est survenue. Veuillez réessayer.
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
