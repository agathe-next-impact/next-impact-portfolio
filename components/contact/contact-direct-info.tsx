"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function ContactDirectInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full max-w-lg mx-auto border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm text-center space-y-4"
    >
      <p className="text-white/60 font-googletexte uppercase tracking-widest text-sm">
        Vous préférez un échange direct ?
      </p>

      <div className="space-y-3">
        <p className="font-googletitre font-semibold text-white text-base">
          Agathe Karinthi-Martin
          <span className="text-white/60 font-googletexte font-normal"> — Next Impact Digital</span>
        </p>

        <div className="flex flex-col items-center gap-2.5 text-sm font-googletexte text-white/70">
          <a
            href="mailto:agathe@next-impact.digital"
            className="flex items-center gap-2 text-lightyellow transition-colors"
          >
            <Mail className="w-4 h-4 text-coral shrink-0 text-white/60" />
            agathe@next-impact.digital
          </a>

          <a
            href="tel:0673981638"
            className="flex items-center gap-2 text-lightyellow transition-colors"
          >
            <Phone className="w-4 h-4 text-lightyellow shrink-0 text-white/60" />
            06 73 98 16 38
          </a>

          <span className="flex items-center gap-2 text-white/60">
            <MapPin className="w-4 h-4 text-white/40 shrink-0" />
            4 rue du centre, 15400 Trizac
          </span>
        </div>
      </div>
    </motion.div>
  );
}
