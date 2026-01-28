"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import { Button } from "../ui/button";
import { MailIcon, PhoneIcon, ScreenShareIcon } from "lucide-react";

interface AuditSendFormProps {
  markdownFull: string;
  url: string;
}
export default function AuditSendFormClient({
  markdownFull,
  url,
}: AuditSendFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/send-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          url,
          markdown: markdownFull,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi du mail");
      setSuccess(true);
      sessionStorage.setItem("audit-result", markdownFull);
      router.push("/etudes-de-cas/audit-envoye");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow mt-8">
      {/* Affichage intégral du résultat d'analyse */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none 
        prose-headings:font-googletitre prose-headings:font-semibold prose-headings:text-mediumblue
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl 
        prose-p:text-mediumblue prose-li:text-mediumblue 
        prose-strong:text-mediumblue prose-strong:font-semibold
        prose-a:text-coral prose-a:no-underline hover:prose-a:underline 
        prose-img:rounded-xl prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: marked.parse(markdownFull) }}
      />
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
          className="bg-lightyellow/70 backdrop-blur-sm text-mediumblue font-googletitre font-medium text-lg px-6 py-3 rounded-full shadow hover:bg-lightyellow/80 transition text-center"
        >
          <ScreenShareIcon className="inline-block mr-2 size-7" />
          En discuter en visio
        </a>
      </div>
    </div>
  );
}
