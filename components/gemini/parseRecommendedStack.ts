export function parseRecommendedStack(markdown: string) {
  // Cherche la section Stack recommandée
  const stackSection = markdown.match(/\*\*Stack recommandée.*?\n([\s\S]*?)(?:\n---|\n\*\*|$)/i);
  if (!stackSection) return null;

  // Sépare la recommandation et les points forts éventuels (liste ou phrases)
  const lines = stackSection[1].split('\n').map(l => l.trim()).filter(Boolean);

  // La première ligne est souvent la recommandation principale
  const stack = lines[0] || "";
  // Les suivantes sont les highlights (si elles commencent par - ou *)
  const highlights = lines.slice(1).map(l => l.replace(/^[-*]\s*/, ""));

  return { stack, highlights };
}