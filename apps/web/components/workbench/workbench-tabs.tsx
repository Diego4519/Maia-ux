"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Database,
  FileSearch,
  FileText,
  History,
  LayoutDashboard,
  Search,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { workbenchTabs } from "@/lib/workbench-config"
import { useWorkbench } from "@/lib/workbench-context"
import { massiveBatch } from "@/lib/mock-data"
import { Badge } from "@workspace/ui/components/badge"

const tabIcons: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  individual: Search,
  massive: FileSearch,
  "api-alerts": Activity,
  sources: Database,
  policy: FileText,
  evidence: History,
}

export function WorkbenchTabs() {
  const pathname = usePathname()
  const { pendingAlerts, exceptionQueue } = useWorkbench()

  const badges: Record<string, number | undefined> = {
    overview: exceptionQueue.length || undefined,
    "api-alerts": pendingAlerts || undefined,
    massive: massiveBatch.exceptions,
  }

  return (
    <nav
      aria-label="Secciones de Screening"
      className="flex gap-1 overflow-x-auto rounded-2xl border bg-muted/20 p-1.5 shadow-sm"
    >
      {workbenchTabs.map((tab) => {
        const active = pathname === tab.href
        const badge = badges[tab.id]
        const Icon = tabIcons[tab.id] ?? LayoutDashboard
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "maia-tab-link relative flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:gap-2 sm:px-4",
              active
                ? "maia-tab-active bg-background font-semibold text-foreground shadow-sm"
                : "font-medium text-muted-foreground hover:bg-background/70 hover:text-foreground"
            )}
          >
            <Icon className={cn("size-4 shrink-0", active ? "text-foreground" : "text-muted-foreground")} />
            <span className="text-xs sm:text-sm">{tab.label}</span>
            {badge ? (
              <Badge
                variant={active ? "secondary" : "outline"}
                className="h-4 min-w-4 justify-center px-1 text-[10px] font-bold tabular-nums sm:ml-0.5"
              >
                {badge}
              </Badge>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
