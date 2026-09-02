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
  reasoning: string
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
    status: "Exception",
  },
  {
    id: 3,
    raw: "maria lopez f",
    structured: "María Fernanda López",
    document: "—",
    quality: "Medium",
    status: "Exception",
  },
  {
    id: 4,
    raw: "JAVIER MORALES C|78901234",
    structured: "Javier Morales Castillo",
    document: "78901234",
    quality: "Strong",
    status: "Exception",
  },
  {
    id: 5,
    raw: "GRUPO FINANCIERO PACIFICO",
    structured: "Grupo Financiero del Pacífico",
    document: "20123456789",
    quality: "Medium",
    status: "Exception",
  },
  {
    id: 6,
    raw: "TRANSPORTES DEL SUR EIRL",
    structured: "Transportes del Sur E.I.R.L.",
    document: "20456789012",
    quality: "Medium",
    status: "Exception",
  },
  {
    id: 7,
    raw: "ROBERTO SILVA VEGA",
    structured: "Roberto Silva Vega",
    document: "10234567",
    quality: "Strong",
    status: "Ready",
  },
  {
    id: 8,
    raw: "ANA LUCIA MENDOZA RIOS",
    structured: "Ana Lucía Mendoza Ríos",
    document: "55667788",
    quality: "Strong",
    status: "Ready",
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
    reasoning:
      "Evento API de onboarding detectó coincidencia PEP + medios adversos. El motor automático elevó el caso porque supera el umbral de confianza configurado.",
  },
  {
    id: "api-2",
    name: "Grupo Financiero del Pacífico",
    riskLevel: "medium",
    confidence: 68,
    status: "auto_executed",
    caseId: "API-1041",
    reasoning:
      "Medios adversos sin corroborar. MAIA aplicó política de monitoreo estándar sin intervención humana.",
  },
  {
    id: "api-3",
    name: "Roberto Silva Vega",
    riskLevel: "low",
    confidence: 94,
    status: "resolved",
    caseId: "API-1040",
    reasoning:
      "Sin coincidencias críticas. Resuelto automáticamente con aceptación estándar.",
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
  {
    id: "eu",
    name: "EU Sanctions",
    type: "Sanciones · Fuente oficial",
    status: "active",
    lastSync: "Hace 2 h",
  },
  {
    id: "adverse",
    name: "Medios Adversos",
    type: "Medios · Agregador",
    status: "active",
    lastSync: "Hace 45 min",
  },
  {
    id: "interpol",
    name: "INTERPOL",
    type: "Alertas · Fuente oficial",
    status: "inactive",
    lastSync: "Hace 2 días",
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
  {
    id: "ev-3",
    caseNumber: "CASE-10085",
    name: "Grupo Financiero del Pacífico",
    mode: "API",
    decision: "Auto-ejecutado",
    riskLevel: "medium",
    date: "20/06/2026",
  },
  {
    id: "ev-4",
    caseNumber: "CASE-10082",
    name: "Roberto Silva Vega",
    mode: "Individual",
    decision: "Aceptar",
    riskLevel: "low",
    date: "19/06/2026",
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

export const exceptionQueue = [
  {
    id: "ex-1",
    name: "Carlos Alberto Ramírez Torres",
    reason: "PEP + medios adversos",
    riskLevel: "high" as RiskLevel,
    age: "hace 12 min",
    href: "/screening/individual?q=Carlos%20Alberto%20Ram%C3%ADrez%20Torres",
  },
  {
    id: "ex-2",
    name: "Inversiones Andinas S.A.C.",
    reason: "Posible sanción UE",
    riskLevel: "high" as RiskLevel,
    age: "hace 41 min",
    href: "/screening/individual?q=Inversiones%20Andinas%20S.A.C.",
  },
  {
    id: "ex-3",
    name: "María Fernanda López",
    reason: "PEP nacional — revisión",
    riskLevel: "medium" as RiskLevel,
    age: "hace 2 h",
    href: "/screening/individual?q=Mar%C3%ADa%20Fernanda%20L%C3%B3pez",
  },
  {
    id: "ex-4",
    name: "Javier Morales Castillo",
    reason: "Coincidencia OFAC SDN",
    riskLevel: "high" as RiskLevel,
    age: "hace 3 h",
    href: "/screening/individual?q=Javier%20Morales%20Castillo",
  },
  {
    id: "ex-5",
    name: "Grupo Financiero del Pacífico",
    reason: "Medios adversos",
    riskLevel: "medium" as RiskLevel,
    age: "hace 4 h",
    href: "/screening/individual?q=Grupo%20Financiero%20del%20Pac%C3%ADfico",
  },
]

export const activityFeed = [
  {
    id: "act-1",
    title: "Excepción elevada",
    detail: "Carlos Alberto Ramírez Torres · Individual",
    time: "12:04",
  },
  {
    id: "act-2",
    title: "Lote Q2 procesado",
    detail: "2,418 registros · 117 excepciones",
    time: "11:40",
  },
  {
    id: "act-3",
    title: "Alerta API resuelta",
    detail: "API-1040 · auto-ejecutado",
    time: "11:12",
  },
  {
    id: "act-4",
    title: "Fuente sincronizada",
    detail: "OFAC SDN · hace 12 min",
    time: "10:58",
  },
]

export const opsSnapshot = {
  exceptionsOpen: 5,
  autoResolvedToday: 184,
  avgDecisionMin: 4.2,
  listsHealthy: "7/7",
  throughputPerHour: 312,
  automationRate: 94.2,
}

export const automationHealth = [
  { label: "Motor de screening", status: "online" as const, latency: "120ms" },
  { label: "Normalización NLP", status: "online" as const, latency: "45ms" },
  { label: "API Gateway", status: "online" as const, latency: "89ms" },
  { label: "Evidencia inmutable", status: "online" as const, latency: "12ms" },
]

export const tabBadges: Record<string, number | undefined> = {
  "api-alerts": 1,
  massive: 117,
  evidence: 2,
}
