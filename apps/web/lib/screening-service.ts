import type { ScreeningMatch, SubjectProfile } from "@/lib/mock-data"
import { findDemoSubject, type SourceCoverageItem } from "@/lib/demo-profiles"
import { getDb } from "@/lib/mongodb"

export interface ScreeningSearchResult {
  source: "mongodb" | "mock"
  profile: SubjectProfile
  matches: ScreeningMatch[]
  reasoning: string
  sourceCoverage: SourceCoverageItem[]
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
  const trimmed = query.trim()
  const demo = findDemoSubject(trimmed)

  if (demo) {
    return {
      source: "mock",
      profile: demo.profile,
      matches: demo.matches,
      reasoning: demo.reasoning,
      sourceCoverage: demo.sourceCoverage,
    }
  }

  return {
    source: "mock",
    profile: {
      id: `sub-new-${Date.now()}`,
      name: trimmed,
      document: "Sin documento",
      nationality: "—",
      birthdate: "—",
      tags: ["Consulta nueva", "Sin coincidencias"],
    },
    matches: [],
    reasoning:
      "MAIA no encontró coincidencias críticas en las listas activas para esta consulta.",
    sourceCoverage: [
      { name: "PEP Perú", status: "not_found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "not_found" },
      { name: "UN Consolidated", status: "not_found" },
    ],
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
      return mockSearch(trimmed)
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
      sourceCoverage: [
        { name: "PEP Perú", status: "not_found" },
        { name: "OFAC SDN", status: "not_found" },
        { name: "Medios adversos", status: "not_found" },
        { name: "UN Consolidated", status: "not_found" },
      ],
    }
  } catch {
    return mockSearch(trimmed)
  }
}

export async function seedScreeningSubjects() {
  const { demoSubjects } = await import("@/lib/demo-profiles")
  const db = await getDb()
  const collection = db.collection<ScreeningSubjectDocument>(COLLECTION)

  const subjects: ScreeningSubjectDocument[] = demoSubjects.map((d) => ({
    ...d.profile,
    searchTerms: d.searchTerms,
    matches: d.matches,
    reasoning: d.reasoning,
  }))

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
