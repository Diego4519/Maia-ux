"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { RiskBadge } from "@/components/maia/risk-badge"
import { ScoreBreakdown } from "@/components/maia/score-breakdown"
import { AdverseMediaList } from "@/components/maia/adverse-media-list"
import type {
  AdverseMediaItem,
  ScreeningMatch,
  SubjectProfile,
} from "@/lib/mock-data"
import type { SourceCoverageItem } from "@/lib/demo-profiles"
import { cn } from "@workspace/ui/lib/utils"

interface PersonDetailProps {
  query: string
  profile: SubjectProfile
  matches: ScreeningMatch[]
  selectedMatchId: string | null
  onSelectMatch: (id: string) => void
  adverseMedia: AdverseMediaItem[]
  sourceCoverage: SourceCoverageItem[]
  mockMode?: boolean
}

export function PersonDetail({
  query,
  profile,
  matches,
  selectedMatchId,
  onSelectMatch,
  adverseMedia,
  sourceCoverage,
  mockMode,
}: PersonDetailProps) {
  const primary =
    matches.find((m) => m.id === selectedMatchId) ?? matches[0] ?? null

  const [tab, setTab] = useState("resumen")
  const negativeMedia = adverseMedia.filter(
    (a) => a.sentiment === "negative"
  ).length
  const notScreenedCount = sourceCoverage.filter(
    (s) => s.status === "not_screened"
  ).length
  const mediaCoverage = sourceCoverage.find((s) =>
    s.name.toLowerCase().includes("medios")
  )?.status

  // El llenado de barras ocurre una vez por resultado; al volver a la pestaña ya están llenas.
  const [intro, setIntro] = useState(true)
  const introKey = `${profile.id}:${primary?.id ?? ""}`
  useEffect(() => {
    setIntro(true)
    const t = setTimeout(() => setIntro(false), 1500)
    return () => clearTimeout(t)
  }, [introKey])

  return (
    <Card className="maia-fade-up maia-card border-0 shadow-none">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Consulta: &quot;{query}&quot;
              {mockMode ? (
                <span className="ml-2 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Demo / mock
                </span>
              ) : null}
            </p>
            <CardTitle className="font-heading mt-1.5 text-lg font-bold">
              {profile.name}
            </CardTitle>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {profile.document} · {profile.nationality}
              {profile.birthdate !== "—" ? ` · ${profile.birthdate}` : ""}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs value={tab} onValueChange={setTab} className="gap-4">
          <TabsList variant="line" className="w-full justify-start gap-0">
            <TabsTrigger value="resumen" className="px-3 text-xs sm:text-sm">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="coincidencias" className="px-3 text-xs sm:text-sm">
              Coincidencias
              {matches.length > 0 ? (
                <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                  {matches.length}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="medios" className="px-3 text-xs sm:text-sm">
              Medios adversos
              {adverseMedia.length > 0 ? (
                <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                  {adverseMedia.length}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="fuentes" className="px-3 text-xs sm:text-sm">
              Fuentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="maia-enter space-y-4 text-sm">
            <div className="space-y-1.5 rounded-lg border bg-muted/30 px-3 py-2.5 text-muted-foreground">
              <p>
                MAIA analizó {profile.name} · {matches.length} coincidencia
                {matches.length === 1 ? "" : "s"}
              </p>
              {negativeMedia > 0 ? (
                <p className="text-foreground">
                  {negativeMedia}{" "}
                  {negativeMedia === 1
                    ? "medio adverso negativo"
                    : "medios adversos negativos"}
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setTab("medios")}
                    className="font-medium underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Ver medios adversos
                  </button>
                </p>
              ) : null}
              {notScreenedCount > 0 ? (
                <p>
                  {notScreenedCount}{" "}
                  {notScreenedCount === 1
                    ? "fuente no consultada"
                    : "fuentes no consultadas"}
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setTab("fuentes")}
                    className="font-medium underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Ver fuentes
                  </button>
                </p>
              ) : null}
            </div>
            {primary?.scoreBreakdown ? (
              <ScoreBreakdown
                key={introKey}
                factors={primary.scoreBreakdown}
                engineScore={primary.score}
                matchLabel={`${primary.name} · ${primary.source}`}
                animate={intro}
              />
            ) : (
              <ScoreBreakdown
                factors={[]}
                engineScore={primary?.score}
              />
            )}
            {matches.length > 1 ? (
              <p className="text-[11px] text-muted-foreground">
                Mostrando la coincidencia seleccionada.{" "}
                <button
                  type="button"
                  onClick={() => setTab("coincidencias")}
                  className="font-medium underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Cambiar coincidencia
                </button>
              </p>
            ) : null}
          </TabsContent>

          <TabsContent value="coincidencias" className="space-y-2">
            {matches.length === 0 ? (
              <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                Sin coincidencias críticas en listas activas.
              </p>
            ) : (
              matches.map((match, index) => {
                const selected = match.id === primary?.id
                return (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => onSelectMatch(match.id)}
                    style={{ "--i": index } as CSSProperties}
                    className={cn(
                      "maia-enter flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "border-foreground bg-muted/40 shadow-sm ring-1 ring-foreground/10"
                        : "border-border hover:bg-muted/20 hover:shadow-sm"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">{match.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {match.source} · score {match.score} ·{" "}
                        {match.confidence}% confianza
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
              })
            )}
          </TabsContent>

          <TabsContent value="medios">
            <AdverseMediaList items={adverseMedia} coverage={mediaCoverage} />
          </TabsContent>

          <TabsContent value="fuentes">
            <div className="space-y-2 rounded-xl border bg-muted/15 p-3">
              {sourceCoverage.map((s, index) => (
                <div
                  key={s.name}
                  style={{ "--i": index } as CSSProperties}
                  className="maia-enter flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{s.name}</span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      s.status === "found" && "text-foreground",
                      s.status === "not_found" && "text-muted-foreground",
                      s.status === "not_screened" && "text-amber-700 dark:text-amber-400"
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
