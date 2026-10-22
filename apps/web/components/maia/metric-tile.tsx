import type { LucideIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

interface MetricTileProps {
  label: string
  value: string | number
  hint?: string
  icon?: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export function MetricTile({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  trendUp,
  className,
}: MetricTileProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/90 px-4 py-4 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {Icon ? (
          <div className="flex size-8 items-center justify-center rounded-lg border bg-muted/40 transition-colors group-hover:bg-muted/70">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        ) : null}
      </div>
      <p className="font-heading mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {hint ? (
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        ) : null}
        {trend ? (
          <span
            className={cn(
              "text-[11px] font-medium",
              trendUp === true && "text-emerald-700 dark:text-emerald-400",
              trendUp === false && "text-amber-700 dark:text-amber-400",
              trendUp === undefined && "text-muted-foreground"
            )}
          >
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  )
}
