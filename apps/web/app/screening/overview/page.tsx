"use client"

import Link from "next/link"
import { ArrowRight, Inbox, PartyPopper } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { QuickGuide } from "@/components/workbench/quick-guide"
import { EmptyState } from "@/components/maia/empty-state"
import { RiskBadge } from "@/components/maia/risk-badge"
import { useWorkbench } from "@/lib/workbench-context"
import { workbenchObjectives } from "@/lib/workbench-config"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export default function OverviewPage() {
  const { exceptionQueue, activityFeed } = useWorkbench()

  return (
    <WorkbenchShell
      variant="home"
      tabTitle="Inicio"
      hint="Tu bandeja de trabajo. Solo ves lo que necesita tu criterio."
      showSearch
      searchHero
      showKpis
    >
      <div className="space-y-5">
        <QuickGuide />

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Inbox className="size-4 text-muted-foreground" />
              <CardTitle className="font-heading text-base">
                Excepciones pendientes
              </CardTitle>
            </div>
            <Badge variant="secondary">{exceptionQueue.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            {exceptionQueue.length === 0 ? (
              <EmptyState
                icon={PartyPopper}
                title="Sin excepciones pendientes"
                description="MAIA resolvió todo automáticamente. Puedes buscar una contraparte nueva."
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link href="/screening/individual">Buscar persona</Link>
                  </Button>
                }
              />
            ) : (
              exceptionQueue.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.reason} · {item.age}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={item.riskLevel} />
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <p className="font-heading text-sm font-semibold">
            Objetivos del workbench
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {workbenchObjectives.map((obj) => (
              <Link
                key={obj.id}
                href={obj.href}
                className="rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {obj.id}
                  </Badge>
                  <p className="text-sm font-medium">{obj.title}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {obj.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {activityFeed.length > 0 ? (
          <div className="rounded-xl border bg-muted/20 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Actividad reciente
            </p>
            <div className="space-y-1.5">
              {activityFeed.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span>
                    <span className="font-medium">{item.title}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {item.detail}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </WorkbenchShell>
  )
}
