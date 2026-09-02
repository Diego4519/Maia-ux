"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { screeningSets } from "@/lib/workbench-config"
import { useMaiaToast } from "@/components/maia/maia-toast"

interface ScreeningSetSelectorProps {
  selected?: string
  compact?: boolean
}

export function ScreeningSetSelector({
  selected = "edd",
  compact = false,
}: ScreeningSetSelectorProps) {
  const [active, setActive] = useState(selected)
  const { toast } = useMaiaToast()

  function select(id: string, name: string) {
    setActive(id)
    toast(`Screening set cambiado a: ${name}`, "info")
  }

  return (
    <div className={cn("maia-fade-up space-y-2", compact && "space-y-1")}>
      {!compact ? (
        <p className="font-heading text-sm font-semibold">Screening set</p>
      ) : null}
      <div className="space-y-2">
        {screeningSets.map((set) => {
          const isSelected = set.id === active
          return (
            <button
              key={set.id}
              type="button"
              onClick={() => select(set.id, set.name)}
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                isSelected
                  ? "border-foreground bg-muted/50 shadow-sm ring-1 ring-foreground/10"
                  : "border-border bg-card hover:bg-muted/40 hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{set.name}</p>
                {isSelected ? (
                  <Check className="size-4 text-foreground" />
                ) : "recommended" in set && set.recommended ? (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Recomendado
                  </span>
                ) : null}
              </div>
              {!compact ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {set.description}
                </p>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
