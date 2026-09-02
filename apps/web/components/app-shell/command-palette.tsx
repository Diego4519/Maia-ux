"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Clock, ArrowRight } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { workbenchTabs } from "@/lib/workbench-config"
import { cn } from "@workspace/ui/lib/utils"

import { demoSearchExamples, demoSubjects } from "@/lib/demo-profiles"

const RECENT_KEY = "maia-recent-searches"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [recent, setRecent] = useState<string[]>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]")
      if (Array.isArray(stored)) setRecent(stored.slice(0, 3))
    } catch {
      /* ignore */
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) {
      setQ("")
      setActiveIdx(0)
    }
  }, [open])

  if (!open) return null

  const filteredTabs = workbenchTabs.filter((t) =>
    t.label.toLowerCase().includes(q.toLowerCase())
  )
  const filteredPeople = demoSubjects
    .map((s) => s.profile.name)
    .filter((p) => p.toLowerCase().includes(q.toLowerCase()))
  const filteredRecent = recent.filter((p) =>
    p.toLowerCase().includes(q.toLowerCase())
  )

  const allItems = [
    ...filteredPeople.map((name) => ({ type: "person" as const, label: name })),
    ...filteredRecent.map((name) => ({ type: "recent" as const, label: name })),
    ...filteredTabs.map((tab) => ({ type: "tab" as const, label: tab.label, href: tab.href })),
  ]

  function navigate(name: string) {
    const updated = [name, ...recent.filter((r) => r !== name)].slice(0, 5)
    setRecent(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
    onOpenChange(false)
    router.push(`/screening/individual?q=${encodeURIComponent(name)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, allItems.length - 1))
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    }
    if (e.key === "Enter") {
      const item = allItems[activeIdx]
      if (item?.type === "tab" && item.href) {
        onOpenChange(false)
        router.push(item.href)
      } else if (item) {
        navigate(item.label)
      } else if (q.trim()) {
        navigate(q.trim())
      }
    }
  }

  let itemIdx = -1

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/25 p-4 pt-[12vh] backdrop-blur-sm maia-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-2xl maia-scale-in"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setActiveIdx(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar persona, ir a un tab…"
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <kbd className="hidden rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
            ESC
          </kbd>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-h-80 overflow-auto p-2">
          {filteredRecent.length > 0 && !q ? (
            <div className="mb-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Recientes
              </p>
              {filteredRecent.map((name) => {
                itemIdx++
                const idx = itemIdx
                return (
                  <button
                    key={`recent-${name}`}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      activeIdx === idx ? "bg-muted" : "hover:bg-muted/60"
                    )}
                    onClick={() => navigate(name)}
                  >
                    <Clock className="size-3.5 text-muted-foreground" />
                    {name}
                  </button>
                )
              })}
            </div>
          ) : null}
          {filteredPeople.length > 0 ? (
            <div className="mb-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Analizar
              </p>
              {filteredPeople.map((name) => {
                itemIdx++
                const idx = itemIdx
                return (
                  <button
                    key={name}
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      activeIdx === idx ? "bg-muted" : "hover:bg-muted/60"
                    )}
                    onClick={() => navigate(name)}
                  >
                    {name}
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </button>
                )
              })}
            </div>
          ) : null}
          {filteredTabs.length > 0 ? (
            <div>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Ir a
              </p>
              {filteredTabs.map((tab) => {
                itemIdx++
                const idx = itemIdx
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={cn(
                      "flex w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      activeIdx === idx ? "bg-muted" : "hover:bg-muted/60"
                    )}
                    onClick={() => {
                      onOpenChange(false)
                      router.push(tab.href)
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          ) : null}
          {allItems.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Sin resultados. Enter para analizar &quot;{q}&quot;.
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t px-3 py-2 text-[10px] text-muted-foreground">
          <span>↑↓ navegar · Enter seleccionar</span>
          <span>⌘K para abrir</span>
        </div>
      </div>
    </div>
  )
}
