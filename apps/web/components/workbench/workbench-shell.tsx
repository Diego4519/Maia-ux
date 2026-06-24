import { AppShell } from "@/components/app-shell/app-shell"
import { AutomationStrip } from "@/components/workbench/automation-strip"
import { KpiStrip } from "@/components/workbench/kpi-strip"
import { ScreeningSearchBar } from "@/components/workbench/screening-search-bar"
import { WorkbenchTabs } from "@/components/workbench/workbench-tabs"
import { Button } from "@workspace/ui/components/button"

interface WorkbenchShellProps {
  children: React.ReactNode
  breadcrumb: string
  title?: string
  description?: string
  actionLabel?: string
  showKpis?: boolean
  showAutomation?: boolean
  showSearch?: boolean
}

export function WorkbenchShell({
  children,
  breadcrumb,
  title = "Screening Team Workbench",
  description = "Capa operativa unificada para screening, decisiones, fuentes, política y evidencia.",
  actionLabel,
  showKpis = true,
  showAutomation = true,
  showSearch = true,
}: WorkbenchShellProps) {
  return (
    <AppShell
      title="MAIA Compliance Hub"
      description="Screening Team Workbench"
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{breadcrumb}</p>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          {actionLabel ? (
            <Button className="shrink-0">{actionLabel}</Button>
          ) : null}
        </div>

        {showSearch ? <ScreeningSearchBar /> : null}

        <WorkbenchTabs />

        {showKpis ? <KpiStrip /> : null}
        {showAutomation ? <AutomationStrip /> : null}

        {children}
      </div>
    </AppShell>
  )
}
