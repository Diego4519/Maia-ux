"use client"

import { cn } from "@workspace/ui/lib/utils"
import { screeningSets } from "@/lib/workbench-config"

interface ScreeningSetSelectorProps {
  selected?: string
  compact?: boolean
}

export function ScreeningSetSelector({
  selected = "edd",
  compact = false,
}: ScreeningSetSelectorProps) {
  return (
    <div className={cn("space-y-2", compact && "space-y-1")}>
      {!compact ? (
        <p className="font-heading text-sm font-semibold">Screening set</p>
      ) : null}
      <div className="space-y-2">
        {screeningSets.map((set) => {
          const isSelected = set.id === selected
          return (
            <div
              key={set.id}
              className={cn(
                "rounded-lg border px-3 py-2.5 transition-colors",
                isSelected
                  ? "border-foreground bg-muted/50 ring-1 ring-foreground/10"
                  : "border-border bg-card hover:bg-muted/40"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{set.name}</p>
                {"recommended" in set && set.recommended && isSelected ? (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Activo
                  </span>
                ) : null}
              </div>
              {!compact ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {set.description}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
