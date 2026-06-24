import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { RiskBadge } from "@/components/maia/risk-badge"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { evidenceCases } from "@/lib/mock-data"

export default function EvidencePage() {
  const selected = evidenceCases[0]!

  return (
    <WorkbenchShell
      breadcrumb="MAIA Compliance Hub › Screening Team › Evidence"
      description="Historial de cada análisis. Busca una persona arriba y el resultado queda guardado aquí."
      actionLabel="Buscar evidencia"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Snapshot original, sin recálculo. La evidencia descarga tal como
            existió al momento de ejecución.
          </p>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Repositorio histórico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {evidenceCases.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.caseNumber} — {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.mode} · {item.date}
                    </p>
                  </div>
                  <RiskBadge level={item.riskLevel} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Paquete de evidencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{selected.name}</p>
              <p className="text-xs text-muted-foreground">
                {selected.caseNumber}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <RiskBadge level={selected.riskLevel} />
              <Badge variant="secondary">{selected.mode}</Badge>
            </div>
            <p className="text-sm">
              Decisión humana:{" "}
              <span className="font-medium">{selected.decision}</span>
            </p>
            <AgentReasoningCard text="MAIA analizó PEP y medios adversos con alta confianza. El humano aceptó con mitigantes y el snapshot quedó bloqueado." />
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
