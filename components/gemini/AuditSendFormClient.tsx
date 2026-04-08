"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, ScreenShareIcon } from "lucide-react";
import MarkdownRenderer from "./markdown-renderer";
import AuditDashboard from "./audit-dashboard";

interface AuditSendFormProps {
  markdownFull: string;
  url: string;
  userInfo?: { name: string; company: string; email: string };
}
export default function AuditSendFormClient({
  markdownFull,
  url,
  userInfo,
}: AuditSendFormProps) {
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const hasSent = useRef(false);

  // Envoi automatique dès que le composant monte avec userInfo disponible
  useEffect(() => {
    if (!userInfo || hasSent.current) return;
    hasSent.current = true;

    const sendAudit = async () => {
      setSendStatus("sending");
      try {
        const res = await fetch("/api/send-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userInfo.name,
            company: userInfo.company,
            email: userInfo.email,
            url,
            markdown: markdownFull,
          }),
        });
        if (!res.ok) throw new Error("Erreur lors de l'envoi");
        setSendStatus("sent");
      } catch (err: any) {
        setSendError(err.message || "Erreur inconnue");
        setSendStatus("error");
      }
    };

    sendAudit();
  }, [userInfo, url, markdownFull]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-2 md:p-6 bg-white/80 backdrop-blur-lg rounded-2xl mt-8">
      {/* Bandeau statut d'envoi */}
      {userInfo && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-googletexte ${
          sendStatus === "sending" ? "text-mediumblue" :
          sendStatus === "sent" ? "text-mediumblue" :
          sendStatus === "error" ? "text-red-700" :
          "bg-gray-50 text-gray-500"
        }`}>
          {sendStatus === "sending" && (
            <>
              <Loader2 className="size-4 animate-spin" />
              Envoi du rapport en cours vers {userInfo.email}...
            </>
          )}
          {sendStatus === "sent" && (
            <>
              <CheckCircle2 className="size-4" />
              Rapport envoyé avec succès à {userInfo.email}
            </>
          )}
          {sendStatus === "error" && (
            <>
              <AlertCircle className="size-4" />
              Erreur lors de l&apos;envoi : {sendError}
            </>
          )}
        </div>
      )}

      {/* Dashboard Visuel (Badges, Jauges) */}
      <AuditDashboard markdown={markdownFull} />

      {/* Affichage intégral du résultat d'analyse via le nouveau composant */}
      <MarkdownRenderer content={markdownFull} analyzedUrl={url} />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <a
          href="mailto:agathe@next-impact.digital"
          className="text-mediumblue font-googletitre font-medium text-lg text-center md:text-left"
        >
          agathe@next-impact.digital
        </a>
        <a
            href="tel:0673981638"
            className="text-mediumblue font-googletitre font-medium text-lg text-center md:text-right"
            >
            06 73 98 16 38
        </a>
        </div>
        <a
          href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
          className="bg-coral backdrop-blur-sm text-mediumblue font-googletitre font-semibold text-lg px-6 py-3 rounded-full hover:bg-coral/80 transition text-center"
        >
          <ScreenShareIcon className="inline-block mr-2 size-7 font-medium" />
          En discuter en visio
        </a>
      </div>
    </div>
  );
}
