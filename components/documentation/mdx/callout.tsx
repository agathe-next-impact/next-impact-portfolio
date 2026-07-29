"use client";

import { ReactNode } from "react";
import { Lightbulb, AlertTriangle, Info, Briefcase, Code, User } from "lucide-react";

type CalloutVariant = "tip" | "warning" | "info" | "decideur" | "developpeur" | "utilisateur";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantConfig: Record<CalloutVariant, {
  icon: typeof Info;
  borderColor: string;
  iconColor: string;
}> = {
  tip: {
    icon: Lightbulb,
    borderColor: "var(--accent-color)",
    iconColor: "var(--accent-color)",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "var(--ink)",
    iconColor: "var(--ink)",
  },
  info: {
    icon: Info,
    borderColor: "var(--rule-strong)",
    iconColor: "var(--muted-color)",
  },
  decideur: {
    icon: Briefcase,
    borderColor: "var(--accent-color)",
    iconColor: "var(--accent-color)",
  },
  developpeur: {
    icon: Code,
    borderColor: "var(--ink-2)",
    iconColor: "var(--ink-2)",
  },
  utilisateur: {
    icon: User,
    borderColor: "var(--rule-strong)",
    iconColor: "var(--muted-color)",
  },
};

export function Callout({ variant = "info", title, children }: CalloutProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div style={{
      margin: "1.5rem 0",
      padding: "1rem 1.25rem",
      background: "var(--paper-2)",
      borderLeft: `3px solid ${config.borderColor}`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <Icon style={{ width: "1rem", height: "1rem", marginTop: "0.125rem", flexShrink: 0, color: config.iconColor }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: config.iconColor,
              marginBottom: "0.375rem",
              fontWeight: 500,
            }}>
              {title}
            </p>
          )}
          <div style={{ fontSize: "0.875rem", color: "var(--ink-2)", lineHeight: 1.65 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
