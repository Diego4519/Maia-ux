import {
  getApiBaseUrl,
  getDecisionsFeedbackPath,
  isMockMode,
} from "@/lib/api/config"
import { ApiError, apiErrorMessages } from "@/lib/api/errors"
import type {
  DecisionFeedbackRequest,
  DecisionFeedbackResponse,
} from "@/lib/api/types"

const actions = ["accept", "reject", "escalate"] as const

/** Valida el cuerpo que llega del navegador antes de reenviarlo. */
export function parseFeedbackRequest(body: unknown): DecisionFeedbackRequest {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<
    string,
    unknown
  >
  if (typeof b.caseId !== "string" || !b.caseId.trim()) {
    throw new ApiError("bad_request", "Falta el identificador del caso.", 400)
  }
  if (!actions.includes(b.action as (typeof actions)[number])) {
    throw new ApiError("bad_request", "Decisión no válida.", 400)
  }
  const comment =
    typeof b.comment === "string" ? b.comment.trim().slice(0, 1000) : undefined

  return {
    caseId: b.caseId.trim(),
    matchId: typeof b.matchId === "string" ? b.matchId : undefined,
    subjectId: typeof b.subjectId === "string" ? b.subjectId : undefined,
    action: b.action as DecisionFeedbackRequest["action"],
    engineAgreement:
      b.engineAgreement === "agree" || b.engineAgreement === "disagree"
        ? b.engineAgreement
        : undefined,
    comment: comment || undefined,
    riskLevel: b.riskLevel as DecisionFeedbackRequest["riskLevel"],
    name: typeof b.name === "string" ? b.name : undefined,
    demo: b.demo === true,
  }
}

function demoResponse(): DecisionFeedbackResponse {
  return {
    id: `fb-demo-${Date.now()}`,
    status: "demo",
    recordedAt: new Date().toISOString(),
    mockMode: true,
  }
}

/**
 * Envía el feedback del operador al backend (solo servidor: el token no
 * llega al navegador). Los datos demo y el modo demo no se reenvían.
 */
export async function sendDecisionFeedback(
  payload: DecisionFeedbackRequest
): Promise<DecisionFeedbackResponse> {
  const base = getApiBaseUrl()

  if (payload.demo || isMockMode()) return demoResponse()
  if (!base) {
    throw new ApiError("not_configured", apiErrorMessages.not_configured, 503)
  }

  // `demo` es un detalle interno del front; no forma parte del contrato.
  const { demo: _demo, ...body } = payload
  void _demo

  let res: Response
  try {
    res = await fetch(
      `${base.replace(/\/$/, "")}${getDecisionsFeedbackPath()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(process.env.MAIA_API_TOKEN
            ? { Authorization: `Bearer ${process.env.MAIA_API_TOKEN}` }
            : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      }
    )
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ApiError("timeout", apiErrorMessages.timeout, 504)
    }
    throw new ApiError("unreachable", apiErrorMessages.unreachable, 502)
  }

  if (res.status === 401 || res.status === 403) {
    throw new ApiError("unauthorized", apiErrorMessages.unauthorized, 502)
  }
  if (!res.ok) {
    throw new ApiError("upstream_error", apiErrorMessages.upstream_error, 502)
  }

  const data = (await res.json().catch(() => ({}))) as Partial<
    DecisionFeedbackResponse
  >
  return {
    id: typeof data.id === "string" ? data.id : `fb-${Date.now()}`,
    status:
      data.status === "queued" || data.status === "recorded"
        ? data.status
        : "recorded",
    recordedAt:
      typeof data.recordedAt === "string"
        ? data.recordedAt
        : new Date().toISOString(),
    mockMode: false,
  }
}
