"use client"

import { useEffect, useState } from "react"
import { HelpCircle, X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

const shortcuts = [
  { keys: "⌘K", desc: "Buscar persona o ir a un tab" },
  { keys: "D", desc: "Alternar modo claro / oscuro" },
  { keys: "Enter", desc: "Confirmar búsqueda" },
  { keys: "Esc", desc: "Cerrar panel de búsqueda" },
  { keys: "?", desc: "Abrir esta ayuda" },
]

export function HelpSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 p-4 sm:items-center"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl maia-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-muted-foreground" />
            <h3 className="font-heading font-semibold">Ayuda rápida</h3>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            MAIA resuelve lo rutinario. Tú solo ves excepciones y decides.
          </p>
          <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
            {shortcuts.map((s) => (
              <div
                key={s.keys}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{s.desc}</span>
                <kbd className="rounded border bg-background px-2 py-0.5 font-mono text-xs">
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Flujo: Buscar → Analizar → Decidir. La evidencia se guarda sola.
          </p>
        </div>
      </div>
    </div>
  )
}
