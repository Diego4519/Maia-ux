/**
 * Errores tipados de la capa de integración.
 * Distinguen "sin resultados" (respuesta válida) de "no se pudo consultar".
 * Un fallo del backend nunca debe leerse como "persona limpia".
 */
export type ApiErrorCode =
  | "not_configured"
  | "unauthorized"
  | "timeout"
  | "unreachable"
  | "upstream_error"
  | "invalid_response"
  | "bad_request"

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number

  constructor(code: ApiErrorCode, message: string, status = 502) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }
}

/** Mensajes pensados para el oficial de cumplimiento, sin jerga técnica. */
export const apiErrorMessages: Record<ApiErrorCode, string> = {
  not_configured:
    "El servicio de screening no está configurado. Avisa al equipo técnico.",
  unauthorized:
    "No hay autorización para consultar el servicio de screening.",
  timeout: "El servicio tardó demasiado en responder.",
  unreachable: "No se pudo conectar con el servicio de screening.",
  upstream_error: "El servicio de screening devolvió un error.",
  invalid_response:
    "El servicio respondió con un formato que MAIA no reconoce.",
  bad_request: "La consulta no es válida.",
}
