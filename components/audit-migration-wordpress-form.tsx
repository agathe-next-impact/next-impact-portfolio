"use client";
import React, { useState } from "react";

export default function AuditMigrationWordpressForm() {
  const [form, setForm] = useState({
    nom: "",
    entreprise: "",
    mail: "",
    telephone: "",
    url: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/audit-migration-wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("Demande envoyée avec succès ! Vous recevrez prochainement votre audit par email.");
        setForm({ nom: "", entreprise: "", mail: "", telephone: "", url: "" });
      } else {
        setStatus("Erreur lors de l'envoi. Essayez à nouveau.");
      }
    } catch {
      setStatus("Erreur lors de l'envoi. Essayez à nouveau.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Recevez votre audit</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input name="url" value={form.url} onChange={handleChange} placeholder="URL à auditer" required className="w-full border p-2 rounded-2xl border-regularblue/30 placeholder:text-regularblue focus:placeholder:text-regularblue/70 focus:outline-none focus:ring-0 focus:border-transparent focus:bg-extralightblue/30" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required className="w-2xl border p-2 rounded-2xl border-regularblue/30 focus:outline-none focus:ring-0 focus:border-transparent focus:bg-extralightblue/30" />
        <input name="entreprise" value={form.entreprise} onChange={handleChange} placeholder="Entreprise" required className="w-2xl border p-2 rounded-2xl border-regularblue/30 focus:outline-none focus:ring-0 focus:border-transparent focus:bg-extralightblue/30" />
        <input name="mail" value={form.mail} onChange={handleChange} placeholder="Email" type="email" required className="w-2xl border p-2 rounded-2xl border-regularblue/30 focus:outline-none focus:ring-0 focus:border-transparent focus:bg-extralightblue/30" />
        <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" required className="w-2xl border p-2 rounded-2xl border-regularblue/30 focus:outline-none focus:ring-0 focus:border-transparent focus:bg-extralightblue/30" />
        </div>
        <button type="submit" disabled={loading} className="bg-coral text-white font-googletitre text-lg font-medium px-6 py-2 rounded-full w-max">{loading ? "Envoi..." : "Envoyer la demande"}</button>
      </form>
      {status && <div className="mt-4 text-center">{status}</div>}
    </div>
  );
}
