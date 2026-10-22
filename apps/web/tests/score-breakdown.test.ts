import { describe, expect, it } from "vitest"

import {
  computeScoreRows,
  formatFactorValue,
  normalizeFactor,
} from "@/lib/score-breakdown"
import type { ScoreBreakdownFactor } from "@/lib/mock-data"

const f = (
  id: string,
  value: number,
  unit: ScoreBreakdownFactor["unit"],
  weight?: number
): ScoreBreakdownFactor => ({ id, label: id, value, unit, weight })

describe("normalizeFactor", () => {
  it("normaliza cada unidad a 0–1", () => {
    expect(normalizeFactor(f("a", 0.97, "ratio"))).toBeCloseTo(0.97)
    expect(normalizeFactor(f("a", 97, "ratio"))).toBeCloseTo(0.97)
    expect(normalizeFactor(f("a", 40, "percent"))).toBeCloseTo(0.4)
    expect(normalizeFactor(f("a", 1, "flag"))).toBe(1)
    expect(normalizeFactor(f("a", 0, "flag"))).toBe(0)
  })

  it("acota valores fuera de rango", () => {
    expect(normalizeFactor(f("a", 250, "percent"))).toBe(1)
    expect(normalizeFactor(f("a", -5, "percent"))).toBe(0)
  })
})

describe("formatFactorValue", () => {
  it("muestra Hit / Sin hit para banderas y porcentaje para el resto", () => {
    expect(formatFactorValue(f("a", 1, "flag"))).toBe("Hit")
    expect(formatFactorValue(f("a", 0, "flag"))).toBe("Sin hit")
    expect(formatFactorValue(f("a", 0.88, "ratio"))).toBe("88%")
  })
})

describe("computeScoreRows", () => {
  const factors = [
    f("sanciones", 0, "flag", 0.2),
    f("nombre", 0.97, "ratio", 0.35),
    f("medios", 0.88, "ratio", 0.15),
    f("pep", 1, "flag", 0.3),
  ]

  it("ordena de mayor a menor aporte", () => {
    expect(computeScoreRows(factors).map((r) => r.factor.id)).toEqual([
      "nombre",
      "pep",
      "medios",
      "sanciones",
    ])
  })

  it("las participaciones suman 100% y el factor en cero aporta 0", () => {
    const rows = computeScoreRows(factors)
    const sum = rows.reduce((a, r) => a + (r.share ?? 0), 0)
    expect(sum).toBeCloseTo(1)
    expect(rows.find((r) => r.factor.id === "sanciones")!.share).toBe(0)
  })

  it("sin pesos solo ordena por valor y no calcula participación", () => {
    const rows = computeScoreRows([f("a", 0.2, "ratio"), f("b", 0.9, "ratio")])
    expect(rows.map((r) => r.factor.id)).toEqual(["b", "a"])
    expect(rows.every((r) => r.share === null)).toBe(true)
  })

  it("con pesos incompletos no inventa participación", () => {
    const rows = computeScoreRows([f("a", 1, "flag", 0.5), f("b", 1, "flag")])
    expect(rows.every((r) => r.share === null)).toBe(true)
  })

  it("si ningún factor se activa, todas las participaciones son nulas", () => {
    const rows = computeScoreRows([f("a", 0, "flag", 0.5), f("b", 0, "flag", 0.5)])
    expect(rows.every((r) => r.share === null)).toBe(true)
  })

  it("lista vacía devuelve lista vacía", () => {
    expect(computeScoreRows([])).toEqual([])
  })

  it("no modifica el arreglo original", () => {
    const original = [...factors]
    computeScoreRows(factors)
    expect(factors).toEqual(original)
  })
})
