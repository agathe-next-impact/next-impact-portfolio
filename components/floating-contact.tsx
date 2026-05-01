"use client";

import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Video,
  Mail,
  Newspaper,
  MessageCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PHONE = "0673981638";
const PHONE_DISPLAY = "06 73 98 16 38";
const EMAIL = "agathe@next-impact.digital";
const VISIO_URL = "https://calendar.app.google/Cw7TGQBzeZ1szKU86";
const NEWSLETTER_URL = "https://substack.com/@comesattollo626215";

type ContactOption = {
  key: string;
  icon: typeof Phone;
  label: string;
  description: string;
  iconColor: string;
  iconBg: string;
  href: string;
  external?: boolean;
};

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePanel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        closePanel();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const options: ContactOption[] = [
    {
      key: "phone",
      icon: Phone,
      label: "Téléphone",
      description: PHONE_DISPLAY,
      href: `tel:${PHONE}`,
      iconColor: "text-lightyellow",
      iconBg: "bg-lightyellow/10 border-lightyellow/20",
    },
    {
      key: "visio",
      icon: Video,
      label: "Visio",
      description: "Réserver un appel de 15 min",
      href: VISIO_URL,
      external: true,
      iconColor: "text-coral",
      iconBg: "bg-coral/10 border-coral/20",
    },
    {
      key: "mail",
      icon: Mail,
      label: "E-mail",
      description: EMAIL,
      href: `mailto:${EMAIL}`,
      iconColor: "text-lightblue",
      iconBg: "bg-lightblue/10 border-lightblue/20",
    },
    {
      key: "newsletter",
      icon: Newspaper,
      label: "Newsletter",
      description: "S'abonner sur Substack",
      href: NEWSLETTER_URL,
      external: true,
      iconColor: "text-orange",
      iconBg: "bg-orange/10 border-orange/20",
    },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closePanel() : setOpen(true))}
        aria-label={open ? "Fermer les moyens de contact" : "Ouvrir les moyens de contact"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-darkblue shadow-lg shadow-coral/30 hover:scale-105 hover:bg-coral/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:ring-offset-darkblue"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="h-6 w-6" strokeWidth={2.4} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="h-6 w-6" strokeWidth={2.4} />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only">Contact</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="contact-panel"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.8 }}
            style={{ transformOrigin: "bottom right" }}
            role="dialog"
            aria-modal="false"
            aria-label="Moyens de contact"
            className="fixed bottom-24 right-5 md:right-6 z-50 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-white/10 bg-mediumblue/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            <div className="p-5 md:p-6">
              <div className="space-y-2 mb-5">
                <h2 className="text-2xl md:text-3xl font-googletitre text-white">
                  Comment me contacter ?
                </h2>
                <p className="text-base text-white/70 font-googletexte">
                  Choisissez le canal qui vous convient — réponse sous 24h.
                </p>
              </div>

              <ul className="space-y-2.5">
                {options.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <li key={opt.key}>
                      <a
                        href={opt.href}
                        {...(opt.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        onClick={() => closePanel()}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${opt.iconBg}`}
                        >
                          <Icon className={`h-5 w-5 ${opt.iconColor}`} />
                        </span>
                        <span className="flex-1 min-w-0 text-left">
                          <span className="block font-googletitre text-base font-medium text-white">
                            {opt.label}
                          </span>
                          <span className="block text-sm text-white/60 font-googletexte truncate">
                            {opt.description}
                          </span>
                        </span>
                        {opt.external && (
                          <ExternalLink className="h-4 w-4 text-white/30 shrink-0" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
