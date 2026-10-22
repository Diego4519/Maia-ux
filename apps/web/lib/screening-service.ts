import type { ScreeningMatch } from "@/lib/mock-data"
import type { AdverseMediaItem } from "@/lib/mock-data"
import { findDemoSubject, type SourceCoverageItem } from "@/lib/demo-profiles"
import {
  getApiBaseUrl,
  getScreeningSearchPath,
  isMockMode,
} from "@/lib/api/config"
import type { ScreeningSearchResponse } from "@/lib/api/types"
import { ApiError, apiErrorMessages } from "@/lib/api/errors"
import { normalizeSearchResponse } from "@/lib/api/normalize"
import { getDb } from "@/lib/mongodb"

/** @deprecated Prefer ScreeningSearchResponse — alias for compatibility */
export type ScreeningSearchResult = ScreeningSearchResponse

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
  adverseMedia?: AdverseMediaItem[]
  sourceCoverage?: SourceCoverageItem[]
}

const COLLECTION = "screening_subjects"

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function mockSearch(query: string): ScreeningSearchResponse {
  const trimmed = query.trim()
  const demo = findDemoSubject(trimmed)

  if (demo) {
    return {
      source: "mock",
      profile: demo.profile,
      matches: demo.matches,
      reasoning: demo.reasoning,
      sourceCoverage: demo.sourceCoverage,
      adverseMedia: demo.adverseMedia ?? [],
      mockMode: true,
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
    adverseMedia: [],
    mockMode: true,
  }
}

/**
 * Consulta al backend real. Si falla, LANZA ApiError: nunca cae a demo,
 * porque un error de red no puede leerse como "sin coincidencias".
 */
async function searchRemoteApi(
  base: string,
  query: string
): Promise<ScreeningSearchResponse> {
  const url = new URL(
    getScreeningSearchPath().replace(/^\//, ""),
    base.endsWith("/") ? base : `${base}/`
  )
  url.searchParams.set("q", query)

  let res: Response
  try {
    res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        ...(process.env.MAIA_API_TOKEN
          ? { Authorization: `Bearer ${process.env.MAIA_API_TOKEN}` }
          : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    })
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ApiError("timeout", apiErrorMessages.timeout, 504)
    }
    throw new ApiError("unreachable", apiErrorMessages.unreachable, 502)
  }

  if (res.status === 401 || res.status === 403) {
    throw new ApiError("unauthorized", apiErrorMessages.unauthorized, 502)
  }
  if (!res.ok) {
    throw new ApiError("upstream_error", apiErrorMessages.upstream_error, 502)
  }

  let data: unknown
  try {
    data = await res.json()
  } catch {
    throw new ApiError(
      "invalid_response",
      apiErrorMessages.invalid_response,
      502
    )
  }
  return normalizeSearchResponse(data)
}

export async function searchScreening(
  query: string
): Promise<ScreeningSearchResponse> {
  const trimmed = query.trim()
  if (!trimmed) {
    return mockSearch(trimmed)
  }

  // 1) Backend real: con URL configurada y sin forzar demo, es la única fuente.
  //    Si falla, el error se propaga (no hay respaldo silencioso a demo).
  const base = getApiBaseUrl()
  if (base && !isMockMode()) {
    return searchRemoteApi(base, trimmed)
  }

  // 2) Sin forzar mock: intentar Mongo seed
  if (!isMockMode() && process.env.MONGODB_URI) {
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

      if (document) {
        const { matches, reasoning, adverseMedia, sourceCoverage, ...profile } =
          document

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
          sourceCoverage:
            sourceCoverage ??
            ([
              { name: "PEP Perú", status: "not_found" },
              { name: "OFAC SDN", status: "not_found" },
              { name: "Medios adversos", status: "not_found" },
              { name: "UN Consolidated", status: "not_found" },
            ] as SourceCoverageItem[]),
          adverseMedia: adverseMedia ?? [],
          mockMode: false,
        }
      }
    } catch {
      // cae a mock
    }
  }

  // 3) Demo tipado (default hoy)
  return mockSearch(trimmed)
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
    adverseMedia: d.adverseMedia ?? [],
    sourceCoverage: d.sourceCoverage,
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
