"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Download,
  FileText,
  Lock,
  CheckCircle2,
  Loader2,
} from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
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
import { cn } from "@workspace/ui/lib/utils"

const evidenceTimeline = [
  { step: "Screening ejecutado", time: "12:04:18" },
  { step: "Coincidencias detectadas", time: "12:04:22" },
  { step: "Decisión humana registrada", time: "12:06:41" },
  { step: "Snapshot bloqueado", time: "12:06:42" },
]

function EvidenceContent() {
  const searchParams = useSearchParams()
  const highlight = searchParams.get("highlight")
  const { evidenceCases } = useWorkbench()
  const [selectedId, setSelectedId] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const { toast } = useMaiaToast()

  useEffect(() => {
    if (highlight && evidenceCases.some((e) => e.id === highlight)) {
      setSelectedId(highlight)
      setDownloaded(false)
    }
  }, [highlight, evidenceCases])

  const activeId = selectedId || evidenceCases[0]?.id || ""
  const selected = evidenceCases.find((e) => e.id === activeId) ?? evidenceCases[0]

  function handleDownload() {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      setDownloaded(true)
      toast("Paquete de evidencia descargado (PDF + XLSX)")
    }, 1500)
  }

  return (
    <WorkbenchShell
      variant="work"
      tabTitle="Evidence"
      hint="Historial inmutable. Lo que existió al momento del screening."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card className="maia-fade-up shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">
                Repositorio histórico
              </CardTitle>
              <Badge variant="secondary">{evidenceCases.length} casos</Badge>
            </CardHeader>
            <CardContent className="maia-stagger space-y-2">
              {evidenceCases.map((item) => {
                const active = item.id === activeId
                const isNew = item.id === highlight
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id)
                      setDownloaded(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                      active
                        ? "border-foreground bg-muted/40 ring-1 ring-foreground/10 shadow-sm"
                        : "hover:bg-muted/20",
                      isNew && !active && "border-emerald-200/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg border bg-muted/40">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {item.caseNumber} — {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.mode} · {item.date}
                          {isNew ? " · Nuevo" : ""}
                        </p>
                      </div>
                    </div>
                    <RiskBadge level={item.riskLevel} />
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {selected ? (
          <Card className="maia-scale-in sticky top-20 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-base">
                  Paquete de evidencia
                </CardTitle>
                <Lock className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.caseNumber}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <RiskBadge level={selected.riskLevel} />
                <Badge variant="secondary">{selected.mode}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Lock className="size-3" />
                  Inmutable
                </Badge>
              </div>
              <p className="text-sm">
                Decisión:{" "}
                <span className="font-medium">{selected.decision}</span>
              </p>
              <div className="space-y-0 rounded-lg border bg-muted/20 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Timeline del caso
                </p>
                {evidenceTimeline.map((item, i) => (
                  <div key={item.step} className="flex gap-3 py-2">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          i === evidenceTimeline.length - 1
                            ? "bg-emerald-500"
                            : "bg-foreground"
                        )}
                      />
                      {i < evidenceTimeline.length - 1 ? (
                        <span className="w-px flex-1 bg-border" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{item.step}</p>
                      <p className="text-[10px] tabular-nums text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <AgentReasoningCard text="Snapshot bloqueado al momento de la decisión. Sin recálculo posterior." />
              <Button
                className="w-full shadow-sm"
                variant={downloaded ? "secondary" : "default"}
                disabled={downloading}
                onClick={handleDownload}
              >
                {downloading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : downloaded ? (
                  <CheckCircle2 className="mr-2 size-4" />
                ) : (
                  <Download className="mr-2 size-4" />
                )}
                {downloading
                  ? "Generando paquete…"
                  : downloaded
                    ? "Paquete descargado"
                    : "Descargar PDF · XLSX"}
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </WorkbenchShell>
  )
}

export default function EvidencePage() {
  return (
    <Suspense fallback={null}>
      <EvidenceContent />
    </Suspense>
  )
}
