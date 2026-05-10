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
export default function AuditSendFormClient({
  userInfo,
  status,
  errorMessage,
}: AuditSendFormProps) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 p-6 md:p-10 bg-white/80 backdrop-blur-lg rounded-2xl mt-8 text-center items-center">
      {status === "sent" && (
        <>
          <MailCheck className="size-14 text-coral" />
          <h2 className="text-2xl md:text-3xl font-googletitre font-semibold text-mediumblue">
            {isEn ? "Your audit is on its way!" : "Votre audit est en route !"}
          </h2>
          <p className="text-mediumblue/80 font-googletexte text-base md:text-lg">
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
          <AlertCircle className="size-12 text-red-600" />
          <h2 className="text-2xl md:text-3xl font-googletitre font-semibold text-red-700">
            {isEn ? "We could not send your audit" : "Impossible d'envoyer votre audit"}
          </h2>
          <p className="text-red-700/80 font-googletexte">
            {isEn
              ? `Send error: ${errorMessage ?? "unknown error"}. Please contact us directly so we can send it to you.`
              : `Erreur lors de l'envoi : ${errorMessage ?? "erreur inconnue"}. Contactez-nous directement, nous vous l'enverrons.`}
          </p>
        </>
      )}

      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <a
            href="mailto:agathe@next-impact.digital"
            className="text-mediumblue font-googletitre font-medium text-lg"
          >
            agathe@next-impact.digital
          </a>
          <a
            href="tel:0673981638"
            className="text-mediumblue font-googletitre font-medium text-lg"
          >
            06 73 98 16 38
          </a>
        </div>
        <a
          href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
          className="bg-coral backdrop-blur-sm text-mediumblue font-googletitre font-semibold text-lg px-6 py-3 rounded-full hover:bg-coral/80 transition text-center"
        >
          <ScreenShareIcon className="inline-block mr-2 size-7 font-medium" />
          {isEn ? "Discuss on video" : "En discuter en visio"}
        </a>
      </div>
    </div>
  );
}
