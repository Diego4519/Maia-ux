import Link from "next/link"
import {
  Activity,
  ArrowRight,
  Bell,
  Eye,
  RefreshCw,
  TrendingUp,
} from "lucide-react"

import { AppShell } from "@/components/app-shell/app-shell"
import { MetricTile } from "@/components/maia/metric-tile"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const monitoredEntities = [
  {
    name: "Carlos Alberto Ramírez Torres",
    status: "Alerta activa",
    lastCheck: "Hace 15 min",
    risk: "high" as const,
  },
  {
    name: "Inversiones Andinas S.A.C.",
    status: "Monitoreo estándar",
    lastCheck: "Hace 1 h",
    risk: "medium" as const,
  },
  {
    name: "Roberto Silva Vega",
    status: "Sin cambios",
    lastCheck: "Hace 3 h",
    risk: "low" as const,
  },
]

export default function MonitoringPage() {
  return (
    <AppShell
      title="Monitoreo Continuo"
      description="Vigilancia post-onboarding"
    >
      <div className="maia-fade-in space-y-6">
        <div className="maia-fade-up rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary">Beta · Próximamente</Badge>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                Monitoreo Continuo
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Vigilancia automática de contrapartes ya aprobadas. MAIA
                detecta cambios en listas, medios adversos y alertas — solo
                notifica cuando hay novedad.
              </p>
            </div>
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-muted/40">
              <Activity className="size-7 text-muted-foreground" />
            </div>
          </div>
        </div>

        <section className="maia-stagger grid gap-3 sm:grid-cols-3">
          <MetricTile
            label="Entidades monitoreadas"
            value={247}
            icon={Eye}
            hint="Activas"
          />
          <MetricTile
            label="Alertas esta semana"
            value={3}
            icon={Bell}
            trend="+1 vs semana anterior"
            trendUp={false}
          />
          <MetricTile
            label="Re-screenings automáticos"
            value="1,842"
            icon={RefreshCw}
            hint="Últimos 30 días"
            trendUp
          />
        </section>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-base">
                  Entidades en monitoreo
                </CardTitle>
                <CardDescription>
                  Vista demo — datos conectados al Screening Workbench
                </CardDescription>
              </div>
              <Badge variant="outline">
                <TrendingUp className="mr-1 size-3" />
                Demo
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="maia-stagger space-y-2">
            {monitoredEntities.map((entity) => (
              <div
                key={entity.name}
                className="flex items-center justify-between rounded-xl border px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium">{entity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entity.status} · Último check {entity.lastCheck}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    entity.risk === "high"
                      ? "border-red-200 text-red-700"
                      : entity.risk === "medium"
                        ? "border-amber-200 text-amber-800"
                        : "border-emerald-200 text-emerald-700"
                  }
                >
                  {entity.risk === "high"
                    ? "Alto"
                    : entity.risk === "medium"
                      ? "Medio"
                      : "Bajo"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/screening/api-alerts">
              Ver alertas API
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/screening/overview">Volver al Workbench</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
