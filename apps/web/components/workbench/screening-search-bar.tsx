"use client"

import { Suspense, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { demoSearchExamples } from "@/lib/demo-profiles"

function ScreeningSearchBarInner({ hero = false }: { hero?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlQuery =
    pathname === "/screening/individual"
      ? (searchParams.get("q") ?? "")
      : ""
  const [query, setQuery] = useState(urlQuery)
  const [focused, setFocused] = useState(false)
  const [launching, setLaunching] = useState(false)

  useEffect(() => {
    setQuery(urlQuery)
    setLaunching(false)
  }, [urlQuery])

  function runSearch(value?: string) {
    const trimmed = (value ?? query).trim()
    if (!trimmed) return
    setQuery(trimmed)
    // Misma consulta ya visible: no hay navegación, así que no bloqueamos el botón.
    const sameAsShown =
      pathname === "/screening/individual" && trimmed === urlQuery
    if (sameAsShown) return
    setLaunching(true)
    router.push(`/screening/individual?q=${encodeURIComponent(trimmed)}`)
  }

  if (hero) {
    return (
      <div
        className={cn(
          "maia-fade-up maia-hero-search rounded-2xl border p-5 sm:p-7",
          focused && "ring-1 ring-foreground/15",
          launching && "maia-scan-line"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="maia-icon-tile size-12 shrink-0">
            <Search className="size-5" strokeWidth={2.25} />
          </div>
          <div>
            <p className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
              ¿A quién quieres analizar?
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Escribe un nombre o documento. MAIA hace el resto.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch()
              }}
              placeholder="Nombre, empresa o DNI…"
              aria-label="Buscar persona, empresa o documento"
              className="h-12 flex-1 pl-10 text-base shadow-sm"
              autoFocus={pathname === "/screening/overview"}
            />
          </div>
          <Button
            className="maia-btn-press h-12 shrink-0 px-8 text-base font-bold shadow-md"
            onClick={() => runSearch()}
            disabled={launching || !query.trim()}
          >
            <Search className="mr-2 size-4" />
            {launching ? "Analizando…" : "Analizar"}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Ejemplos:</span>
          {demoSearchExamples.slice(0, 3).map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => runSearch(example)}
              className="rounded-full border bg-background px-3 py-1 text-[11px] text-muted-foreground shadow-sm transition-all hover:border-foreground/20 hover:bg-muted/50 hover:text-foreground active:scale-[0.97]"
            >
              {example.split(" ").slice(0, 2).join(" ")}…
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch()
          }}
          placeholder="Buscar persona o documento…"
          aria-label="Buscar persona o documento"
          className="h-10 flex-1 pl-9"
        />
      </div>
      <Button
        className="maia-btn-press h-10 shrink-0"
        onClick={() => runSearch()}
        disabled={launching || !query.trim()}
      >
        <Search className="mr-2 size-4" />
        Analizar
      </Button>
    </div>
  )
}

export function ScreeningSearchBar({ hero = false }: { hero?: boolean }) {
  return (
    <Suspense fallback={<div className="maia-shimmer h-14 rounded-xl" />}>
      <ScreeningSearchBarInner hero={hero} />
    </Suspense>
  )
}
