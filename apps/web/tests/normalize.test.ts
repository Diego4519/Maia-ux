import { describe, expect, it } from "vitest"

import { ApiError } from "@/lib/api/errors"
import { normalizeSearchResponse } from "@/lib/api/normalize"

const minimal = { profile: { id: "sub-1", name: "Ana" } }

describe("normalizeSearchResponse", () => {
  it("rechaza una respuesta sin perfil como inválida", () => {
    for (const raw of [null, undefined, "x", [], {}, { profile: null }]) {
      try {
        normalizeSearchResponse(raw)
        expect.unreachable("debió lanzar")
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect((err as ApiError).code).toBe("invalid_response")
      }
    }
  })

  it("rellena valores por defecto y marca la fuente como api (no demo)", () => {
    const res = normalizeSearchResponse(minimal)
    expect(res.source).toBe("api")
    expect(res.mockMode).toBe(false)
    expect(res.profile).toMatchObject({
      id: "sub-1",
      name: "Ana",
      document: "Sin documento",
      nationality: "—",
      tags: [],
    })
    expect(res.matches).toEqual([])
    expect(res.adverseMedia).toEqual([])
    expect(res.sourceCoverage).toEqual([])
  })

  it("normaliza coincidencias con valores inválidos", () => {
    const res = normalizeSearchResponse({
      ...minimal,
      matches: [
        { id: "m1", name: "Ana", score: "alto", riskLevel: "extremo", status: "raro" },
      ],
    })
    expect(res.matches[0]).toMatchObject({
      id: "m1",
      score: 0,
      riskLevel: "medium",
      status: "Pendiente",
    })
  })

  it("conserva el desglose y descarta unidades desconocidas", () => {
    const res = normalizeSearchResponse({
      ...minimal,
      matches: [
        {
          id: "m1",
          scoreBreakdown: [
            { id: "a", label: "A", value: 0.5, unit: "ratio", weight: 0.4 },
            { id: "b", label: "B", value: 1, unit: "otra" },
          ],
        },
      ],
    })
    const f = res.matches[0]!.scoreBreakdown!
    expect(f[0]).toMatchObject({ unit: "ratio", weight: 0.4 })
    expect(f[1]!.unit).toBeUndefined()
    expect(f[1]!.weight).toBeUndefined()
  })

  it("deja scoreBreakdown indefinido si no es una lista", () => {
    const res = normalizeSearchResponse({
      ...minimal,
      matches: [{ id: "m1", scoreBreakdown: "no" }],
    })
    expect(res.matches[0]!.scoreBreakdown).toBeUndefined()
  })

  it("descarta URLs que no sean http(s)", () => {
    const res = normalizeSearchResponse({
      ...minimal,
      adverseMedia: [
        { id: "1", title: "ok", url: "https://a.com/x" },
        { id: "2", title: "js", url: "javascript:alert(1)" },
        { id: "3", title: "sin" },
      ],
    })
    expect(res.adverseMedia.map((m) => m.url)).toEqual([
      "https://a.com/x",
      undefined,
      undefined,
    ])
  })

  it("trata un estado de fuente desconocido como no consultado", () => {
    const res = normalizeSearchResponse({
      ...minimal,
      sourceCoverage: [
        { name: "PEP", status: "found" },
        { name: "OFAC", status: "???" },
      ],
    })
    expect(res.sourceCoverage.map((s) => s.status)).toEqual([
      "found",
      "not_screened",
    ])
  })
})
