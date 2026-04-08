
interface RecommendedStackCardProps {
  title: string;
  stack: string;
  highlights?: string[];
}

export default function RecommendedStackCard({ title, stack, highlights }: RecommendedStackCardProps) {
  return (
    <div className="my-8 w-full max-w-xl mx-auto rounded-xl border border-emerald-400 bg-emerald-50/80 flex flex-col items-center p-6">
      <div className="uppercase text-xs font-bold text-emerald-700 tracking-widest mb-2">{title}</div>
      <div className="text-2xl font-googletitre font-semibold text-emerald-900 mb-3">{stack}</div>
      {highlights && highlights.length > 0 && (
        <ul className="list-disc list-inside text-emerald-800 text-sm space-y-1">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

