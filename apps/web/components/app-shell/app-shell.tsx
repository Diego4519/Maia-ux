"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { MaiaSidebar } from "@/components/app-shell/maia-sidebar"
import { MaiaSplash } from "@/components/app-shell/maia-splash"
import { StatusBar } from "@/components/app-shell/status-bar"
import { CommandPalette } from "@/components/app-shell/command-palette"
import { HelpSheet } from "@/components/workbench/help-sheet"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

interface AppShellProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AppShell({ children, title, description }: AppShellProps) {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "d" && e.key !== "D") return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return
      e.preventDefault()
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [resolvedTheme, setTheme])

  return (
    <TooltipProvider>
      <MaiaSplash />
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <HelpSheet open={helpOpen} onOpenChange={setHelpOpen} />
      <SidebarProvider>
        <MaiaSidebar />
        <SidebarInset className="maia-app-canvas">
          <header className="maia-header-glass sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex min-w-0 flex-col">
              <h1 className="font-heading truncate text-sm font-semibold">
                {title}
              </h1>
              {description ? (
                <p className="truncate text-xs text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            <StatusBar
              onOpenCommand={() => setCmdOpen(true)}
              onOpenHelp={() => setHelpOpen(true)}
            />
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
