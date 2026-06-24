"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { ScreeningSetSelector } from "@/components/workbench/screening-set-selector"
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
import type { ScreeningMatch, SubjectProfile } from "@/lib/mock-data"
import type { ScreeningSearchResult } from "@/lib/screening-service"

function IndividualContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")?.trim() ?? ""
  const hasSearched = query.length > 0
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScreeningSearchResult | null>(null)

  useEffect(() => {
    if (!hasSearched) {
      setResult(null)
      return
    }

    let cancelled = false
    setLoading(true)

    fetch(`/api/screening/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data: ScreeningSearchResult) => {
        if (!cancelled) setResult(data)
      })
      .catch(() => {
        if (!cancelled) setResult(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, hasSearched])

  const profile: SubjectProfile | null = result?.profile ?? null
  const matches: ScreeningMatch[] = result?.matches ?? []
  const primary = matches[0]

  return (
    <WorkbenchShell
      breadcrumb="MAIA Compliance Hub › Screening Team › Individual"
      description="Busca arriba, MAIA analiza y tú decides solo si hay excepción."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {!hasSearched ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <p className="font-heading text-base font-semibold">
                  Empieza con una búsqueda
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Usa la barra de arriba: escribe un nombre o documento y pulsa{" "}
                  <strong className="font-medium text-foreground">
                    Analizar
                  </strong>
                  . Los resultados aparecen aquí.
                </p>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                MAIA está analizando &quot;{query}&quot;…
              </CardContent>
            </Card>
          ) : profile ? (
            <>
              <Card>
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
                        {result?.source ? (
                          <span className="ml-2 rounded-full border px-2 py-0.5 text-[10px] uppercase">
                            {result.source}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 font-medium">{profile.name}</p>
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
                  <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                    MAIA analizó {profile.name} en 7 listas activas
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h3 className="font-heading text-sm font-semibold">
                  Coincidencias encontradas
                </h3>
                {matches.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-sm text-muted-foreground">
                      Sin coincidencias críticas para esta consulta.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between rounded-lg border px-4 py-3"
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
                            <Button size="sm" variant="outline">
                              Revisar
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {match.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No se pudo cargar el resultado. Revisa la conexión a MongoDB.
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <ScreeningSetSelector />
          {hasSearched && primary && result ? (
            <DecisionPanel
              name={primary.name}
              confidence={primary.confidence}
              riskLevel={primary.riskLevel}
              caseId="IND-001"
              reasoning={result.reasoning}
            />
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                El panel de decisión se muestra después del análisis.
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
