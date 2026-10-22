"use client"

import { useEffect, useState } from "react"
import { Layers } from "lucide-react"

const BOOT_KEY = "maia-boot-seen"

const bootSteps = [
  "Inicializando motor de screening…",
  "Cargando 7 listas activas…",
  "Conectando fuentes oficiales…",
  "Listo para operar",
]

export function MaiaSplash() {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    const force = new URLSearchParams(window.location.search).has("boot")
    if (!force && sessionStorage.getItem(BOOT_KEY)) return
    setVisible(true)

    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, bootSteps.length - 1))
    }, 450)

    const exitTimer = setTimeout(() => setExiting(true), 2600)
    const hideTimer = setTimeout(() => {
      if (!force) sessionStorage.setItem(BOOT_KEY, "1")
      setVisible(false)
    }, 3100)

    return () => {
      clearInterval(stepInterval)
      clearTimeout(exitTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="maia-splash-bg fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={
        exiting
          ? { animation: "maia-boot-out 0.45s ease-in forwards" }
          : undefined
      }
      aria-hidden={!visible}
    >
      <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl bg-foreground text-background maia-ring">
        <Layers className="size-7" />
      </div>
      <p className="font-heading text-3xl font-semibold uppercase tracking-[0.12em] maia-brand-in">
        MAIA
      </p>
      <p
        className="mt-3 text-sm text-muted-foreground maia-fade-up"
        style={{ animationDelay: "0.25s" }}
      >
        Compliance Hub · Screening
      </p>
      <p
        key={step}
        className="mt-6 text-xs text-muted-foreground maia-count-up"
      >
        {bootSteps[step]}
      </p>
      <div className="mt-4 h-0.5 w-40 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full origin-left bg-foreground transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / bootSteps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
