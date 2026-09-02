"use client"

import { useEffect, useState } from "react"
import { Check, ShieldAlert, X } from "lucide-react"

import { RiskBadge } from "@/components/maia/risk-badge"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import type { RiskLevel } from "@/lib/mock-data"
import type { SourceCoverageItem } from "@/lib/demo-profiles"
import { sourceCoverage as defaultSourceCoverage } from "@/lib/mock-data"
import { cn } from "@workspace/ui/lib/utils"

export type DecisionAction = "accept" | "reject" | "escalate" | null

interface DecisionPanelProps {
  name: string
  confidence: number
  riskLevel: RiskLevel
  caseId: string
  reasoning: string
  sourceCoverage?: SourceCoverageItem[]
  decisionLabel?: string
  interactive?: boolean
  onDecide?: (action: DecisionAction) => void
}

const actionCopy: Record<Exclude<DecisionAction, null>, string> = {
  accept: "Aceptado con mitigantes",
  reject: "Rechazado",
  escalate: "Escalado a revisión",
}

export function DecisionPanel({
  name,
  confidence,
  riskLevel,
  caseId,
  reasoning,
  sourceCoverage = defaultSourceCoverage,
  decisionLabel = "Revisión humana",
  interactive = true,
  onDecide,
}: DecisionPanelProps) {
  const [decision, setDecision] = useState<DecisionAction>(null)
  const [animatedConfidence, setAnimatedConfidence] = useState(0)
  const [deciding, setDeciding] = useState<DecisionAction>(null)

  useEffect(() => {
    setDecision(null)
    setAnimatedConfidence(0)
    const start = performance.now()
    const duration = 700
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedConfidence(Math.round(confidence * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [caseId, confidence, name])

  function decide(action: Exclude<DecisionAction, null>) {
    setDeciding(action)
    setTimeout(() => {
      setDecision(action)
      setDeciding(null)
      onDecide?.(action)
    }, 500)
  }

  return (
    <Card className="maia-scale-in sticky top-20 h-fit overflow-hidden border-border shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-heading text-base">
            Superficie de decisión
          </CardTitle>
          {decision ? (
            <Badge
              variant="secondary"
              className={cn(
                "maia-fade-in",
                decision === "reject" && "border-red-200 bg-red-50 text-red-700",
                decision === "accept" &&
                  "border-emerald-200 bg-emerald-50 text-emerald-700",
                decision === "escalate" &&
                  "border-amber-200 bg-amber-50 text-amber-800"
              )}
            >
              {actionCopy[decision]}
            </Badge>
          ) : (
            <Badge variant="outline">{decisionLabel}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div>
          <p className="font-medium leading-snug">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground">Caso {caseId}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confianza MAIA</span>
            <span className="font-heading font-semibold tabular-nums maia-count-up">
              {animatedConfidence}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-100 ease-out"
              style={{ width: `${animatedConfidence}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <RiskBadge level={riskLevel} />
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Cobertura de fuentes
          </p>
          <div className="space-y-2">
            {sourceCoverage.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between text-xs"
              >
                <span>{s.name}</span>
                <span
                  className={cn(
                    "font-medium",
                    s.status === "found" && "text-emerald-600",
                    s.status === "not_found" && "text-muted-foreground",
                    s.status === "not_screened" && "text-amber-600"
                  )}
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

        {interactive ? (
          <div className="space-y-2 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Decisión humana — una sola superficie
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button
                size="sm"
                variant="outline"
                className="h-10 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                disabled={!!decision || !!deciding}
                onClick={() => decide("accept")}
              >
                <Check className="mr-1 size-3.5" />
                {deciding === "accept" ? "…" : "Aceptar"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-10 border-amber-200 text-amber-800 hover:bg-amber-50"
                disabled={!!decision || !!deciding}
                onClick={() => decide("escalate")}
              >
                <ShieldAlert className="mr-1 size-3.5" />
                {deciding === "escalate" ? "…" : "Escalar"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-10 border-red-200 text-red-700 hover:bg-red-50"
                disabled={!!decision || !!deciding}
                onClick={() => decide("reject")}
              >
                <X className="mr-1 size-3.5" />
                {deciding === "reject" ? "…" : "Rechazar"}
              </Button>
            </div>
            {decision ? (
              <p className="maia-fade-in text-center text-xs text-muted-foreground">
                Evidencia bloqueada · snapshot guardado
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
