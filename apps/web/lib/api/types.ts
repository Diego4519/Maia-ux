import type { RiskLevel, ScreeningMatch, SubjectProfile } from "@/lib/mock-data"
import type { SourceCoverageItem } from "@/lib/demo-profiles"
import type {
  AdverseMediaItem,
  ScoreBreakdownFactor,
} from "@/lib/mock-data"

export type { AdverseMediaItem, ScoreBreakdownFactor }

export interface ScreeningSearchResponse {
  source: "api" | "mongodb" | "mock"
  profile: SubjectProfile
  matches: ScreeningMatch[]
  reasoning: string
  sourceCoverage: SourceCoverageItem[]
  adverseMedia: AdverseMediaItem[]
  /** Presente cuando USE_MOCK o sin API_BASE_URL */
  mockMode?: boolean
}

export type DecisionFeedbackAction = "accept" | "reject" | "escalate"

/** Valoración del operador sobre el análisis de MAIA. */
export type EngineAgreement = "agree" | "disagree"

export interface DecisionFeedbackRequest {
  caseId: string
  matchId?: string
  subjectId?: string
  action: DecisionFeedbackAction
  /** ¿El operador coincide con el análisis de MAIA? (opcional) */
  engineAgreement?: EngineAgreement
  comment?: string
  /** true = datos de demostración: el proxy no reenvía al backend real. */
  demo?: boolean
  riskLevel?: RiskLevel
  name?: string
}

export interface DecisionFeedbackResponse {
  id: string
  status: "recorded" | "queued" | "demo"
  recordedAt: string
  mockMode?: boolean
}
