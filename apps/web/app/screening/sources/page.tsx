"use client"

import { useState } from "react"
import { Database, Loader2, RefreshCw } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { ScreeningSetSelector } from "@/components/workbench/screening-set-selector"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { dataSources } from "@/lib/mock-data"
import { cn } from "@workspace/ui/lib/utils"

export default function SourcesPage() {
  const [testingId, setTestingId] = useState<string | null>(null)
  const [okIds, setOkIds] = useState<string[]>([])
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const { toast } = useMaiaToast()

  const activeCount = dataSources.filter((s) => s.status === "active").length

  function testSource(id: string, name: string) {
    setTestingId(id)
    setTimeout(() => {
      setTestingId(null)
      setOkIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
      toast(`Fuente ${name} — conexión verificada`)
    }, 900)
  }

  function syncSource(id: string, name: string) {
    setSyncingId(id)
    setTimeout(() => {
      setSyncingId(null)
      toast(`Fuente ${name} sincronizada correctamente`)
    }, 1200)
  }

  return (
    <WorkbenchShell
      variant="work"
      tabTitle="Sources"
      hint="Listas que MAIA consulta al analizar."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Card className="maia-fade-up shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">
                Fuentes configuradas
              </CardTitle>
              <Badge variant="secondary">
                {activeCount}/{dataSources.length} activas
              </Badge>
            </CardHeader>
            <CardContent className="maia-stagger space-y-2">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200 hover:shadow-sm",
                    okIds.includes(source.id) && "border-emerald-200",
                    source.status === "inactive" && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg border",
                        source.status === "active"
                          ? "bg-muted/40"
                          : "bg-muted/20"
                      )}
                    >
                      <Database className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{source.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {source.type} · Sync {source.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        okIds.includes(source.id) &&
                          "border-emerald-200 text-emerald-700",
                        source.status === "inactive" && "text-muted-foreground"
                      )}
                    >
                      {source.status === "inactive"
                        ? "Inactiva"
                        : okIds.includes(source.id)
                          ? "Probada OK"
                          : "Activa"}
                    </Badge>
                    {source.status === "active" ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={testingId === source.id}
                          onClick={() => testSource(source.id, source.name)}
                        >
                          {testingId === source.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            "Probar"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={syncingId === source.id}
                          onClick={() => syncSource(source.id, source.name)}
                        >
                          {syncingId === source.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="size-3.5" />
                          )}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <AgentReasoningCard text="MAIA usa calidad, frescura y cobertura de cada fuente para calcular confianza y criticidad. Configura una vez, reutiliza en todos los flujos." />
        </div>

        <ScreeningSetSelector compact />
      </div>
    </WorkbenchShell>
  )
}
