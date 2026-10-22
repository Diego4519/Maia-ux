import type { CSSProperties } from "react"
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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          style={{ "--i": index } as CSSProperties}
          className="maia-enter maia-card flex flex-col items-center px-4 py-5 text-center"
        >
          <div className="maia-icon-tile mb-3 size-12">
            <item.icon className="size-5" strokeWidth={2.25} />
          </div>
          <p className="font-heading text-lg font-bold leading-tight text-foreground">
            {item.value}
          </p>
          <p className="mt-1 text-xs font-bold text-foreground/70">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
