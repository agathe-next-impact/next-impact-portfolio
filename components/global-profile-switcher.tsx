"use client";

import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PROFILES, type ProfileId } from "@/lib/documentation-profiles";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { cn } from "@/lib/utils";

const profileOrder: ProfileId[] = ["decideur", "utilisateur", "developpeur"];

export function GlobalProfileSwitcher() {
  const { profileId, setProfile, clearProfile } = useDocumentationMode();
  const currentProfile = profileId ? PROFILES[profileId] : null;
  const CurrentIcon = currentProfile?.icon;
  const t = useTranslations("profileSwitcher");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-max flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-googletexte transition-all duration-300 border outline-none",
            currentProfile
              ? "bg-regularblue/15 border-lightblue/30 text-white hover:border-lightblue/50"
              : "bg-mediumblue/60 border-lightblue/25 text-white/80 hover:text-white hover:border-lightblue/40"
          )}
        >
          {CurrentIcon && (
            <CurrentIcon className={cn("h-4 w-4", currentProfile?.accentColor)} />
          )}
          <span className="text-inherit">
            {currentProfile ? t(`${currentProfile.id}.label`) : t("defaultLabel")}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl border-lightblue/20 bg-darkblue/95 backdrop-blur-xl p-2"
      >
        {profileOrder.map((id) => {
          const profile = PROFILES[id];
          const Icon = profile.icon;
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => setProfile(id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors focus:bg-regularblue/20 focus:text-white",
                profileId === id
                  ? "bg-regularblue/20 text-white"
                  : "text-white/80 hover:text-white hover:bg-regularblue/20"
              )}
            >
              <Icon className={cn("h-4 w-4", profile.accentColor)} />
              <div>
                <div className="text-sm font-medium font-googletexte text-inherit">
                  {t(`${id}.label`)}
                </div>
                <div className="text-xs text-white/80 font-googletexte line-clamp-1">
                  {t(`${id}.description`)}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        {profileId && (
          <>
            <DropdownMenuSeparator className="bg-lightblue/10 my-1" />
            <DropdownMenuItem
              onClick={clearProfile}
              className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer text-white/80 hover:text-white/80 hover:bg-mediumblue/40 focus:bg-mediumblue/40 focus:text-white/80"
            >
              <X className="h-4 w-4" />
              <span className="text-sm font-googletexte text-inherit">
                {t("resetProfile")}
              </span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
