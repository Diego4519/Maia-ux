"use client"

import Link from "next/link"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { RefreshCw, Search, TriangleAlert } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { ScreeningSetSelector } from "@/components/workbench/screening-set-selector"
import {
  DecisionPanel,
  type DecisionAction,
  type DecisionExtras,
  type DecisionResult,
} from "@/components/workbench/decision-panel"
import { FlowStepper } from "@/components/workbench/flow-stepper"
import { EmptyState } from "@/components/maia/empty-state"
import { PersonDetail } from "@/components/maia/person-detail"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { useWorkbench } from "@/lib/workbench-context"
import { searchScreeningClient } from "@/lib/api/screening"
import { submitDecisionFeedback } from "@/lib/api/decisions"
import type { ScreeningSearchResponse } from "@/lib/api/types"
import type { RiskLevel } from "@/lib/mock-data"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

/** Evita un parpadeo del esqueleto cuando la respuesta es casi inmediata. */
const MIN_LOADING_MS = 300

function IndividualContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")?.trim() ?? ""
  const hasSearched = query.length > 0
  const [loading, setLoading] = useState(hasSearched)
  const [result, setResult] = useState<ScreeningSearchResponse | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [closing, setClosing] = useState(false)
  const { toast } = useMaiaToast()
  const { recordDecision } = useWorkbench()

  useEffect(() => {
    if (!hasSearched) {
      setResult(null)
      setSelectedMatchId(null)
      setSearchError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setSearchError(null)

    const started = Date.now()
    searchScreeningClient(query)
      .then(async (data) => {
        const wait = Math.max(0, MIN_LOADING_MS - (Date.now() - started))
        if (wait) await new Promise((r) => setTimeout(r, wait))
        if (!cancelled) {
          setResult(data)
          setSelectedMatchId(data.matches[0]?.id ?? null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResult(null)
          setSelectedMatchId(null)
          setSearchError(
            err instanceof Error
              ? err.message
              : "No se pudo completar la búsqueda."
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, hasSearched, attempt])

  const profile = result?.profile ?? null
  const matches = result?.matches ?? []
  const primary =
    matches.find((m) => m.id === selectedMatchId) ?? matches[0] ?? null
  const demoData = result ? (result.mockMode ?? result.source === "mock") : false
  const caseId = result ? `IND-${result.profile.id.replace("sub-", "")}` : ""

  /** Único camino de decisión: lo usan el panel y el cierre sin coincidencias. */
  const registerDecision = useCallback(
    async (
      action: Exclude<DecisionAction, null>,
      extras: DecisionExtras,
      target: { matchId?: string; name: string; riskLevel: RiskLevel }
    ): Promise<DecisionResult> => {
      if (!result) throw new Error("No hay un resultado activo.")

      const feedback = await submitDecisionFeedback({
        caseId,
        matchId: target.matchId,
        subjectId: result.profile.id,
        action,
        engineAgreement: extras.engineAgreement,
        comment: extras.comment,
        riskLevel: target.riskLevel,
        name: target.name,
        demo: demoData,
      })

      const evidenceId = recordDecision({
        name: target.name,
        action,
        riskLevel: target.riskLevel,
      })

      const msg =
        action === "accept"
          ? "Decisión registrada: aceptar con mitigantes"
          : action === "reject"
            ? "Decisión registrada: rechazar onboarding"
            : "Caso escalado a revisión humana"

      toast(
        feedback.mockMode ? `${msg} (demostración)` : msg,
        action === "reject"
          ? "error"
          : action === "escalate"
            ? "info"
            : "success",
        {
          action: {
            label: "Ver evidencia",
            href: `/screening/evidence?highlight=${evidenceId}`,
          },
        }
      )

      return { mockMode: !!feedback.mockMode, status: feedback.status }
    },
    [result, caseId, demoData, recordDecision, toast]
  )

  const activeStep: 1 | 2 | 3 = !hasSearched
    ? 1
    : loading
      ? 2
      : primary || (result && matches.length === 0)
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
                  <Link href="/screening/overview">
                    Ver excepciones pendientes
                  </Link>
                </Button>
              }
            />
          ) : loading ? (
            <Card
              className="maia-fade-in maia-card overflow-hidden border-0 shadow-none"
              aria-busy="true"
            >
              <CardContent className="space-y-5 py-8">
                <div role="status" className="space-y-1">
                  <p className="text-sm font-medium">
                    Consultando listas y calculando el score…
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Consulta: &quot;{query}&quot;
                  </p>
                </div>
                <div className="space-y-2" aria-hidden>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2" aria-hidden>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="space-y-3" aria-hidden>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : searchError ? (
            <EmptyState
              icon={TriangleAlert}
              title="No se pudo completar la búsqueda"
              description={`${searchError} Esto no significa que la persona esté limpia: no hay resultado que mostrar.`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAttempt((n) => n + 1)}
                >
                  <RefreshCw className="mr-1.5 size-3.5" aria-hidden />
                  Reintentar
                </Button>
              }
            />
          ) : profile && result ? (
            <PersonDetail
              query={query}
              profile={profile}
              matches={matches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={setSelectedMatchId}
              adverseMedia={result.adverseMedia ?? []}
              sourceCoverage={result.sourceCoverage}
              mockMode={demoData}
            />
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
              caseId={caseId}
              reasoning={result.reasoning}
              sourceCoverage={result.sourceCoverage}
              onDecide={(action, extras) =>
                registerDecision(action, extras, {
                  matchId: primary.id,
                  name: primary.name,
                  riskLevel: primary.riskLevel,
                })
              }
            />
          ) : hasSearched && result && !primary && !loading ? (
            <Card className="border-dashed">
              <CardContent className="space-y-3 py-8 text-center text-sm text-muted-foreground">
                <p>
                  Sin coincidencias críticas. Puedes cerrar con monitoreo
                  estándar.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={closing}
                  onClick={async () => {
                    setClosing(true)
                    try {
                      await registerDecision(
                        "accept",
                        {},
                        {
                          name: result.profile.name,
                          riskLevel: "low",
                        }
                      )
                    } catch (err) {
                      toast(
                        err instanceof Error
                          ? err.message
                          : "No se pudo registrar tu decisión.",
                        "error"
                      )
                    } finally {
                      setClosing(false)
                    }
                  }}
                >
                  {closing ? "Registrando…" : "Aceptar con monitoreo"}
                </Button>
              </CardContent>
            </Card>
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
