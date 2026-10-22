import { describe, expect, it } from "vitest"

import { sortAdverseMedia, toTime } from "@/lib/adverse-media"
import type { AdverseMediaItem } from "@/lib/mock-data"

const item = (
  id: string,
  date: string,
  sentiment?: AdverseMediaItem["sentiment"]
): AdverseMediaItem => ({ id, title: id, source: "x", date, snippet: "", sentiment })

describe("toTime", () => {
  it("interpreta dd/mm/aaaa, ISO y devuelve 0 si no puede", () => {
    expect(toTime("12/03/2024")).toBe(new Date(2024, 2, 12).getTime())
    expect(toTime("2024-03-12")).toBe(Date.parse("2024-03-12"))
    expect(toTime("")).toBe(0)
    expect(toTime("ayer")).toBe(0)
  })
})

describe("sortAdverseMedia", () => {
  it("pone los negativos primero y, dentro del grupo, lo más reciente", () => {
    const sorted = sortAdverseMedia([
      item("neutro-nuevo", "01/01/2025", "neutral"),
      item("neg-viejo", "05/06/2022", "negative"),
      item("neg-nuevo", "12/03/2024", "negative"),
      item("positivo", "01/01/2026", "positive"),
    ])
    expect(sorted.map((i) => i.id)).toEqual([
      "neg-nuevo",
      "neg-viejo",
      "neutro-nuevo",
      "positivo",
    ])
  })

  it("trata el sentimiento ausente como neutro y no muta la entrada", () => {
    const input = [item("a", "01/01/2020"), item("b", "01/01/2021", "negative")]
    const copy = [...input]
    expect(sortAdverseMedia(input).map((i) => i.id)).toEqual(["b", "a"])
    expect(input).toEqual(copy)
  })
})
