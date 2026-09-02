import type { LucideIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/10 px-6 py-14 text-center maia-scale-in",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border bg-background shadow-sm">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <p className="font-heading text-base font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
