import { cn } from "@/lib/utils"

type CalloutType = "info" | "warning" | "success" | "example"

interface ArticleCalloutProps {
  type?: CalloutType
  children: React.ReactNode
}

const variants: Record<CalloutType, string> = {
  info: "border-l-4 border-blue-500 bg-blue-500/10 text-blue-900 dark:text-white/80",
  warning: "border-l-4 border-amber-500 bg-amber-500/10 text-amber-900 dark:text-white/80",
  success: "border-l-4 border-green-500 bg-green-500/10 text-green-900 dark:text-white/80",
  example: "border-l-4 border-slate-400 bg-slate-500/5 text-slate-700 dark:text-white/70",
}

export function ArticleCallout({ type = "info", children }: ArticleCalloutProps) {
  return (
    <div className={cn("rounded-r-xl p-4 my-4 text-sm font-googletexte", variants[type])}>
      {children}
    </div>
  )
}
