import { RiskBadge } from "@/components/maia/risk-badge"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import type { RiskLevel } from "@/lib/mock-data"
import { sourceCoverage } from "@/lib/mock-data"

interface DecisionPanelProps {
  name: string
  confidence: number
  riskLevel: RiskLevel
  caseId: string
  reasoning: string
  decisionLabel?: string
}

export function DecisionPanel({
  name,
  confidence,
  riskLevel,
  caseId,
  reasoning,
  decisionLabel = "Revisión humana",
}: DecisionPanelProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="font-heading text-base">
          Superficie de decisión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">Caso {caseId}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confianza</span>
            <span className="font-semibold">{confidence}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <RiskBadge level={riskLevel} />
          <Badge variant="outline">{decisionLabel}</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Cobertura de fuentes
          </p>
          <div className="space-y-1">
            {sourceCoverage.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between text-xs"
              >
                <span>{s.name}</span>
                <span
                  className={
                    s.status === "found"
                      ? "text-emerald-600"
                      : s.status === "not_found"
                        ? "text-muted-foreground"
                        : "text-amber-600"
                  }
                >
                  {s.status === "found"
                    ? "Encontrado"
                    : s.status === "not_found"
                      ? "Sin match"
                      : "No screeneado"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AgentReasoningCard text={reasoning} />
      </CardContent>
    </Card>
  )
}
