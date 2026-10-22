"use client"

import { AppShell } from "@/components/app-shell/app-shell"
import { cn } from "@workspace/ui/lib/utils"
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
  /** Esta pantalla aún lee datos de demostración (sin API). Se declara en pantalla. */
  demoData?: boolean
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
  demoData = false,
}: WorkbenchShellProps) {
  const isHome = variant === "home"

  return (
    <AppShell
      title="MAIA Compliance Hub"
      description="Screening Team Workbench"
    >
      <div className="space-y-4">
        {/* Tabs primero — orientación inmediata */}
        <WorkbenchTabs />

        {/* Breadcrumb + cabecera */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Screening <span className="mx-1">/</span> {tabTitle}
            </p>
            <h2
              className={cn(
                "font-heading font-bold tracking-tight",
                isHome ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
              )}
            >
              {tabTitle}
              {demoData ? (
                <span
                  title="Esta pantalla usa datos de demostración; aún no está conectada al servicio real."
                  className="ml-2.5 inline-block rounded border px-1.5 py-0.5 align-middle font-sans text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
                >
                  Datos de demostración
                </span>
              ) : null}
            </h2>
            {hint ? (
              <p className="mt-1 max-w-2xl text-sm font-medium text-muted-foreground">
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

        <div className="maia-page-enter">{children}</div>
      </div>
    </AppShell>
  )
}
