interface SummaryTableProps {
  rows: { critere: string; valeur: string }[];
}

export default function SummaryTable({ rows }: SummaryTableProps) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="not-prose my-8 w-full overflow-hidden rounded-xl border border-mediumblue/10 bg-white/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-mediumblue/5 text-mediumblue font-googletitre border-b border-mediumblue/10">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Critère</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Valeur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mediumblue/10 bg-transparent">
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 font-semibold uppercase text-mediumblue">{row.critere}</td>
                <td className="px-6 py-4 text-mediumblue">{row.valeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}