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
  const sent = status === "sent";

  return (
    <div
      className={`mx-auto mt-8 flex max-w-[600px] flex-col items-center gap-4 border border-dark-gray bg-jet px-8 py-10 text-center ${
        sent ? "border-t-[3px] border-t-accent-secondary" : "border-t-[3px] border-t-vermilion"
      }`}
    >
      {sent && (
        <>
          <MailCheck size={40} className="text-accent-secondary" />
          <h2 className="m-0 font-sans text-2xl font-light text-foreground">
            {isEn ? "Your audit is on its way!" : "Votre audit est en route !"}
          </h2>
          <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
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
          <AlertCircle size={40} className="text-vermilion" />
          <h2 className="m-0 font-sans text-2xl font-light text-vermilion">
            {isEn ? "We could not send your audit" : "Impossible d'envoyer votre audit"}
          </h2>
          <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">
            {isEn
              ? `Send error: ${errorMessage ?? "unknown error"}. Please contact us directly so we can send it to you.`
              : `Erreur lors de l'envoi : ${errorMessage ?? "erreur inconnue"}. Contactez-nous directement, nous vous l'enverrons.`}
          </p>
        </>
      )}

      <div className="mt-4 grid w-full grid-cols-2 items-center gap-4">
        <div className="flex flex-col gap-1">
          <a href="mailto:agathe@next-impact.digital" className="font-mono text-xs text-foreground no-underline transition-colors hover:text-accent-secondary">
            agathe@next-impact.digital
          </a>
          <a href="tel:0673981638" className="font-mono text-xs text-foreground no-underline transition-colors hover:text-accent-secondary">
            06 73 98 16 38
          </a>
        </div>
        <a
          href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
          className="inline-flex items-center justify-center gap-2 border border-accent-secondary bg-accent-secondary px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
        >
          <ScreenShareIcon size={14} />
          {isEn ? "Discuss on video" : "En discuter en visio"}
        </a>
      </div>
    </div>
  );
}
