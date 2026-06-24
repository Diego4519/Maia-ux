import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { RiskBadge } from "@/components/maia/risk-badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { policyRules } from "@/lib/mock-data"

export default function PolicyPage() {
  const primary = policyRules[0]!

  return (
    <WorkbenchShell
      breadcrumb="MAIA Compliance Hub › Screening Team › Policy"
      description="Reglas que MAIA aplica al analizar. Cada búsqueda de arriba pasa por estas políticas."
      actionLabel="Gestionar política"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Reglas de riesgo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {policyRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Decisión: {rule.decision}
                  </p>
                </div>
                <RiskBadge
                  level={
                    rule.criticality === "critical"
                      ? "high"
                      : rule.criticality
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Regla seleccionada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">{primary.name}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Decisión</p>
                <p className="font-medium">{primary.decision}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Confianza mín.</p>
                <p className="font-medium">95%+</p>
              </div>
            </div>
            <AgentReasoningCard text="La exposición a sanciones activas bloquea el onboarding por defecto. Solo override humano autorizado." />
            <Button className="w-full">Abrir policy builder</Button>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
