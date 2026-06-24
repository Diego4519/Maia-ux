"use client"

import { Suspense, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

const demoExamples = [
  "Carlos Alberto Ramírez Torres",
  "María Fernanda López",
  "Inversiones Andinas S.A.C.",
]

function ScreeningSearchBarInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlQuery =
    pathname === "/screening/individual"
      ? (searchParams.get("q") ?? "")
      : ""
  const [query, setQuery] = useState(urlQuery)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  function runSearch(value?: string) {
    const trimmed = (value ?? query).trim()
    if (!trimmed) return
    setQuery(trimmed)
    router.push(`/screening/individual?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="rounded-xl border-2 border-border bg-card p-4 sm:p-5">
      <div className="mb-3 space-y-1">
        <p className="font-heading text-base font-semibold">
          Buscar y analizar con MAIA
        </p>
        <p className="text-sm text-muted-foreground">
          Escribe un nombre, empresa o documento. MAIA cruza sanciones, PEP y
          listas configuradas — como un screening inteligente en un solo paso.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch()
          }}
          placeholder="Ej: Carlos Ramírez o DNI 45892136"
          className="h-12 text-base"
        />
        <Button className="h-12 shrink-0 px-6" onClick={() => runSearch()}>
          <Search className="mr-2 size-4" />
          Analizar
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Probar:</span>
        {demoExamples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => runSearch(example)}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ScreeningSearchBar() {
  return (
    <Suspense
      fallback={
        <div className="h-[148px] animate-pulse rounded-xl border-2 border-border bg-muted/30" />
      }
    >
      <ScreeningSearchBarInner />
    </Suspense>
  )
}
