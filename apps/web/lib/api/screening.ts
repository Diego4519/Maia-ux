import type { ScreeningSearchResponse } from "@/lib/api/types"

/**
 * Cliente de búsqueda usado por la UI.
 * Hoy pasa por la ruta Next `/api/screening/search` (que respeta mock/API).
 * Cuando Diego entregue URL, esa ruta proxea al backend real.
 */
export async function searchScreeningClient(
  query: string
): Promise<ScreeningSearchResponse> {
  const trimmed = query.trim()
  if (!trimmed) {
    throw new Error("Consulta vacía")
  }

  const res = await fetch(
    `/api/screening/search?q=${encodeURIComponent(trimmed)}`
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ||
        `Error ${res.status} en búsqueda`
    )
  }

  return res.json() as Promise<ScreeningSearchResponse>
}
