import type { ScoreBreakdownFactor } from "@/lib/mock-data"

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

/** Valor del factor normalizado a 0–1. */
export function normalizeFactor(factor: ScoreBreakdownFactor): number {
  if (factor.unit === "flag") return factor.value >= 0.5 ? 1 : 0
  if (factor.unit === "percent") return clamp01(factor.value / 100)
  // ratio: 0–1 (o 0–100 si el backend ya lo entrega en porcentaje)
  return clamp01(factor.value <= 1 ? factor.value : factor.value / 100)
}

export function formatFactorValue(factor: ScoreBreakdownFactor): string {
  if (factor.unit === "flag") return factor.value >= 0.5 ? "Hit" : "Sin hit"
  return `${Math.round(normalizeFactor(factor) * 100)}%`
}

export interface ScoreRow {
  factor: ScoreBreakdownFactor
  /** Valor normalizado 0–1. */
  norm: number
  /** Participación en el resultado (0–1). null si no se puede calcular. */
  share: number | null
}

/**
 * Ordena los factores por lo que más pesó. Si todos traen peso, calcula la
 * participación de cada uno; si no, solo ordena por valor.
 */
export function computeScoreRows(factors: ScoreBreakdownFactor[]): ScoreRow[] {
  const hasWeights =
    factors.length > 0 && factors.every((f) => typeof f.weight === "number")
  const contributions = factors.map((f) =>
    hasWeights ? normalizeFactor(f) * (f.weight as number) : normalizeFactor(f)
  )
  const total = contributions.reduce((a, b) => a + b, 0)

  return factors
    .map((factor, i) => ({
      factor,
      norm: normalizeFactor(factor),
      contribution: contributions[i] ?? 0,
      share: hasWeights && total > 0 ? (contributions[i] ?? 0) / total : null,
    }))
    .sort((a, b) => b.contribution - a.contribution)
    .map(({ factor, norm, share }) => ({ factor, norm, share }))
}
