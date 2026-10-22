"use client"

import { useState } from "react"
import { Shield, ToggleLeft, ToggleRight } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { RiskBadge } from "@/components/maia/risk-badge"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { policyRules } from "@/lib/mock-data"
import { cn } from "@workspace/ui/lib/utils"

export default function PolicyPage() {
  const [selectedId, setSelectedId] = useState(policyRules[0]!.id)
  const [enabledRules, setEnabledRules] = useState<string[]>(
    policyRules.map((r) => r.id)
  )
  const { toast } = useMaiaToast()
  const selected = policyRules.find((r) => r.id === selectedId) ?? policyRules[0]!

  function toggleRule(id: string) {
    const next = enabledRules.includes(id)
      ? enabledRules.filter((r) => r !== id)
      : [...enabledRules, id]
    const rule = policyRules.find((r) => r.id === id)
    setEnabledRules(next)
    toast(
      `Regla "${rule?.name}" ${next.includes(id) ? "activada" : "desactivada"}`,
      "info"
    )
  }

  return (
    <WorkbenchShell
      variant="work"
      tabTitle="Policy"
      demoData
      hint="Reglas que MAIA aplica en cada análisis."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card className="maia-fade-up shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-base">
              Reglas de riesgo
            </CardTitle>
            <Badge variant="secondary">
              {enabledRules.length}/{policyRules.length} activas
            </Badge>
          </CardHeader>
          <CardContent className="maia-stagger space-y-2">
            {policyRules.map((rule) => {
              const active = rule.id === selected.id
              const enabled = enabledRules.includes(rule.id)
              return (
                <div
                  key={rule.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3.5 transition-[background-color,border-color,box-shadow,opacity] duration-200",
                    active
                      ? "border-foreground bg-muted/40 ring-1 ring-foreground/10 shadow-sm"
                      : "hover:bg-muted/20",
                    !enabled && "opacity-50"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(rule.id)}
                    className="flex-1 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <p className="text-sm font-medium">{rule.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Decisión: {rule.decision}
                    </p>
                  </button>
                  <div className="flex items-center gap-2">
                    <RiskBadge
                      level={
                        rule.criticality === "critical"
                          ? "high"
                          : rule.criticality
                      }
                    />
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      aria-label={`Regla ${rule.name}`}
                      onClick={() => toggleRule(rule.id)}
                      className="rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {enabled ? (
                        <ToggleRight className="size-6 text-foreground" />
                      ) : (
                        <ToggleLeft className="size-6" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card key={selected.id} className="maia-scale-in sticky top-20 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-muted-foreground" />
              <CardTitle className="font-heading text-base">
                Regla seleccionada
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">{selected.name}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-muted-foreground">Decisión</p>
                <p className="mt-1 font-medium">{selected.decision}</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-muted-foreground">Confianza mín.</p>
                <p className="mt-1 font-medium">95%+</p>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3 text-sm">
              <p className="text-muted-foreground">Impacto estimado</p>
              <p className="mt-1 font-medium">
                {selected.criticality === "critical"
                  ? "Bloqueo automático de onboarding"
                  : "Revisión humana requerida"}
              </p>
            </div>
            <AgentReasoningCard text="La exposición a sanciones activas bloquea el onboarding por defecto. Solo override humano autorizado." />
            <Button
              className="w-full shadow-sm"
              onClick={() =>
                toast("Policy builder — disponible en fase siguiente", "info")
              }
            >
              Abrir policy builder
            </Button>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
