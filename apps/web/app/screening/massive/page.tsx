"use client"

import Link from "next/link"
import { useState } from "react"
import {
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  AlertTriangle,
  Users,
} from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { ScreeningSetSelector } from "@/components/workbench/screening-set-selector"
import { MetricTile } from "@/components/maia/metric-tile"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { massiveBatch, massiveRows } from "@/lib/mock-data"
import { cn } from "@workspace/ui/lib/utils"

const processSteps = [
  "Carga de archivo",
  "Normalización NLP",
  "Screening masivo",
  "Elevación de excepciones",
]

export default function MassivePage() {
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle")
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const { toast } = useMaiaToast()

  function runBatch() {
    setPhase("processing")
    setProgress(0)
    setCurrentStep(0)
    let current = 0
    const timer = setInterval(() => {
      current += 4
      setProgress(Math.min(current, 100))
      setCurrentStep(Math.min(Math.floor(current / 25), 3))
      if (current >= 100) {
        clearInterval(timer)
        setPhase("done")
        toast(
          `Lote procesado: ${massiveBatch.exceptions} excepciones elevadas`,
          "success"
        )
      }
    }, 100)
  }

  const exceptions = massiveRows.filter((r) => r.status === "Exception")

  return (
    <WorkbenchShell
      variant="work"
      tabTitle="Massive"
      hint="Carga un lote. MAIA procesa todo y solo te muestra las excepciones."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card className="maia-fade-up shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Carga masiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300",
                  dragOver
                    ? "border-foreground bg-muted/50 scale-[1.01]"
                    : "border-border bg-muted/20",
                  phase === "processing" && "border-foreground/30 bg-muted/40"
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  runBatch()
                }}
              >
                {phase === "idle" ? (
                  <>
                    <Upload
                      className={cn(
                        "mb-3 size-8 transition-colors",
                        dragOver
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                    <p className="text-sm font-medium">
                      {dragOver
                        ? "Suelta el archivo aquí"
                        : "Arrastra TXT, Excel o PDF"}
                    </p>
                    <p className="mt-1 max-w-md text-xs text-muted-foreground">
                      MAIA estructura, deduplica y screenea. Solo las
                      excepciones llegan al analista.
                    </p>
                    <Button
                      className="mt-5 shadow-sm"
                      onClick={runBatch}
                    >
                      <FileSpreadsheet className="mr-2 size-4" />
                      Cargar lote de ejemplo
                    </Button>
                  </>
                ) : phase === "processing" ? (
                  <div className="w-full max-w-md space-y-4">
                    <p className="text-sm font-medium">Procesando lote…</p>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground transition-[width] duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {progress}% · {processSteps[currentStep]}
                    </p>
                    <div className="flex justify-center gap-2">
                      {processSteps.map((step, i) => (
                        <span
                          key={step}
                          className={cn(
                            "size-2 rounded-full transition-colors",
                            i <= currentStep
                              ? "bg-foreground"
                              : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 maia-scale-in">
                    <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
                    <p className="text-sm font-medium">Lote listo</p>
                    <p className="text-xs text-muted-foreground">
                      {massiveBatch.exceptions} excepciones elevadas ·{" "}
                      {massiveBatch.autoReady.toLocaleString()} auto-listos
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setPhase("idle")
                        setProgress(0)
                      }}
                    >
                      Cargar otro lote
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="maia-stagger grid gap-3 sm:grid-cols-3">
            <MetricTile
              label="Procesados"
              value={massiveBatch.total.toLocaleString()}
              icon={Users}
            />
            <MetricTile
              label="Auto-listos"
              value={massiveBatch.autoReady.toLocaleString()}
              hint={`${Math.round((massiveBatch.autoReady / massiveBatch.total) * 100)}%`}
              trendUp
            />
            <MetricTile
              label="Excepciones"
              value={massiveBatch.exceptions}
              icon={AlertTriangle}
              trend={`${massiveBatch.critical} críticas`}
              trendUp={false}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold">
                Solo excepciones y críticos
              </h3>
              <Badge variant="outline">
                {exceptions.length} en muestra · {massiveBatch.exceptions} total
              </Badge>
            </div>
            <div className="overflow-x-auto rounded-xl border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Normalizado</TableHead>
                    <TableHead>Calidad</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exceptions.map((row) => (
                    <TableRow
                      key={row.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="max-w-[180px] truncate text-xs">
                        {row.raw}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/screening/individual?q=${encodeURIComponent(row.structured)}`}
                          className="font-medium underline-offset-2 hover:underline"
                        >
                          {row.structured}
                        </Link>
                      </TableCell>
                      <TableCell>{row.quality}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-amber-200 text-amber-800"
                        >
                          Excepción
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <ScreeningSetSelector compact />
      </div>
    </WorkbenchShell>
  )
}
