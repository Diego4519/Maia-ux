"use client"

import type { CSSProperties } from "react"
import { ExternalLink, Info, Newspaper } from "lucide-react"

import type { AdverseMediaItem } from "@/lib/mock-data"
import type { SourceCoverageStatus } from "@/lib/demo-profiles"
import { sortAdverseMedia } from "@/lib/adverse-media"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

const sentimentLabel: Record<
  NonNullable<AdverseMediaItem["sentiment"]>,
  string
> = {
  negative: "Negativo",
  neutral: "Neutro",
  positive: "Positivo",
}

export function AdverseMediaList({
  items,
  coverage,
  className,
}: {
  items: AdverseMediaItem[]
  /** Estado de la fuente "Medios adversos" en esta consulta. */
  coverage?: SourceCoverageStatus
  className?: string
}) {
  if (!items.length) {
    const notScreened = coverage === "not_screened"
    const Icon = notScreened ? Info : Newspaper
    return (
      <div
        className={cn(
          "maia-enter flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 px-4 py-10 text-center",
          className
        )}
      >
        <Icon
          className="mb-3 size-8 text-muted-foreground"
          strokeWidth={1.75}
          aria-hidden
        />
        <p className="text-sm font-bold">
          {notScreened ? "Fuente no consultada" : "Sin medios adversos"}
        </p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          {notScreened
            ? "Esta búsqueda no incluyó medios adversos. Que no haya resultados aquí no significa que no existan menciones."
            : coverage === "not_found"
              ? "Se consultó la fuente y no hay menciones relevantes para esta persona."
              : "El motor no reportó menciones relevantes para esta persona."}
        </p>
      </div>
    )
  }

  const sorted = sortAdverseMedia(items)
  const negatives = sorted.filter((i) => i.sentiment === "negative").length

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs text-muted-foreground">
        {items.length} {items.length === 1 ? "mención" : "menciones"}
        {negatives > 0
          ? ` · ${negatives} ${negatives === 1 ? "negativa" : "negativas"} primero`
          : ""}
        . Verifica que el artículo se refiera a la misma persona.
      </p>
      <div className="space-y-2">
        {sorted.map((item, index) => (
          <article
            key={item.id}
            style={{ "--i": index } as CSSProperties}
            className="maia-enter rounded-xl border bg-background px-4 py-3 transition-colors duration-200 hover:border-foreground/20 hover:bg-muted/20"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-snug">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.source}
                  {item.date ? ` · ${item.date}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {item.sentiment ? (
                  <Badge variant="outline" className="text-[10px]">
                    {sentimentLabel[item.sentiment]}
                  </Badge>
                ) : null}
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Abrir fuente: ${item.title} (se abre en una pestaña nueva)`}
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>
            {item.snippet ? (
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {item.snippet}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
