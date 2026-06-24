export type RiskLevel = "low" | "medium" | "high"

export interface SubjectProfile {
  id: string
  name: string
  document: string
  nationality: string
  birthdate: string
  tags: string[]
}

export interface ScreeningMatch {
  id: string
  name: string
  entityType: string
  score: number
  riskLevel: RiskLevel
  status: "Pendiente" | "En revisión" | "Cerrado" | "Auto-resuelto"
  source: string
  confidence: number
  decision?: string
}

export interface ApiAlert {
  id: string
  name: string
  riskLevel: RiskLevel
  confidence: number
  status: "needs_resolution" | "resolved" | "auto_executed"
  caseId: string
}

export interface DataSource {
  id: string
  name: string
  type: string
  status: "active" | "inactive"
  lastSync: string
}

export interface PolicyRule {
  id: string
  name: string
  criticality: RiskLevel | "critical"
  decision: string
}

export interface EvidenceCase {
  id: string
  caseNumber: string
  name: string
  mode: "Individual" | "Massive" | "API"
  decision: string
  riskLevel: RiskLevel
  date: string
}

export const workbenchKpis = {
  currentSet: "Enhanced Due Diligence",
  activeLists: 7,
  automationPaths: 3,
  evidenceFormats: "PDF · XLSX · API",
}

export const subjectProfile: SubjectProfile = {
  id: "sub-001",
  name: "Carlos Alberto Ramírez Torres",
  document: "DNI 45892136",
  nationality: "Perú",
  birthdate: "14/03/1978",
  tags: ["Persona natural", "PEP potencial", "Nombre normalizado"],
}

export const screeningMatches: ScreeningMatch[] = [
  {
    id: "1",
    name: "Carlos Alberto Ramírez Torres",
    entityType: "Persona",
    score: 96,
    riskLevel: "high",
    status: "Pendiente",
    source: "PEP Perú + Medios adversos",
    confidence: 96,
    decision: "Escalar a revisión humana",
  },
  {
    id: "2",
    name: "María Fernanda López",
    entityType: "Persona",
    score: 54,
    riskLevel: "medium",
    status: "En revisión",
    source: "PEP Nacional",
    confidence: 72,
  },
  {
    id: "3",
    name: "Roberto Silva Vega",
    entityType: "Persona",
    score: 18,
    riskLevel: "low",
    status: "Auto-resuelto",
    source: "Sin coincidencias críticas",
    confidence: 91,
    decision: "Aceptar",
  },
]

export const massiveBatch = {
  total: 2418,
  autoReady: 2301,
  exceptions: 117,
  critical: 12,
}

export const massiveRows = [
  {
    id: 1,
    raw: "CARLOS ALBERTO RAMIREZ TORRES|45892136",
    structured: "Carlos Alberto Ramírez Torres",
    document: "45892136",
    quality: "Strong",
    status: "Exception",
  },
  {
    id: 2,
    raw: "INVERSIONES ANDINAS SAC",
    structured: "Inversiones Andinas S.A.C.",
    document: "20547896321",
    quality: "Strong",
    status: "Ready",
  },
  {
    id: 3,
    raw: "maria lopez f",
    structured: "María Fernanda López",
    document: "—",
    quality: "Medium",
    status: "Exception",
  },
]

export const apiAlerts: ApiAlert[] = [
  {
    id: "api-1",
    name: "Carlos Alberto Ramírez Torres",
    riskLevel: "high",
    confidence: 96,
    status: "needs_resolution",
    caseId: "API-1042",
  },
  {
    id: "api-2",
    name: "Grupo Financiero del Pacífico",
    riskLevel: "medium",
    confidence: 68,
    status: "auto_executed",
    caseId: "API-1041",
  },
  {
    id: "api-3",
    name: "Roberto Silva Vega",
    riskLevel: "low",
    confidence: 94,
    status: "resolved",
    caseId: "API-1040",
  },
]

export const dataSources: DataSource[] = [
  {
    id: "ofac",
    name: "OFAC SDN",
    type: "Sanciones · Fuente oficial",
    status: "active",
    lastSync: "Hace 12 min",
  },
  {
    id: "un",
    name: "UN Consolidated",
    type: "Sanciones · Fuente oficial",
    status: "active",
    lastSync: "Hace 1 h",
  },
  {
    id: "pep",
    name: "PEP Nacional",
    type: "PEP · Lista interna",
    status: "active",
    lastSync: "Hace 3 h",
  },
]

export const policyRules: PolicyRule[] = [
  {
    id: "r1",
    name: "Coincidencia exacta en sanciones activas",
    criticality: "critical",
    decision: "Rechazar",
  },
  {
    id: "r2",
    name: "PEP histórico con mitigantes",
    criticality: "medium",
    decision: "Aceptar con mitigantes",
  },
  {
    id: "r3",
    name: "Medios adversos sin corroborar",
    criticality: "medium",
    decision: "Revisión humana",
  },
]

export const evidenceCases: EvidenceCase[] = [
  {
    id: "ev-1",
    caseNumber: "CASE-10091",
    name: "Carlos Alberto Ramírez Torres",
    mode: "Individual",
    decision: "Aceptar con mitigantes",
    riskLevel: "high",
    date: "22/06/2026",
  },
  {
    id: "ev-2",
    caseNumber: "CASE-10088",
    name: "Lote corporativo Q2",
    mode: "Massive",
    decision: "117 excepciones elevadas",
    riskLevel: "medium",
    date: "21/06/2026",
  },
]

export const sourceCoverage = [
  { name: "PEP Perú", status: "found" as const },
  { name: "OFAC SDN", status: "not_found" as const },
  { name: "Medios adversos", status: "found" as const },
  { name: "UN Consolidated", status: "not_screened" as const },
]

export const agentReasoningDefault =
  "MAIA detectó coincidencia de alta confianza en PEP y medios adversos. Se recomienda revisión humana antes de aprobar onboarding."
