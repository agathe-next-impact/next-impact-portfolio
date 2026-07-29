"use client";

import { useState } from "react";
import { m as motion } from "framer-motion";
import { Input} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export default function ContactForm() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
        locale,
      }),
    });

    if (res.ok) setStatus("sent");
    else setStatus("error");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto p-6"
    >

      {status === "sent" ? (
        <p className="text-regularblue">
          {isEn ? "Thank you, your message has been sent." : "Merci, votre message a bien été envoyé."}
        </p>
      ) : (

        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-regularblue mb-2">
              {isEn ? "Send a message" : "Envoyer un message"}
            </h2>
            <p className="mb-4">
              {isEn ? "Prefer to write? Fill out the form below." : "Vous préférez m'écrire ? Remplissez le formulaire ci-dessous."}
            </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            required
            placeholder={isEn ? "Your name" : "Votre nom"}
            className="w-full border px-4 py-2 rounded"
          />
          <Input
            type="email"
            name="email"
            required
            placeholder={isEn ? "Your email" : "Votre email"}
            className="w-full border px-4 py-2 rounded"
          />
          <Textarea
            name="message"
            required
            placeholder={isEn ? "Your message" : "Votre message"}
            rows={5}
            className="w-full border px-4 py-2 rounded"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-max gap-1 rounded-full px-6 py-2 text-darkblue md:text-lg bg-regularblue transition-all duration-300 ease-in-out"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? isEn ? "Sending…" : "Envoi en cours..."
              : isEn ? "Send" : "Envoyer"}
          </motion.button>
          {status === "error" && (
            <p className="text-pink-600 mt-2">
              {isEn ? "Something went wrong." : "Une erreur est survenue."}
            </p>
          )}
        </form>
        </div>
      )}
    </motion.div>
  );
}
