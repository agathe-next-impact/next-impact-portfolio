import { cn } from "@/lib/utils"

type CalloutType = "info" | "warning" | "success" | "example"

interface ArticleCalloutProps {
  type?: CalloutType
  children: React.ReactNode
}

/**
 * Callout « blueprint » : panneau jet décollé, filet gauche d'accent, corps en
 * Inter Tight atténué. Les variantes se distinguent par la couleur du filet
 * (jaune secondaire / indigo primaire), sans aucune couleur en dur ni arrondi.
 */
const variants: Record<CalloutType, string> = {
  info: "border-accent-secondary",
  warning: "border-accent-primary",
  success: "border-accent-secondary",
  example: "border-mid-gray/50",
}

export function ArticleCallout({ type = "info", children }: ArticleCalloutProps) {
  return (
    <div
      className={cn(
        "my-6 border-l-2 bg-jet p-4 font-inter-tight text-sm leading-relaxed text-foreground/90 [&_strong]:font-normal [&_strong]:text-inherit [&_b]:font-normal [&_b]:text-inherit",
        variants[type]
      )}
    >
      {children}
    </div>
  )
}
