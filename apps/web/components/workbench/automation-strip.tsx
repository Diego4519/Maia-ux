import { Sparkles } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"

const principles = [
  "Solo excepciones al humano",
  "Una superficie de decisión",
  "Evidencia por defecto",
]

export function AutomationStrip() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Automation DNA</span>
        <Badge variant="secondary">ON</Badge>
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
