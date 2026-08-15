import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sentinelle — analyse de site',
}

// Page d'atterrissage du scanner public. Contenu réel en phase 2
// (formulaire d'URL, analyse, rapport, capture d'e-mail).
// Elle existe dès la phase 0 pour valider la cohabitation des deux root
// layouts et l'exclusion du middleware next-intl.
export default function ScanPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/50">
        № 00 — Sentinelle
      </p>
      <h1 className="mt-4 font-sans text-3xl font-light tracking-tight text-foreground">
        Analyse de site
      </h1>
      <p className="mt-4 text-foreground/70">
        Le scanner arrive en phase 2. Cette page valide la structure des routes.
      </p>
    </main>
  )
}
