interface ArticleKpiCardProps {
  value: string
  label: string
}

export function ArticleKpiCard({ value, label }: ArticleKpiCardProps) {
  return (
    <div className="rounded-2xl bg-darkblue/50 backdrop-blur-sm border border-lightblue/10 px-4 py-3">
      <div className="text-lg font-medium text-lightyellow font-googletitre">
        {value}
      </div>
      <div className="text-xs text-white/50 font-googletexte">{label}</div>
    </div>
  )
}
