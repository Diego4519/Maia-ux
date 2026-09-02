"use client"

import { AppShell } from "@/components/app-shell/app-shell"
import { AutomationStrip } from "@/components/workbench/automation-strip"
import { KpiStrip } from "@/components/workbench/kpi-strip"
import { ScreeningSearchBar } from "@/components/workbench/screening-search-bar"
import { WorkbenchTabs } from "@/components/workbench/workbench-tabs"
import { WorkbenchAction } from "@/components/workbench/workbench-action"

interface WorkbenchShellProps {
  children: React.ReactNode
  /** Nombre corto del tab — ej. "Massive", "Individual" */
  tabTitle: string
  /** Una línea. Qué hace esta pantalla. */
  hint?: string
  actionLabel?: string
  /** home = Overview con búsqueda protagonista. work = resto de tabs, layout limpio */
  variant?: "home" | "work"
  showKpis?: boolean
  showAutomation?: boolean
  showSearch?: boolean
  searchHero?: boolean
}

export function WorkbenchShell({
  children,
  tabTitle,
  hint,
  actionLabel,
  variant = "work",
  showKpis = false,
  showAutomation = false,
  showSearch = false,
  searchHero = false,
}: WorkbenchShellProps) {
  const isHome = variant === "home"

  return (
    <AppShell
      title="MAIA Compliance Hub"
      description="Screening Team Workbench"
    >
      <div className="maia-fade-in space-y-4">
        {/* Tabs primero — orientación inmediata */}
        <WorkbenchTabs />

        {/* Breadcrumb + cabecera */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Screening <span className="mx-1">/</span> {tabTitle}
            </p>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              {tabTitle}
            </h2>
            {hint ? (
              <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">
                {hint}
              </p>
            ) : null}
          </div>
          {actionLabel ? (
            <WorkbenchAction label={actionLabel} />
          ) : null}
        </div>

        {/* Búsqueda solo donde importa (Overview hero / Individual) */}
        {showSearch ? (
          <ScreeningSearchBar hero={searchHero || isHome} />
        ) : null}

        {showKpis ? <KpiStrip /> : null}
        {showAutomation ? <AutomationStrip /> : null}

        <div className="maia-fade-up">{children}</div>
      </div>
    </AppShell>
  )
}
