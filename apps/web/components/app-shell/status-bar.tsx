"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Circle, Command, HelpCircle, RotateCcw } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { useWorkbench } from "@/lib/workbench-context"

export function StatusBar({
  onOpenCommand,
  onOpenHelp,
}: {
  onOpenCommand?: () => void
  onOpenHelp?: () => void
}) {
  const [now, setNow] = useState("")
  const { pendingAlerts, resetDemo } = useWorkbench()
  const { toast } = useMaiaToast()

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  function handleReset() {
    resetDemo()
    toast("Demo reiniciada", "info")
  }

  return (
    <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
      <div className="hidden items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground md:flex">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        MAIA online
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="hidden h-8 w-8 p-0 sm:inline-flex"
        onClick={onOpenHelp}
        title="Ayuda (?)"
      >
        <HelpCircle className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="hidden h-8 gap-1.5 text-xs sm:inline-flex"
        onClick={onOpenCommand}
      >
        <Command className="size-3.5" />
        Buscar
        <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleReset}
        title="Reiniciar demo"
      >
        <RotateCcw className="size-3.5" />
      </Button>

      <Button variant="ghost" size="sm" className="relative h-8 px-2" asChild>
        <Link href="/screening/api-alerts">
          <Bell className="size-4" />
          {pendingAlerts > 0 ? (
            <Badge className="absolute -right-1 -top-1 h-4 min-w-4 justify-center px-1 text-[10px]">
              {pendingAlerts}
            </Badge>
          ) : null}
        </Link>
      </Button>

      <div className="hidden items-center gap-1 text-xs text-muted-foreground lg:flex">
        <Circle className="size-1.5 fill-current" />
        {now}
      </div>
    </div>
  )
}
