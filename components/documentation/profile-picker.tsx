"use client";

import { motion } from "framer-motion";
import { PROFILES, type ProfileId } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { cn } from "@/lib/utils";

const profileOrder: ProfileId[] = ["decideur", "utilisateur", "developpeur"];

export function ProfilePicker() {
  const { profileId, setProfile } = useDocumentationMode();

  if (profileId) return null;

  return (
    <section className="mb-10">
      <h2 className="font-googletitre text-xl md:text-2xl font-medium text-white mb-2">
        Quel est votre profil ?
      </h2>
      <p className="text-sm text-white/80 font-googletexte mb-6">
        Choisissez votre profil pour un parcours personnalisé.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profileOrder.map((id, index) => {
          const profile = PROFILES[id];
          const Icon = profile.icon;
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setProfile(id)}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-6 md:p-8 border border-lightblue/90",
                "cursor-pointer text-left transition-all duration-300 hover:shadow-2xl hover:shadow-regularblue/10 hover:border-lightblue/20",
                "bg-mediumblue/80 backdrop-blur-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lightblue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-darkblue"
              )}
            >
              <div className="flex flex-col gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl",
                    profile.gradient
                  )}
                >
                  <Icon className={cn("h-6 w-6", profile.accentColor)} />
                </div>
                <div>
                  <div className="font-googletitre text-lg font-medium text-white mb-1">
                    {profile.label}
                  </div>
                  <p className="text-sm text-white/80 font-googletexte">
                    {profile.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
