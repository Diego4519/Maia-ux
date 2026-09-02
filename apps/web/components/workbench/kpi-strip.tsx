import {
  Database,
  FileCheck,
  Layers,
  Zap,
} from "lucide-react"

import { workbenchKpis } from "@/lib/mock-data"

const items = [
  { label: "Screening set", value: workbenchKpis.currentSet, icon: Layers },
  { label: "Listas activas", value: workbenchKpis.activeLists, icon: Database },
  { label: "Rutas automáticas", value: workbenchKpis.automationPaths, icon: Zap },
  { label: "Evidencia", value: workbenchKpis.evidenceFormats, icon: FileCheck },
]

export function KpiStrip() {
  return (
    <div className="maia-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="group relative overflow-hidden rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-heading mt-1.5 text-sm font-semibold tracking-tight">
                {item.value}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg border bg-muted/40 transition-colors group-hover:bg-muted/70">
              <item.icon className="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
