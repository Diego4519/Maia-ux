"use client"

import { useEffect, useState } from "react"
import { MousePointerClick, Search, UserCheck, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const KEY = "maia-guide-dismissed"

const steps: { num: number; label: string; icon: LucideIcon }[] = [
  { num: 1, label: "Busca", icon: Search },
  { num: 2, label: "Revisa", icon: UserCheck },
  { num: 3, label: "Decide", icon: MousePointerClick },
]

export function QuickGuide() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!sessionStorage.getItem(KEY)) setVisible(true)
  }, [])

  if (!visible) return null

  function dismiss() {
    sessionStorage.setItem(KEY, "1")
    setVisible(false)
  }

  return (
    <div className="maia-fade-up maia-card px-4 py-4 sm:px-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-heading text-base font-bold">Empieza aquí</p>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Cerrar guía"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {steps.map((step) => (
          <div
            key={step.num}
            className="maia-icon-tile-hover flex flex-col items-center gap-2 rounded-xl border bg-muted/20 px-2 py-3 text-center"
          >
            <div className="maia-icon-tile size-11">
              <step.icon className="size-5" strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Paso {step.num}
              </p>
              <p className="text-sm font-semibold">{step.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
