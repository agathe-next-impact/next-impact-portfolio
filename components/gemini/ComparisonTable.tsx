import React from "react";

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
}

// Fonction utilitaire pour convertir une appréciation en nombre d'étoiles
function getStars(text: string): number {
  const t = text.toLowerCase();
  if (t.includes("excellente") || t.includes("très élevée") || t.includes("très bonne")) return 5;
  if (t.includes("bonne") || t.includes("élevée")) return 4;
  if (t.includes("moyenne")) return 3;
  if (t.includes("faible") || t.includes("limitée")) return 1;
  return 0;
}

export default function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border rounded-xl shadow bg-mediumblue">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-6 py-4 bg-white/10 text-white font-light uppercase border-b"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="even:bg-mediumblue/20 text-white">
              {row.map((cell, cIdx) => {
                const cleanCell = cell.replace(/\*+/g, "");
                const stars = getStars(cleanCell);
                return (
                  <td key={cIdx} className="px-6 py-4 border-b text-white align-top">
                    <span className="flex flex-col items-center justify-start gap-1">
                      <span className="ml-2 text-white text-center text-sm">{cleanCell}</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}