interface ArticleKpiCardProps {
  value: string
  label: string
}

export function ArticleKpiCard({ value, label }: ArticleKpiCardProps) {
  return (
    <div className="border-t border-dark-gray pr-8 pt-3">
      <div className="font-mono text-3xl font-light leading-none tracking-tight text-accent-secondary">
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
        {label}
      </div>
    </div>
  )
}
