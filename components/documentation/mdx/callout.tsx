"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Lightbulb, AlertTriangle, Info, Briefcase, Code, User } from "lucide-react";

type CalloutVariant = "tip" | "warning" | "info" | "decideur" | "developpeur" | "utilisateur";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantConfig: Record<CalloutVariant, { icon: typeof Info; bg: string; border: string; iconColor: string; titleColor: string }> = {
  tip: {
    icon: Lightbulb,
    bg: "bg-orange/5",
    border: "border-orange/30",
    iconColor: "text-orange",
    titleColor: "text-orange",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-coral/5",
    border: "border-coral/30",
    iconColor: "text-coral",
    titleColor: "text-coral",
  },
  info: {
    icon: Info,
    bg: "bg-regularblue/5",
    border: "border-regularblue/30",
    iconColor: "text-regularblue",
    titleColor: "text-regularblue",
  },
  decideur: {
    icon: Briefcase,
    bg: "bg-orange/5",
    border: "border-orange/20",
    iconColor: "text-orange",
    titleColor: "text-orange",
  },
  developpeur: {
    icon: Code,
    bg: "bg-regularblue/5",
    border: "border-regularblue/20",
    iconColor: "text-regularblue",
    titleColor: "text-regularblue",
  },
  utilisateur: {
    icon: User,
    bg: "bg-lightyellow/20",
    border: "border-lightyellow/40",
    iconColor: "text-mediumblue",
    titleColor: "text-mediumblue",
  },
};

export function Callout({ variant = "info", title, children }: CalloutProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn("my-6 rounded-2xl border-l-4 px-5 py-4", config.bg, config.border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.iconColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn("font-googletitre font-medium text-sm mb-1", config.titleColor)}>
              {title}
            </p>
          )}
          <div className="text-mediumblue/80 text-sm font-googletexte [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
