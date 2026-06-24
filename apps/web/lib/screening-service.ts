import type {
  ScreeningMatch,
  SubjectProfile,
} from "@/lib/mock-data"
import {
  agentReasoningDefault,
  screeningMatches,
  subjectProfile,
} from "@/lib/mock-data"
import { getDb } from "@/lib/mongodb"

export interface ScreeningSearchResult {
  source: "mongodb" | "mock"
  profile: SubjectProfile
  matches: ScreeningMatch[]
  reasoning: string
}

export interface ScreeningSubjectDocument {
  id: string
  name: string
  document: string
  nationality: string
  birthdate: string
  tags: string[]
  searchTerms: string[]
  matches: ScreeningMatch[]
  reasoning: string
}

const COLLECTION = "screening_subjects"

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function mockSearch(query: string): ScreeningSearchResult {
  const normalized = query.toLowerCase()
  const matchesProfile =
    subjectProfile.name.toLowerCase().includes(normalized) ||
    subjectProfile.document.toLowerCase().includes(normalized) ||
    screeningMatches.some((match) =>
      match.name.toLowerCase().includes(normalized)
    )

  return {
    source: "mock",
    profile: matchesProfile
      ? subjectProfile
      : {
          ...subjectProfile,
          name: query,
          document: "Sin documento",
          tags: ["Consulta nueva", "Pendiente de normalización"],
        },
    matches: matchesProfile ? screeningMatches : [],
    reasoning: matchesProfile
      ? agentReasoningDefault
      : "Sin coincidencias críticas en listas activas. MAIA recomienda aceptar con monitoreo estándar.",
  }
}

export async function searchScreening(
  query: string
): Promise<ScreeningSearchResult> {
  const trimmed = query.trim()
  if (!trimmed) {
    return mockSearch(trimmed)
  }

  if (!process.env.MONGODB_URI) {
    return mockSearch(trimmed)
  }

  try {
    const db = await getDb()
    const collection = db.collection<ScreeningSubjectDocument>(COLLECTION)
    const regex = new RegExp(escapeRegex(trimmed), "i")

    const document = await collection.findOne({
      $or: [
        { name: regex },
        { document: regex },
        { searchTerms: regex },
        { "matches.name": regex },
      ],
    })

    if (!document) {
      return {
        source: "mongodb",
        profile: {
          id: `sub-${Date.now()}`,
          name: trimmed,
          document: "Sin documento",
          nationality: "—",
          birthdate: "—",
          tags: ["Consulta nueva", "Sin coincidencias"],
        },
        matches: [],
        reasoning:
          "MAIA no encontró coincidencias críticas en las listas activas para esta consulta.",
      }
    }

    const { matches, reasoning, ...profile } = document

    return {
      source: "mongodb",
      profile: {
        id: profile.id,
        name: profile.name,
        document: profile.document,
        nationality: profile.nationality,
        birthdate: profile.birthdate,
        tags: profile.tags,
      },
      matches,
      reasoning,
    }
  } catch {
    return mockSearch(trimmed)
  }
}

export async function seedScreeningSubjects() {
  const db = await getDb()
  const collection = db.collection<ScreeningSubjectDocument>(COLLECTION)

  const subjects: ScreeningSubjectDocument[] = [
    {
      ...subjectProfile,
      searchTerms: [
        "carlos",
        "ramirez",
        "torres",
        "45892136",
        "carlos alberto ramirez torres",
      ],
      matches: screeningMatches,
      reasoning: agentReasoningDefault,
    },
    {
      id: "sub-002",
      name: "María Fernanda López",
      document: "DNI 32145678",
      nationality: "Perú",
      birthdate: "02/08/1985",
      tags: ["Persona natural", "PEP Nacional"],
      searchTerms: ["maria", "lopez", "fernanda", "32145678"],
      matches: [screeningMatches[1]!],
      reasoning:
        "Coincidencia media en PEP Nacional. Revisión humana recomendada antes de onboarding.",
    },
    {
      id: "sub-003",
      name: "Inversiones Andinas S.A.C.",
      document: "RUC 20547896321",
      nationality: "Perú",
      birthdate: "—",
      tags: ["Persona jurídica", "Empresa"],
      searchTerms: ["inversiones", "andinas", "sac", "20547896321"],
      matches: [
        {
          id: "4",
          name: "Inversiones Andinas S.A.C.",
          entityType: "Empresa",
          score: 78,
          riskLevel: "high",
          status: "Pendiente",
          source: "Sanciones UE",
          confidence: 78,
          decision: "Escalar a revisión humana",
        },
      ],
      reasoning:
        "Posible coincidencia en lista de sanciones. Validar con documentación corporativa.",
    },
  ]

  await collection.deleteMany({})
  await collection.insertMany(subjects)

  return { inserted: subjects.length, collection: COLLECTION }
}

export async function pingMongo() {
  const db = await getDb()
  await db.command({ ping: 1 })
  const count = await db
    .collection<ScreeningSubjectDocument>(COLLECTION)
    .countDocuments()

  return {
    ok: true as const,
    database: db.databaseName,
    subjects: count,
  }
}
