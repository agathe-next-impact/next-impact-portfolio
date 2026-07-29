export function parseMarkdownTable(markdown: string) {
  // Cherche le premier tableau markdown
  const tableRegex = /((?:\|.*\|[\r\n]+)+)/;
  const match = markdown.match(tableRegex);
  if (!match) return null;

  const lines = match[1]
    .trim()
    .split('\n')
    .filter(line => line.trim().startsWith('|'));

  if (lines.length < 2) return null;

  // Enlève les | de début/fin et split sur |
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  const rows = lines.slice(2).map(line =>
    line.split('|').map(cell => cell.trim()).filter(Boolean)
  );

  return { headers, rows };
}

export function parseAllMarkdownTables(markdown: string) {
  const tableRegex = /((?:\|.*\|[\r\n]+)+)/g;
  const tables = [];
  let match;
  while ((match = tableRegex.exec(markdown)) !== null) {
    const raw = match[1];
    const parsed = parseMarkdownTable(raw);
    if (parsed) {
      tables.push({ ...parsed, raw });
    }
  }
  return tables;
}