import type {
  DecisionFeedbackRequest,
  DecisionFeedbackResponse,
} from "@/lib/api/types"

/**
 * Cliente del navegador. Llama a la ruta interna `/api/decisions/feedback`,
 * que reenvía al backend con el token en servidor (o responde en modo demo).
 */
export async function submitDecisionFeedback(
  payload: DecisionFeedbackRequest
): Promise<DecisionFeedbackResponse> {
  let res: Response
  try {
    res = await fetch("/api/decisions/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error("No se pudo conectar. Revisa tu conexión e intenta de nuevo.")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ||
        "No se pudo registrar tu decisión. Intenta de nuevo."
    )
  }

  return res.json() as Promise<DecisionFeedbackResponse>
}
