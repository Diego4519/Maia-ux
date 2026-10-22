/**
 * Configuración de integración con backend MAIA.
 *
 * Hoy: USE_MOCK=true por defecto (sin URL de Diego).
 * Mañana: MAIA_API_BASE_URL + MAIA_USE_MOCK=false → cableado real.
 */

export function getApiBaseUrl(): string | null {
  const url =
    process.env.MAIA_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAIA_API_BASE_URL?.trim()
  return url || null
}

export function isMockMode(): boolean {
  const flag =
    process.env.MAIA_USE_MOCK ?? process.env.NEXT_PUBLIC_MAIA_USE_MOCK
  if (flag === "false" || flag === "0") return false
  if (flag === "true" || flag === "1") return true
  // Sin URL de API → siempre mock
  return !getApiBaseUrl()
}

export function getDecisionsFeedbackPath(): string {
  return (
    process.env.MAIA_DECISIONS_FEEDBACK_PATH?.trim() ||
    "/decisions/feedback"
  )
}

export function getScreeningSearchPath(): string {
  return (
    process.env.MAIA_SCREENING_SEARCH_PATH?.trim() || "/screening/search"
  )
}
