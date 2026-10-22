"use client"

import Link from "next/link"
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Database,
  FileCheck,
  Inbox,
  PartyPopper,
  Search,
  Upload,
  User,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { QuickGuide } from "@/components/workbench/quick-guide"
import { EmptyState } from "@/components/maia/empty-state"
import { RiskBadge } from "@/components/maia/risk-badge"
import { useWorkbench } from "@/lib/workbench-context"
import { workbenchObjectives } from "@/lib/workbench-config"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

const riskAccent: Record<string, string> = {
  high: "maia-risk-high",
  medium: "maia-risk-medium",
  low: "maia-risk-low",
}

const objectiveIcons: Record<string, LucideIcon> = {
  O1: Search,
  O2: Users,
  O3: Bell,
  O4: Database,
  O5: Activity,
  O6: FileCheck,
}

function activityIcon(title: string): LucideIcon {
  if (title.includes("Decisión") || title.includes("resuelta")) return CheckCircle2
  if (title.includes("Lote")) return Upload
  if (title.includes("Fuente")) return Database
  return Activity
}

export default function OverviewPage() {
  const { exceptionQueue, activityFeed } = useWorkbench()

  return (
    <WorkbenchShell
      variant="home"
      tabTitle="Inicio"
      demoData
      hint="Tu bandeja de trabajo. Solo ves lo que necesita tu criterio."
      showSearch
      searchHero
      showKpis
    >
      <div className="space-y-6">
        <QuickGuide />

        <Card className="maia-card border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="maia-icon-tile size-12">
                <Inbox className="size-5" strokeWidth={2.25} />
              </div>
              <div>
                <CardTitle className="font-heading text-lg font-bold">
                  Excepciones pendientes
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground">
                  Solo lo que requiere tu criterio
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                key={exceptionQueue.length}
                className="maia-stat-hero font-heading text-5xl font-extrabold tabular-nums"
              >
                {exceptionQueue.length}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                en cola
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            {exceptionQueue.length === 0 ? (
              <EmptyState
                icon={PartyPopper}
                title="Sin excepciones pendientes"
                description="MAIA resolvió todo automáticamente. Puedes buscar una contraparte nueva."
                action={
                  <Button asChild variant="default" size="default" className="font-semibold">
                    <Link href="/screening/individual">Buscar persona</Link>
                  </Button>
                }
              />
            ) : (
              <div className="maia-list-enter space-y-2">
                {exceptionQueue.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "maia-interactive group flex items-center gap-3 rounded-xl border bg-background px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      riskAccent[item.riskLevel]
                    )}
                  >
                    <div className="maia-icon-tile size-10 shrink-0">
                      <User className="size-4" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {item.reason} · {item.age}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiskBadge level={item.riskLevel} />
                      <ArrowRight className="size-5 text-muted-foreground opacity-0 transition-[opacity,transform] group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="maia-icon-tile size-9">
              <Activity className="size-4 text-muted-foreground" strokeWidth={2.25} />
            </div>
            <p className="font-heading text-base font-bold">
              Módulos del workbench
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workbenchObjectives.map((obj) => {
              const Icon = objectiveIcons[obj.id] ?? Search
              return (
                <Link
                  key={obj.id}
                  href={obj.href}
                  className="maia-interactive maia-card maia-objective-tile group border-0 shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="maia-icon-tile size-14">
                    <Icon className="size-6" strokeWidth={2.25} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {obj.id}
                  </p>
                  <p className="text-sm font-bold leading-snug">{obj.title}</p>
                  <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                    {obj.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

        {activityFeed.length > 0 ? (
          <div className="maia-card border-0 bg-muted/20 px-4 py-4 shadow-none">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              <p className="text-sm font-bold">Actividad reciente</p>
            </div>
            <div className="maia-list-enter space-y-2">
              {activityFeed.slice(0, 3).map((item) => {
                const Icon = activityIcon(item.title)
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg bg-background/80 px-3 py-2.5"
                  >
                    <div className="maia-icon-tile size-8 shrink-0">
                      <Icon className="size-3.5" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.title}</p>
                      <p className="truncate text-xs font-medium text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </WorkbenchShell>
  )
}
