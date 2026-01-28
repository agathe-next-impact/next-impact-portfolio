export function parseSummaryTable(markdown: string) {
  // Cherche le bloc Mermaid
  const mermaidMatch = markdown.match(/graph\s+TD([\s\S]*?)(?=\n---|\n\*\*|$)/i);
  if (!mermaidMatch) return null;

  const lines = mermaidMatch[1]
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('subgraph') && !l.startsWith('end'));

  // On extrait les nœuds principaux (A[], B[], etc.)
  const nodes: { label: string; value: string }[] = [];
  lines.forEach(line => {
    const nodeMatch = line.match(/^([A-Z])\[(.*?)\]/);
    if (nodeMatch) {
      const label = nodeMatch[1];
      const value = nodeMatch[2];
      nodes.push({ label, value });
    }
  });

  // On mappe les labels à des intitulés plus parlants si besoin
  const labelMap: Record<string, string> = {
    A: "Observation",
    B: "Diagnostic",
    C: "Contenu",
    D: "Potentiel",
    E: "Verdict Stratégique",
    F: "Recommandation",
    G: "Objectif",
    H: "Bénéfices",
  };

  // On regroupe les infos dans l'ordre logique
  const summaryRows = nodes.map(n => ({
    critere: labelMap[n.label] || n.label,
    valeur: n.value,
  }));

  return summaryRows;
}