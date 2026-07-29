export function parseSummary(markdown: string) {
  const match = markdown.match(/\*\*Synthèse globale des résultats[\s\S]*?\n([\s\S]*?)(?:\n---|\n\*\*|$)/i);
  if (!match) return null;
  return match[1].trim();
}