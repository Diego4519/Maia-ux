"use client"

import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Shield } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { ScreeningSetSelector } from "@/components/workbench/screening-set-selector"
import { DecisionPanel } from "@/components/workbench/decision-panel"
import { FlowStepper } from "@/components/workbench/flow-stepper"
import { EmptyState } from "@/components/maia/empty-state"
import { RiskBadge } from "@/components/maia/risk-badge"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { useWorkbench } from "@/lib/workbench-context"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import type { ScreeningMatch, SubjectProfile } from "@/lib/mock-data"
import type { ScreeningSearchResult } from "@/lib/screening-service"
import { cn } from "@workspace/ui/lib/utils"

const loadingStages = [
  { label: "Normalización de nombre", delay: 0 },
  { label: "PEP · Sanciones · Medios", delay: 300 },
  { label: "Score de confianza", delay: 600 },
]

function IndividualContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")?.trim() ?? ""
  const hasSearched = query.length > 0
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScreeningSearchResult | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [loadingStage, setLoadingStage] = useState(0)
  const { toast } = useMaiaToast()
  const { recordDecision } = useWorkbench()

  useEffect(() => {
    if (!hasSearched) {
      setResult(null)
      setSelectedMatchId(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setLoadingStage(0)

    const stageTimers = loadingStages.map((s, i) =>
      setTimeout(() => {
        if (!cancelled) setLoadingStage(i + 1)
      }, s.delay + 200)
    )

    const started = Date.now()
    fetch(`/api/screening/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then(async (data: ScreeningSearchResult) => {
        const wait = Math.max(0, 1200 - (Date.now() - started))
        if (wait) await new Promise((r) => setTimeout(r, wait))
        if (!cancelled) {
          setResult(data)
          setSelectedMatchId(data.matches[0]?.id ?? null)
        }
      })
      .catch(() => {
        if (!cancelled) setResult(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      stageTimers.forEach(clearTimeout)
    }
  }, [query, hasSearched])

  const profile: SubjectProfile | null = result?.profile ?? null
  const matches: ScreeningMatch[] = result?.matches ?? []
  const primary =
    matches.find((m) => m.id === selectedMatchId) ?? matches[0] ?? null

  const activeStep: 1 | 2 | 3 = !hasSearched
    ? 1
    : loading
      ? 2
      : primary
        ? 3
        : 2

  return (
    <WorkbenchShell
      variant="work"
      tabTitle="Individual"
      hint="Busca → analiza → decide. Una sola pantalla."
      showSearch
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FlowStepper activeStep={activeStep} />
        <p className="text-xs text-muted-foreground">
          Paso {activeStep} de 3 · excepciones primero
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {!hasSearched ? (
            <EmptyState
              icon={Search}
              title="Empieza con una búsqueda"
              description="Escribe un nombre arriba o elige una excepción pendiente."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/screening/overview">Ver excepciones pendientes</Link>
                </Button>
              }
            />
          ) : loading ? (
            <Card className="maia-fade-in overflow-hidden border-foreground/10 shadow-sm">
              <CardContent className="space-y-5 py-10">
                <div className="flex items-center gap-3 text-sm">
                  <div className="relative flex size-5 items-center justify-center">
                    <span className="absolute size-5 animate-ping rounded-full bg-foreground/20" />
                    <Shield className="relative size-5 text-foreground" />
                  </div>
                  <span className="font-medium">
                    MAIA cruzando 7 listas activas…
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consulta: &quot;{query}&quot;
                </p>
                <div className="space-y-3">
                  {loadingStages.map((stage, i) => (
                    <div key={stage.label} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>{stage.label}</span>
                        <span
                          className={cn(
                            loadingStage > i
                              ? "font-medium text-emerald-600"
                              : "maia-pulse-soft"
                          )}
                        >
                          {loadingStage > i ? "OK" : "en curso"}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          loadingStage > i ? "bg-foreground" : "maia-shimmer"
                        )}
                        style={{
                          width: loadingStage > i ? "100%" : `${60 - i * 15}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : profile ? (
            <>
              <Card className="maia-fade-up shadow-sm">
                <CardHeader>
                  <CardTitle className="font-heading text-base">
                    Resultado del análisis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Consulta: &quot;{query}&quot;
                      </p>
                      <p className="mt-1.5 font-heading text-lg font-semibold">
                        {profile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profile.document} · {profile.nationality}
                      </p>
                    </div>
                    <Badge variant="secondary">Normalizado</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
                    MAIA analizó {profile.name} en 7 listas activas ·{" "}
                    {matches.length} coincidencia
                    {matches.length === 1 ? "" : "s"}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h3 className="font-heading text-sm font-semibold">
                  Coincidencias encontradas
                </h3>
                {matches.length === 0 ? (
                  <EmptyState
                    icon={Shield}
                    title="Sin coincidencias críticas"
                    description="Puedes aceptar con monitoreo estándar."
                  />
                ) : (
                  <div className="maia-stagger space-y-2">
                    {matches.map((match) => {
                      const selected = match.id === primary?.id
                      return (
                        <button
                          key={match.id}
                          type="button"
                          onClick={() => setSelectedMatchId(match.id)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                            selected
                              ? "border-foreground bg-muted/40 ring-1 ring-foreground/10 shadow-sm"
                              : "border-border hover:bg-muted/20 hover:shadow-sm"
                          )}
                        >
                          <div>
                            <p className="text-sm font-medium">{match.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {match.source} · {match.confidence}% confianza
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <RiskBadge level={match.riskLevel} />
                            {match.status === "Pendiente" ? (
                              <Badge variant="outline">Pendiente</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {match.status}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="Sin resultados"
              description="No se pudo cargar el resultado. Intenta otra búsqueda."
            />
          )}
        </div>

        <div className="space-y-4">
          <ScreeningSetSelector />
          {hasSearched && primary && result ? (
            <DecisionPanel
              name={primary.name}
              confidence={primary.confidence}
              riskLevel={primary.riskLevel}
              caseId={`IND-${profile.id.replace("sub-", "")}`}
              reasoning={result.reasoning}
              sourceCoverage={result.sourceCoverage}
              onDecide={(action) => {
                if (!action || !primary) return
                const evidenceId = recordDecision({
                  name: primary.name,
                  action,
                  riskLevel: primary.riskLevel,
                })
                const msg =
                  action === "accept"
                    ? "Decisión registrada: aceptar con mitigantes"
                    : action === "reject"
                      ? "Decisión registrada: rechazar onboarding"
                      : "Caso escalado a revisión humana"
                toast(msg, action === "reject" ? "error" : action === "escalate" ? "info" : "success", {
                  action: {
                    label: "Ver evidencia",
                    href: `/screening/evidence?highlight=${evidenceId}`,
                  },
                })
              }}
            />
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                El panel de decisión aparece después del análisis.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </WorkbenchShell>
  )
}

export default function IndividualPage() {
  return (
    <Suspense fallback={null}>
      <IndividualContent />
    </Suspense>
  )
}
