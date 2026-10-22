import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

import { startFakeApi, type FakeApi } from "../scripts/fake-maia-api"
import { ApiError } from "@/lib/api/errors"
import { searchScreening } from "@/lib/screening-service"
import {
  parseFeedbackRequest,
  sendDecisionFeedback,
} from "@/lib/decisions-service"

const TOKEN = "test-token"
let api: FakeApi

const envKeys = [
  "MAIA_API_BASE_URL",
  "MAIA_API_TOKEN",
  "MAIA_USE_MOCK",
  "NEXT_PUBLIC_MAIA_API_BASE_URL",
  "NEXT_PUBLIC_MAIA_USE_MOCK",
  "MONGODB_URI",
] as const

beforeAll(async () => {
  api = await startFakeApi({ token: TOKEN })
})

afterAll(async () => {
  await api.close()
})

beforeEach(() => {
  for (const k of envKeys) delete process.env[k]
  process.env.MAIA_API_BASE_URL = api.url
  process.env.MAIA_API_TOKEN = TOKEN
  process.env.MAIA_USE_MOCK = "false"
  api.feedback.length = 0
})

async function codeOf(p: Promise<unknown>): Promise<string> {
  try {
    await p
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError)
    return (err as ApiError).code
  }
  throw new Error("debió lanzar ApiError")
}

describe("búsqueda contra la API simulada (modo real)", () => {
  it("devuelve datos de la API, no demo, con desglose y medios adversos", async () => {
    const res = await searchScreening("carlos alberto")
    expect(res.source).toBe("api")
    expect(res.mockMode).toBe(false)
    expect(res.matches[0]!.score).toBe(96)
    expect(res.matches[0]!.scoreBreakdown).toHaveLength(4)
    expect(res.adverseMedia).toHaveLength(2)
    expect(res.sourceCoverage.some((s) => s.status === "not_screened")).toBe(true)
  })

  it("una persona consultada y limpia devuelve coincidencias vacías, no error", async () => {
    const res = await searchScreening("__empty")
    expect(res.matches).toEqual([])
    expect(res.mockMode).toBe(false)
  })

  it("un 500 del backend lanza upstream_error (nunca cae a demo)", async () => {
    expect(await codeOf(searchScreening("__error500"))).toBe("upstream_error")
  })

  it("una respuesta sin perfil lanza invalid_response", async () => {
    expect(await codeOf(searchScreening("__invalid"))).toBe("invalid_response")
  })

  it("un token incorrecto lanza unauthorized", async () => {
    process.env.MAIA_API_TOKEN = "otro"
    expect(await codeOf(searchScreening("carlos"))).toBe("unauthorized")
  })

  it("un backend inalcanzable lanza unreachable (nunca cae a demo)", async () => {
    process.env.MAIA_API_BASE_URL = "http://127.0.0.1:9"
    expect(await codeOf(searchScreening("carlos"))).toBe("unreachable")
  })

  it("sin URL configurada responde en modo demostración, declarado", async () => {
    delete process.env.MAIA_API_BASE_URL
    delete process.env.MAIA_USE_MOCK
    const res = await searchScreening("carlos alberto")
    expect(res.source).toBe("mock")
    expect(res.mockMode).toBe(true)
  })

  it("MAIA_USE_MOCK=true fuerza demostración aunque exista URL", async () => {
    process.env.MAIA_USE_MOCK = "true"
    const res = await searchScreening("carlos alberto")
    expect(res.mockMode).toBe(true)
  })
})

describe("feedback contra la API simulada", () => {
  const base = {
    caseId: "IND-001",
    action: "reject",
    engineAgreement: "disagree",
    comment: "  Es un homónimo.  ",
    matchId: "m-1",
  }

  it("reenvía con token, normaliza el comentario y no filtra el campo demo", async () => {
    const res = await sendDecisionFeedback(parseFeedbackRequest(base))
    expect(res).toMatchObject({ status: "recorded", mockMode: false })
    expect(api.feedback).toHaveLength(1)
    expect(api.feedback[0]).toMatchObject({
      caseId: "IND-001",
      action: "reject",
      engineAgreement: "disagree",
      comment: "Es un homónimo.",
    })
    expect(api.feedback[0]).not.toHaveProperty("demo")
  })

  it("los datos demo no se reenvían al backend real", async () => {
    const res = await sendDecisionFeedback(
      parseFeedbackRequest({ ...base, demo: true })
    )
    expect(res).toMatchObject({ status: "demo", mockMode: true })
    expect(api.feedback).toHaveLength(0)
  })

  it("un backend caído lanza error en vez de simular éxito", async () => {
    process.env.MAIA_API_BASE_URL = "http://127.0.0.1:9"
    expect(
      await codeOf(sendDecisionFeedback(parseFeedbackRequest(base)))
    ).toBe("unreachable")
  })

  it("un token incorrecto lanza unauthorized", async () => {
    process.env.MAIA_API_TOKEN = "otro"
    expect(
      await codeOf(sendDecisionFeedback(parseFeedbackRequest(base)))
    ).toBe("unauthorized")
    expect(api.feedback).toHaveLength(0)
  })
})

describe("parseFeedbackRequest", () => {
  it("exige caseId y una acción válida", () => {
    for (const body of [null, {}, { caseId: "" , action: "accept" }, { caseId: "x", action: "nope" }]) {
      try {
        parseFeedbackRequest(body)
        expect.unreachable("debió lanzar")
      } catch (err) {
        expect((err as ApiError).code).toBe("bad_request")
        expect((err as ApiError).status).toBe(400)
      }
    }
  })

  it("limita el comentario a 1000 caracteres y descarta valores no válidos", () => {
    const parsed = parseFeedbackRequest({
      caseId: "x",
      action: "accept",
      comment: "a".repeat(2000),
      engineAgreement: "quizá",
    })
    expect(parsed.comment).toHaveLength(1000)
    expect(parsed.engineAgreement).toBeUndefined()
  })

  it("trata un comentario vacío como ausente", () => {
    expect(
      parseFeedbackRequest({ caseId: "x", action: "accept", comment: "   " })
        .comment
    ).toBeUndefined()
  })
})
