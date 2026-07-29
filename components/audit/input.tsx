import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-sm border border-dark-gray bg-jet px-4 py-2 text-sm text-foreground ring-offset-obsidian file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mid-gray transition-colors focus-visible:outline-none focus-visible:border-accent-secondary focus-visible:ring-1 focus-visible:ring-accent-secondary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

