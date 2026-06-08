import { cn } from "@/lib/utils";

/**
 * CornerFrame — quatre équerres fines (1px) qui encadrent une zone, façon
 * viseur / cadrage éditorial « Serenity ». Décoratif, sans hook.
 */
export function CornerFrame({
  className,
  inset = 16,
  size = 40,
}: {
  className?: string;
  inset?: number;
  size?: number;
}) {
  const base = "absolute border-mid-gray/25";
  const box = { width: size, height: size } as const;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(base, "border-l border-t")} style={{ top: inset, left: inset, ...box }} />
      <span className={cn(base, "border-r border-t")} style={{ top: inset, right: inset, ...box }} />
      <span className={cn(base, "border-b border-l")} style={{ bottom: inset, left: inset, ...box }} />
      <span className={cn(base, "border-b border-r")} style={{ bottom: inset, right: inset, ...box }} />
    </div>
  );
}
