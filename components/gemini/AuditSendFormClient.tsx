"use client";
import React from "react";
import { AlertCircle, MailCheck, ScreenShareIcon } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

interface AuditSendFormProps {
  url: string;
  userInfo?: { name: string; company: string; email: string };
  status: "sent" | "error";
  errorMessage?: string;
}

export default function AuditSendFormClient({ userInfo, status, errorMessage }: AuditSendFormProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <div style={{
      maxWidth: 600, margin: "32px auto 0",
      border: "1px solid var(--rule)",
      borderTop: status === "sent" ? "3px solid #2a7a2a" : "3px solid var(--accent-color)",
      background: "var(--paper)",
      padding: "40px 32px",
      display: "flex", flexDirection: "column", gap: 16, alignItems: "center", textAlign: "center",
    }}>
      {status === "sent" && (
        <>
          <MailCheck size={40} style={{ color: "#2a7a2a" }} />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--ink)", margin: 0 }}>
            {isEn ? "Your audit is on its way!" : "Votre audit est en route !"}
          </h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {isEn
              ? userInfo
                ? `We will send the full report to ${userInfo.email} as soon as it is ready (a few minutes). Check your inbox (and spam folder, just in case).`
                : "We will send you the full report by email as soon as it is ready (a few minutes). Check your inbox (and spam folder, just in case)."
              : userInfo
                ? `Nous enverrons le rapport complet à ${userInfo.email} dès qu'il sera prêt (quelques minutes). Pensez à vérifier votre boîte de réception (et vos spams, au cas où).`
                : "Nous vous enverrons le rapport complet par email dès qu'il sera prêt (quelques minutes). Pensez à vérifier votre boîte de réception (et vos spams, au cas où)."}
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle size={40} style={{ color: "var(--accent-color)" }} />
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--accent-color)", margin: 0 }}>
            {isEn ? "We could not send your audit" : "Impossible d'envoyer votre audit"}
          </h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {isEn
              ? `Send error: ${errorMessage ?? "unknown error"}. Please contact us directly so we can send it to you.`
              : `Erreur lors de l'envoi : ${errorMessage ?? "erreur inconnue"}. Contactez-nous directement, nous vous l'enverrons.`}
          </p>
        </>
      )}

      <div style={{ marginTop: 16, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <a href="mailto:agathe@next-impact.digital" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)", textDecoration: "none" }}>
            agathe@next-impact.digital
          </a>
          <a href="tel:0673981638" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)", textDecoration: "none" }}>
            06 73 98 16 38
          </a>
        </div>
        <a
          href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
          style={{
            border: "1px solid var(--ink)", background: "var(--ink)", color: "var(--paper)",
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "12px 16px", textDecoration: "none",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <ScreenShareIcon size={14} />
          {isEn ? "Discuss on video" : "En discuter en visio"}
        </a>
      </div>
    </div>
  );
}
