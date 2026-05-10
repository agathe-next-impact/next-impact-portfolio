"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { PROFILES, type ProfileId } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { cn } from "@/lib/utils";

const profileOrder: ProfileId[] = ["decideur", "utilisateur", "developpeur"];

export function HomepageProfileBanner() {
  const { profileId, setProfile } = useDocumentationMode();
  const t = useTranslations("profileSwitcher");

  return (
    <AnimatePresence>
      {!profileId && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-mediumblue/60 backdrop-blur-md border-b border-white/10 overflow-hidden"
        >
          <div className="container flex flex-col sm:flex-row items-center justify-center gap-4 py-4 px-4">
            <span className="text-white/80 font-googletexte text-sm">
              {t("customizeExperience")}
            </span>
            <div className="flex gap-2 flex-wrap justify-center">
              {profileOrder.map((id) => {
                const profile = PROFILES[id];
                const Icon = profile.icon;
                return (
                  <button
                    key={id}
                    onClick={() => setProfile(id)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border transition-all duration-300",
                      "bg-darkblue/40 border-lightblue/20 text-white/80 hover:text-white hover:border-lightblue/40 hover:bg-darkblue/60"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", profile.accentColor)} />
                    <span className="font-googletexte text-white">{t(`${id}.label`)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
