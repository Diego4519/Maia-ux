import { workbenchKpis } from "@/lib/mock-data"

const items = [
  { label: "Screening set", value: workbenchKpis.currentSet },
  { label: "Listas activas", value: workbenchKpis.activeLists },
  { label: "Rutas automáticas", value: workbenchKpis.automationPaths },
  { label: "Evidencia", value: workbenchKpis.evidenceFormats },
]

export function KpiStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border bg-card px-4 py-3"
        >
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="font-heading mt-1 text-sm font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
