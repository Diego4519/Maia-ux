import { Sparkles } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { opsSnapshot } from "@/lib/mock-data"

const principles = [
  "Solo excepciones al humano",
  "Una superficie de decisión",
  "Evidencia por defecto",
]

export function AutomationStrip() {
  return (
    <div className="maia-fade-up flex flex-col gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg border bg-background">
          <Sparkles className="size-4 text-muted-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Automation DNA</span>
            <Badge variant="secondary" className="maia-pulse-soft text-[10px]">
              ON
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {opsSnapshot.automationRate}% auto-resuelto · {opsSnapshot.throughputPerHour} screenings/h
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {principles.map((p) => (
          <span
            key={p}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}
