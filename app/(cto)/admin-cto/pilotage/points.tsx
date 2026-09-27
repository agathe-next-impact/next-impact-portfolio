// ─────────────────────────────────────────────────────────────────────────────
// Les points remontés par un balayage, à deux niveaux.
//
// Ce qui touche un accès ou un rattachement est montré ouvert, en tête : c'est
// ce qui demande un geste dans l'atelier. Le reste — l'ordinaire d'un balayage —
// reste replié sous son compteur. Sans état ni effet : le même composant sert
// au rapport d'un clic (`outils.tsx`) et au dernier balayage du journal.
// ─────────────────────────────────────────────────────────────────────────────

export function Points({ warnings, alerts }: { warnings: string[]; alerts: string[] }) {
  const autres = warnings.filter((warning) => !alerts.includes(warning));
  const pluriel = autres.length > 1 ? "s" : "";
  const resume =
    alerts.length > 0
      ? `${autres.length} autre${pluriel} point${pluriel} à regarder`
      : `${autres.length} point${pluriel} à regarder`;

  return (
    <>
      {alerts.length > 0 ? (
        <div className="border border-[#ff8a7a]/45 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ff8a7a]">
            {alerts.length} point{alerts.length > 1 ? "s" : ""} à traiter · accès ou rattachement
          </p>
          <ul className="mt-3 space-y-1.5 font-inter-tight text-sm text-foreground">
            {alerts.map((alerte, index) => (
              <li key={index}>· {alerte}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {autres.length > 0 ? (
        <details className="border border-dark-gray px-4 py-3">
          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
            {resume}
          </summary>
          <ul className="mt-3 space-y-1.5 font-inter-tight text-sm text-mid-gray">
            {autres.map((warning, index) => (
              <li key={index}>· {warning}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </>
  );
}
