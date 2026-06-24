import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { ScreeningSetSelector } from "@/components/workbench/screening-set-selector"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { dataSources } from "@/lib/mock-data"

export default function SourcesPage() {
  return (
    <WorkbenchShell
      breadcrumb="MAIA Compliance Hub › Screening Team › Sources"
      description="Listas que MAIA consulta al analizar. La búsqueda de arriba usa estas fuentes."
      actionLabel="Gestionar fuentes"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Fuentes configuradas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {source.type} · Sync {source.lastSync}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Activa</Badge>
                    <Button size="sm" variant="ghost">
                      Probar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <AgentReasoningCard text="MAIA usa calidad, frescura y cobertura de cada fuente para calcular confianza y criticidad. Configura una vez, reutiliza en todos los flujos." />
        </div>

        <ScreeningSetSelector compact />
      </div>
    </WorkbenchShell>
  )
}
