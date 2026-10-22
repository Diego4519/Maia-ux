import { ApiError } from "@/lib/api/errors"
import type { ScreeningSearchResponse } from "@/lib/api/types"
import type {
  AdverseMediaItem,
  RiskLevel,
  ScoreBreakdownFactor,
  ScreeningMatch,
  SubjectProfile,
} from "@/lib/mock-data"
import type {
  SourceCoverageItem,
  SourceCoverageStatus,
} from "@/lib/demo-profiles"

/**
 * Adaptador entre el contrato del backend y la estructura de la UI.
 * Regla del proyecto: el contrato se adapta a la UI, no al revés.
 * Tolerante con campos opcionales; estricto con lo imprescindible (perfil).
 */

type Rec = Record<string, unknown>

function isRec(v: unknown): v is Rec {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback
}

const riskLevels: RiskLevel[] = ["low", "medium", "high"]

function risk(v: unknown): RiskLevel {
  return riskLevels.includes(v as RiskLevel) ? (v as RiskLevel) : "medium"
}

function breakdown(v: unknown): ScoreBreakdownFactor[] | undefined {
  if (!Array.isArray(v)) return undefined
  return v.filter(isRec).map((f, i) => ({
    id: str(f.id, `factor-${i}`),
    label: str(f.label, "Factor"),
    value: num(f.value),
    unit: (["ratio", "percent", "flag"] as const).includes(f.unit as never)
      ? (f.unit as ScoreBreakdownFactor["unit"])
      : undefined,
    weight: typeof f.weight === "number" ? f.weight : undefined,
    detail: typeof f.detail === "string" ? f.detail : undefined,
  }))
}

function match(v: unknown, i: number): ScreeningMatch {
  const m = isRec(v) ? v : {}
  const status = str(m.status, "Pendiente")
  return {
    id: str(m.id, `match-${i}`),
    name: str(m.name, "Sin nombre"),
    entityType: str(m.entityType, "Persona"),
    score: num(m.score),
    riskLevel: risk(m.riskLevel),
    status: (["Pendiente", "En revisión", "Cerrado", "Auto-resuelto"].includes(
      status
    )
      ? status
      : "Pendiente") as ScreeningMatch["status"],
    source: str(m.source, "—"),
    confidence: num(m.confidence),
    decision: typeof m.decision === "string" ? m.decision : undefined,
    scoreBreakdown: breakdown(m.scoreBreakdown),
  }
}

function media(v: unknown, i: number): AdverseMediaItem {
  const a = isRec(v) ? v : {}
  const sentiment = a.sentiment
  return {
    id: str(a.id, `media-${i}`),
    title: str(a.title, "Sin título"),
    source: str(a.source, "Fuente no indicada"),
    date: str(a.date, ""),
    snippet: str(a.snippet, ""),
    url: typeof a.url === "string" && /^https?:\/\//.test(a.url) ? a.url : undefined,
    sentiment:
      sentiment === "negative" ||
      sentiment === "neutral" ||
      sentiment === "positive"
        ? sentiment
        : undefined,
  }
}

function coverage(v: unknown): SourceCoverageItem[] {
  if (!Array.isArray(v)) return []
  const statuses: SourceCoverageStatus[] = ["found", "not_found", "not_screened"]
  return v.filter(isRec).map((s) => ({
    name: str(s.name, "Fuente"),
    status: statuses.includes(s.status as SourceCoverageStatus)
      ? (s.status as SourceCoverageStatus)
      : "not_screened",
  }))
}

export function normalizeSearchResponse(raw: unknown): ScreeningSearchResponse {
  if (!isRec(raw) || !isRec(raw.profile)) {
    throw new ApiError(
      "invalid_response",
      "La respuesta no incluye el perfil consultado."
    )
  }
  const p = raw.profile
  const profile: SubjectProfile = {
    id: str(p.id, "sub-api"),
    name: str(p.name, "Sin nombre"),
    document: str(p.document, "Sin documento"),
    nationality: str(p.nationality, "—"),
    birthdate: str(p.birthdate, "—"),
    tags: Array.isArray(p.tags) ? p.tags.filter((t) => typeof t === "string") : [],
  }

  return {
    source: "api",
    profile,
    matches: Array.isArray(raw.matches) ? raw.matches.map(match) : [],
    reasoning: str(raw.reasoning),
    sourceCoverage: coverage(raw.sourceCoverage),
    adverseMedia: Array.isArray(raw.adverseMedia)
      ? raw.adverseMedia.map(media)
      : [],
    mockMode: false,
  }
}
