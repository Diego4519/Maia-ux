import type {
  AdverseMediaItem,
  ScreeningMatch,
  ScoreBreakdownFactor,
  SubjectProfile,
} from "./mock-data"

export type SourceCoverageStatus = "found" | "not_found" | "not_screened"

export interface SourceCoverageItem {
  name: string
  status: SourceCoverageStatus
}

export interface DemoSubject {
  profile: SubjectProfile
  matches: ScreeningMatch[]
  reasoning: string
  searchTerms: string[]
  sourceCoverage: SourceCoverageItem[]
  adverseMedia?: AdverseMediaItem[]
}

function breakdown(
  factors: ScoreBreakdownFactor[]
): ScoreBreakdownFactor[] {
  return factors
}

export const demoSubjects: DemoSubject[] = [
  {
    profile: {
      id: "sub-001",
      name: "Carlos Alberto Ramírez Torres",
      document: "DNI 45892136",
      nationality: "Perú",
      birthdate: "14/03/1978",
      tags: ["Persona natural", "PEP potencial", "Nombre normalizado"],
    },
    searchTerms: ["carlos", "ramirez", "torres", "45892136", "carlos alberto"],
    matches: [
      {
        id: "m-1",
        name: "Carlos Alberto Ramírez Torres",
        entityType: "Persona",
        score: 96,
        riskLevel: "high",
        status: "Pendiente",
        source: "PEP Perú + Medios adversos",
        confidence: 96,
        scoreBreakdown: breakdown([
          {
            id: "name_match",
            label: "Coincidencia de nombre",
            value: 0.97,
            unit: "ratio",
            weight: 0.35,
            detail: "Fuzzy + normalización fonética",
          },
          {
            id: "pep",
            label: "PEP / personas expuestas",
            value: 1,
            unit: "flag",
            weight: 0.3,
            detail: "Hit en PEP Perú",
          },
          {
            id: "sanctions",
            label: "Sanciones (OFAC / UE / ONU)",
            value: 0,
            unit: "flag",
            weight: 0.2,
            detail: "Sin hit",
          },
          {
            id: "adverse_media",
            label: "Medios adversos",
            value: 0.88,
            unit: "ratio",
            weight: 0.15,
            detail: "3 menciones relevantes",
          },
        ]),
      },
    ],
    reasoning:
      "MAIA detectó coincidencia de alta confianza en PEP y medios adversos. Se recomienda revisión humana antes de aprobar onboarding.",
    sourceCoverage: [
      { name: "PEP Perú", status: "found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "found" },
      { name: "UN Consolidated", status: "not_screened" },
    ],
    adverseMedia: [
      {
        id: "am-1",
        title: "Exfuncionario vinculado a investigación de lavado",
        source: "El Comercio",
        date: "12/03/2024",
        snippet:
          "El nombre aparece en cobertura sobre una investigación preliminar de lavado de activos en el sector público.",
        url: "https://example.com/noticia-1",
        sentiment: "negative",
      },
      {
        id: "am-2",
        title: "Lista de personas de interés en informe parlamentario",
        source: "La República",
        date: "28/11/2023",
        snippet:
          "Mención en anexo de informe sobre contratos públicos; sin condena firme reportada.",
        url: "https://example.com/noticia-2",
        sentiment: "negative",
      },
      {
        id: "am-3",
        title: "Participación en evento gremial del sector",
        source: "Gestión",
        date: "05/06/2022",
        snippet:
          "Nota neutra sobre asistencia a foro empresarial; sin hallazgos de riesgo.",
        url: "https://example.com/noticia-3",
        sentiment: "neutral",
      },
    ],
  },
  {
    profile: {
      id: "sub-002",
      name: "María Fernanda López",
      document: "DNI 32145678",
      nationality: "Perú",
      birthdate: "02/08/1985",
      tags: ["Persona natural", "PEP Nacional"],
    },
    searchTerms: ["maria", "lopez", "fernanda", "32145678"],
    matches: [
      {
        id: "m-2",
        name: "María Fernanda López",
        entityType: "Persona",
        score: 54,
        riskLevel: "medium",
        status: "En revisión",
        source: "PEP Nacional",
        confidence: 72,
        scoreBreakdown: breakdown([
          {
            id: "name_match",
            label: "Coincidencia de nombre",
            value: 0.71,
            unit: "ratio",
            weight: 0.35,
          },
          {
            id: "pep",
            label: "PEP / personas expuestas",
            value: 1,
            unit: "flag",
            weight: 0.35,
            detail: "PEP nacional — homonimia posible",
          },
          {
            id: "sanctions",
            label: "Sanciones (OFAC / UE / ONU)",
            value: 0,
            unit: "flag",
            weight: 0.2,
          },
          {
            id: "adverse_media",
            label: "Medios adversos",
            value: 0,
            unit: "flag",
            weight: 0.1,
          },
        ]),
      },
    ],
    reasoning:
      "Coincidencia media en PEP Nacional. Revisión humana recomendada antes de onboarding.",
    sourceCoverage: [
      { name: "PEP Perú", status: "found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "not_found" },
      { name: "UN Consolidated", status: "not_found" },
    ],
    adverseMedia: [],
  },
  {
    profile: {
      id: "sub-003",
      name: "Inversiones Andinas S.A.C.",
      document: "RUC 20547896321",
      nationality: "Perú",
      birthdate: "—",
      tags: ["Persona jurídica", "Empresa"],
    },
    searchTerms: ["inversiones", "andinas", "sac", "20547896321"],
    matches: [
      {
        id: "m-3",
        name: "Inversiones Andinas S.A.C.",
        entityType: "Empresa",
        score: 78,
        riskLevel: "high",
        status: "Pendiente",
        source: "Sanciones UE",
        confidence: 78,
        scoreBreakdown: breakdown([
          {
            id: "name_match",
            label: "Coincidencia de nombre",
            value: 0.92,
            unit: "ratio",
            weight: 0.3,
          },
          {
            id: "pep",
            label: "PEP / personas expuestas",
            value: 0,
            unit: "flag",
            weight: 0.15,
          },
          {
            id: "sanctions",
            label: "Sanciones (OFAC / UE / ONU)",
            value: 1,
            unit: "flag",
            weight: 0.4,
            detail: "Posible hit UE — validar entidad",
          },
          {
            id: "adverse_media",
            label: "Medios adversos",
            value: 0.4,
            unit: "ratio",
            weight: 0.15,
          },
        ]),
      },
    ],
    reasoning:
      "Posible coincidencia en lista de sanciones. Validar con documentación corporativa.",
    sourceCoverage: [
      { name: "PEP Perú", status: "not_found" },
      { name: "EU Sanctions", status: "found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "not_screened" },
    ],
    adverseMedia: [
      {
        id: "am-and-1",
        title: "Empresa mencionada en alerta de compliance regional",
        source: "Bloomberg Línea",
        date: "03/01/2025",
        snippet:
          "Nota sobre posibles vínculos con contrapartes sancionadas; la empresa negó relación comercial.",
        sentiment: "negative",
      },
    ],
  },
  {
    profile: {
      id: "sub-004",
      name: "Roberto Silva Vega",
      document: "DNI 10234567",
      nationality: "Perú",
      birthdate: "22/11/1965",
      tags: ["Persona natural", "Sin alertas"],
    },
    searchTerms: ["roberto", "silva", "vega", "10234567"],
    matches: [],
    reasoning:
      "Sin coincidencias críticas en listas activas. MAIA recomienda aceptar con monitoreo estándar.",
    sourceCoverage: [
      { name: "PEP Perú", status: "not_found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "not_found" },
      { name: "UN Consolidated", status: "not_found" },
    ],
    adverseMedia: [],
  },
  {
    profile: {
      id: "sub-005",
      name: "Javier Morales Castillo",
      document: "DNI 78901234",
      nationality: "Perú",
      birthdate: "05/07/1982",
      tags: ["Persona natural", "OFAC potencial"],
    },
    searchTerms: ["javier", "morales", "castillo", "78901234"],
    matches: [
      {
        id: "m-5",
        name: "Javier Morales Castillo",
        entityType: "Persona",
        score: 89,
        riskLevel: "high",
        status: "Pendiente",
        source: "OFAC SDN",
        confidence: 89,
        scoreBreakdown: breakdown([
          {
            id: "name_match",
            label: "Coincidencia de nombre",
            value: 0.91,
            unit: "ratio",
            weight: 0.3,
          },
          {
            id: "pep",
            label: "PEP / personas expuestas",
            value: 0,
            unit: "flag",
            weight: 0.15,
          },
          {
            id: "sanctions",
            label: "Sanciones (OFAC / UE / ONU)",
            value: 1,
            unit: "flag",
            weight: 0.45,
            detail: "Hit OFAC SDN",
          },
          {
            id: "adverse_media",
            label: "Medios adversos",
            value: 0.2,
            unit: "ratio",
            weight: 0.1,
          },
        ]),
      },
    ],
    reasoning:
      "Coincidencia en OFAC SDN con alta confianza. Bloqueo de onboarding recomendado hasta validación.",
    sourceCoverage: [
      { name: "PEP Perú", status: "not_found" },
      { name: "OFAC SDN", status: "found" },
      { name: "Medios adversos", status: "not_found" },
      { name: "UN Consolidated", status: "not_found" },
    ],
    adverseMedia: [],
  },
  {
    profile: {
      id: "sub-006",
      name: "Ana Lucía Mendoza Ríos",
      document: "DNI 55667788",
      nationality: "Perú",
      birthdate: "18/09/1990",
      tags: ["Persona natural", "Limpio"],
    },
    searchTerms: ["ana", "mendoza", "rios", "lucia", "55667788"],
    matches: [],
    reasoning:
      "Sin coincidencias en 7 listas activas. Perfil limpio para onboarding estándar.",
    sourceCoverage: [
      { name: "PEP Perú", status: "not_found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "not_found" },
      { name: "UN Consolidated", status: "not_found" },
    ],
    adverseMedia: [],
  },
  {
    profile: {
      id: "sub-007",
      name: "Grupo Financiero del Pacífico",
      document: "RUC 20123456789",
      nationality: "Perú",
      birthdate: "—",
      tags: ["Persona jurídica", "Financiero"],
    },
    searchTerms: ["grupo", "financiero", "pacifico", "20123456789"],
    matches: [
      {
        id: "m-7",
        name: "Grupo Financiero del Pacífico",
        entityType: "Empresa",
        score: 68,
        riskLevel: "medium",
        status: "En revisión",
        source: "Medios adversos",
        confidence: 68,
        scoreBreakdown: breakdown([
          {
            id: "name_match",
            label: "Coincidencia de nombre",
            value: 0.85,
            unit: "ratio",
            weight: 0.25,
          },
          {
            id: "pep",
            label: "PEP / personas expuestas",
            value: 0,
            unit: "flag",
            weight: 0.15,
          },
          {
            id: "sanctions",
            label: "Sanciones (OFAC / UE / ONU)",
            value: 0,
            unit: "flag",
            weight: 0.2,
          },
          {
            id: "adverse_media",
            label: "Medios adversos",
            value: 0.78,
            unit: "ratio",
            weight: 0.4,
            detail: "Cobertura reciente sin sentencia",
          },
        ]),
      },
    ],
    reasoning:
      "Menciones en medios adversos sin corroborar. Revisión humana antes de aprobar relación comercial.",
    sourceCoverage: [
      { name: "PEP Perú", status: "not_found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "found" },
      { name: "UN Consolidated", status: "not_found" },
    ],
    adverseMedia: [
      {
        id: "am-gfp-1",
        title: "Grupo financiero bajo escrutinio por operaciones offshore",
        source: "Semana Económica",
        date: "14/08/2024",
        snippet:
          "Reportaje sobre estructuras offshore; el grupo indicó que opera bajo regulación local.",
        sentiment: "negative",
      },
      {
        id: "am-gfp-2",
        title: "Respuesta institucional ante reportes de prensa",
        source: "Andina",
        date: "16/08/2024",
        snippet:
          "Comunicado oficial desmintiendo irregularidades; sin investigación formal citada.",
        sentiment: "neutral",
      },
    ],
  },
  {
    profile: {
      id: "sub-008",
      name: "Transportes del Sur E.I.R.L.",
      document: "RUC 20456789012",
      nationality: "Perú",
      birthdate: "—",
      tags: ["Persona jurídica", "Transporte"],
    },
    searchTerms: ["transportes", "sur", "eirl", "20456789012"],
    matches: [
      {
        id: "m-8",
        name: "Transportes del Sur E.I.R.L.",
        entityType: "Empresa",
        score: 42,
        riskLevel: "medium",
        status: "En revisión",
        source: "PEP indirecto",
        confidence: 55,
        scoreBreakdown: breakdown([
          {
            id: "name_match",
            label: "Coincidencia de nombre",
            value: 0.62,
            unit: "ratio",
            weight: 0.3,
          },
          {
            id: "pep",
            label: "PEP / personas expuestas",
            value: 0.55,
            unit: "ratio",
            weight: 0.4,
            detail: "Vínculo indirecto con PEP",
          },
          {
            id: "sanctions",
            label: "Sanciones (OFAC / UE / ONU)",
            value: 0,
            unit: "flag",
            weight: 0.2,
          },
          {
            id: "adverse_media",
            label: "Medios adversos",
            value: 0,
            unit: "flag",
            weight: 0.1,
          },
        ]),
      },
    ],
    reasoning:
      "Vínculo indirecto con PEP. Evaluar mitigantes y documentación de beneficiarios finales.",
    sourceCoverage: [
      { name: "PEP Perú", status: "found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "not_found" },
      { name: "UN Consolidated", status: "not_screened" },
    ],
    adverseMedia: [],
  },
]

export function findDemoSubject(query: string): DemoSubject | null {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return null

  return (
    demoSubjects.find(
      (s) =>
        s.profile.name.toLowerCase().includes(normalized) ||
        s.profile.document.toLowerCase().includes(normalized) ||
        s.searchTerms.some(
          (t) => t.includes(normalized) || normalized.includes(t)
        )
    ) ?? null
  )
}

export const demoSearchExamples = demoSubjects
  .slice(0, 5)
  .map((s) => s.profile.name)
