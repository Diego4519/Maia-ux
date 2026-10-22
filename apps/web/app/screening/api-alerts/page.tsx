"use client"

import { useMemo, useState } from "react"
import { PartyPopper } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { DecisionPanel } from "@/components/workbench/decision-panel"
import type { DecisionAction } from "@/components/workbench/decision-panel"
import { EmptyState } from "@/components/maia/empty-state"
import { RiskBadge } from "@/components/maia/risk-badge"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { useWorkbench } from "@/lib/workbench-context"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  apiAlerts,
  sourceCoverage as demoSourceCoverage,
} from "@/lib/mock-data"
import { submitDecisionFeedback } from "@/lib/api/decisions"
import { cn } from "@workspace/ui/lib/utils"

export default function ApiAlertsPage() {
  const [filter, setFilter] = useState<"needs_resolution" | "all">(
    "needs_resolution"
  )
  const [selectedId, setSelectedId] = useState<string | null>(
    apiAlerts.find((a) => a.status === "needs_resolution")?.id ?? null
  )
  const [resolvedIds, setResolvedIds] = useState<string[]>([])
  const { toast } = useMaiaToast()
  const { recordDecision, resolveAlert, resolvedAlertIds } = useWorkbench()

  const allResolved = useMemo(
    () => [...new Set([...resolvedIds, ...resolvedAlertIds])],
    [resolvedIds, resolvedAlertIds]
  )

  const filtered = useMemo(() => {
    const base =
      filter === "needs_resolution"
        ? apiAlerts.filter(
            (a) =>
              a.status === "needs_resolution" && !allResolved.includes(a.id)
          )
        : apiAlerts.map((a) =>
            allResolved.includes(a.id)
              ? { ...a, status: "resolved" as const }
              : a
          )
    return base
  }, [filter, allResolved])

  const selected =
    filtered.find((a) => a.id === selectedId) ?? filtered[0] ?? null

  async function handleDecision(
    alertId: string,
    name: string,
    riskLevel: (typeof apiAlerts)[0]["riskLevel"],
    action: Exclude<DecisionAction, null>,
    caseId: string
  ) {
    const feedback = await submitDecisionFeedback({
      caseId,
      matchId: alertId,
      action,
      riskLevel,
      name,
      demo: true,
    })

    const evidenceId = recordDecision({
      name,
      action,
      riskLevel,
      mode: "API",
    })
    setResolvedIds((ids) => [...ids, alertId])
    resolveAlert(alertId)
    setSelectedId(null)

    const msg =
      action === "accept"
        ? "Alerta API resuelta: aceptar con mitigantes"
        : action === "reject"
          ? "Alerta API resuelta: rechazada"
          : "Alerta API escalada a revisión humana"

    toast(
      feedback.mockMode ? `${msg} (demostración)` : msg,
      action === "reject" ? "error" : action === "escalate" ? "info" : "success",
      {
        action: {
          label: "Ver evidencia",
          href: `/screening/evidence?highlight=${evidenceId}`,
        },
      }
    )

    return { mockMode: !!feedback.mockMode }
  }

  return (
    <WorkbenchShell
      variant="work"
      tabTitle="API Alerts"
      demoData
      hint="Solo alertas que requieren tu decisión."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filter === "needs_resolution" ? "default" : "outline"}
              aria-pressed={filter === "needs_resolution"}
              onClick={() => setFilter("needs_resolution")}
            >
              Requieren resolución
            </Button>
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Badge variant="secondary" className="ml-auto self-center">
              {filtered.length} en bandeja
            </Badge>
          </div>

          <Card className="maia-fade-up shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Bandeja de eventos API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={PartyPopper}
                  title="Bandeja limpia"
                  description="No hay alertas pendientes. MAIA resolvió todo automáticamente."
                />
              ) : (
                <div className="maia-stagger space-y-2">
                  {filtered.map((alert) => {
                    const active = selected?.id === alert.id
                    return (
                      <button
                        key={alert.id}
                        type="button"
                        onClick={() => setSelectedId(alert.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active
                            ? "border-foreground bg-muted/40 ring-1 ring-foreground/10 shadow-sm"
                            : "hover:bg-muted/20 hover:shadow-sm"
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium">{alert.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.caseId} · {alert.confidence}% confianza
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <RiskBadge level={alert.riskLevel} />
                          {alert.status === "needs_resolution" ? (
                            <Badge variant="outline">Pendiente</Badge>
                          ) : (
                            <Badge variant="secondary">Resuelto</Badge>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selected ? (
          <DecisionPanel
            name={selected.name}
            confidence={selected.confidence}
            riskLevel={selected.riskLevel}
            caseId={selected.caseId}
            reasoning={selected.reasoning}
            sourceCoverage={demoSourceCoverage}
            decisionLabel="Escalar"
            onDecide={async (action) => {
              if (!action || !selected) return false
              return handleDecision(
                selected.id,
                selected.name,
                selected.riskLevel,
                action,
                selected.caseId
              )
            }}
          />
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Selecciona una alerta para decidir.
            </CardContent>
          </Card>
        )}
      </div>
    </WorkbenchShell>
  )
}

