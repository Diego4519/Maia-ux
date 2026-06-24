"use client"

import { useState } from "react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { DecisionPanel } from "@/components/workbench/decision-panel"
import { RiskBadge } from "@/components/maia/risk-badge"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { agentReasoningDefault, apiAlerts } from "@/lib/mock-data"

export default function ApiAlertsPage() {
  const [filter, setFilter] = useState<"needs_resolution" | "all">(
    "needs_resolution"
  )
  const filtered =
    filter === "needs_resolution"
      ? apiAlerts.filter((a) => a.status === "needs_resolution")
      : apiAlerts
  const selected = filtered[0]

  return (
    <WorkbenchShell
      breadcrumb="MAIA Compliance Hub › Screening Team › API Alerts"
      description="Alertas que llegan por API. Para buscar una persona manualmente, usa la barra superior."
      actionLabel="Revisar alertas"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === "needs_resolution" ? "default" : "outline"}
              onClick={() => setFilter("needs_resolution")}
            >
              Requieren resolución
            </Button>
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Bandeja de eventos API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No hay alertas pendientes. Buen trabajo.
                </p>
              ) : (
                filtered.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
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
                        <Button size="sm" variant="outline">
                          Resolver
                        </Button>
                      ) : (
                        <Badge variant="secondary">Resuelto</Badge>
                      )}
                    </div>
                  </div>
                ))
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
            reasoning={agentReasoningDefault}
            decisionLabel="Escalar"
          />
        ) : null}
      </div>
    </WorkbenchShell>
  )
}
