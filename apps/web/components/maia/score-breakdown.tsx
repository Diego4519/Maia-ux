"use client"

import type { CSSProperties } from "react"

import type { ScoreBreakdownFactor } from "@/lib/mock-data"
import { computeScoreRows, formatFactorValue } from "@/lib/score-breakdown"
import { useCountUp } from "@/lib/use-count-up"
import { cn } from "@workspace/ui/lib/utils"

export function ScoreBreakdown({
  factors,
  engineScore,
  matchLabel,
  animate = true,
  className,
}: {
  factors: ScoreBreakdownFactor[]
  engineScore?: number
  /** Coincidencia a la que pertenece el desglose (nombre · fuente). */
  matchLabel?: string
  /** Si es false, las barras aparecen ya llenas (p. ej. al volver a la pestaña). */
  animate?: boolean
  className?: string
}) {
  const shownScore = useCountUp(engineScore ?? 0, animate)

  if (!factors.length) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground",
          className
        )}
      >
        <p className="font-medium text-foreground">Sin desglose disponible</p>
        <p className="mt-1 text-xs">
          El motor no entregó el detalle de factores para esta coincidencia.
          {typeof engineScore === "number"
            ? ` Score del motor: ${engineScore}.`
            : ""}
        </p>
      </div>
    )
  }

  const rows = computeScoreRows(factors)
  const anyContribution = rows.some((r) => r.norm > 0)

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold">Por qué este score</p>
          {matchLabel ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {matchLabel}
            </p>
          ) : null}
        </div>
        {typeof engineScore === "number" ? (
          <p
            className="font-heading shrink-0 text-right text-2xl font-extrabold leading-none tabular-nums"
            aria-label={`Score del motor: ${engineScore} de 100`}
          >
            {shownScore}
            <span className="ml-0.5 text-xs font-semibold text-muted-foreground">
              /100
            </span>
          </p>
        ) : null}
      </div>

      <ul className="space-y-3 rounded-xl border bg-muted/15 p-3.5">
        {rows.map(({ factor, norm, share }, index) => {
          const active = norm > 0
          const lead = index === 0 && active
          return (
            <li
              key={factor.id}
              className="space-y-1.5"
              style={{ "--i": index } as CSSProperties}
            >
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span
                  className={cn(
                    "font-medium",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {factor.label}
                </span>
                <span
                  className={cn(
                    "shrink-0 font-bold tabular-nums",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {formatFactorValue(factor)}
                </span>
              </div>
              <div
                role="meter"
                aria-label={factor.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(norm * 100)}
                aria-valuetext={formatFactorValue(factor)}
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    lead
                      ? "bg-foreground"
                      : active
                        ? "bg-foreground/55"
                        : "bg-muted-foreground/30",
                    animate && "maia-bar-fill"
                  )}
                  style={{ width: `${norm * 100}%` }}
                />
              </div>
              <div className="flex items-baseline justify-between gap-3 text-[11px] text-muted-foreground">
                <span>{factor.detail ?? ""}</span>
                <span className="shrink-0 tabular-nums">
                  {!active
                    ? "No suma al score"
                    : share !== null
                      ? `${Math.round(share * 100)}% del resultado`
                      : ""}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {anyContribution
          ? "Ordenado por lo que más pesó. El score es el cálculo del motor; la confianza (panel de decisión) indica qué tan segura está MAIA."
          : "Ningún factor activó el score para esta coincidencia."}
      </p>
    </div>
  )
}
