/**
 * Servicio simulado del backend MAIA que cumple docs/CONTRATO-API-SCREENING.md.
 * Sirve para probar la integración REAL del front sin esperar a staging.
 *
 * Uso manual:
 *   node scripts/fake-maia-api.ts            (puerto 4010, token "test-token")
 *   $env:MAIA_API_BASE_URL="http://127.0.0.1:4010"
 *   $env:MAIA_API_TOKEN="test-token"
 *   $env:MAIA_USE_MOCK="false"
 *   npm run dev
 *
 * Consultas especiales:
 *   __error500  → responde 500
 *   __invalid   → responde 200 sin `profile` (formato inválido)
 *   __empty     → persona sin coincidencias (consultado y limpio)
 */
import http from "node:http"
import type { AddressInfo } from "node:net"

export interface FakeApiOptions {
  port?: number
  token?: string
}

export interface FakeApi {
  url: string
  /** Cuerpos de feedback recibidos, en orden. */
  feedback: Record<string, unknown>[]
  close: () => Promise<void>
}

const carlos = {
  profile: {
    id: "sub-001",
    name: "Carlos Alberto Ramírez Torres",
    document: "DNI 45892136",
    nationality: "Perú",
    birthdate: "14/03/1978",
    tags: ["Persona natural", "PEP potencial"],
  },
  matches: [
    {
      id: "m-1",
      name: "Carlos Alberto Ramírez Torres",
      entityType: "Persona",
      score: 96,
      confidence: 96,
      riskLevel: "high",
      status: "Pendiente",
      source: "PEP Perú + Medios adversos",
      scoreBreakdown: [
        { id: "name_match", label: "Coincidencia de nombre", value: 0.97, unit: "ratio", weight: 0.35, detail: "Fuzzy + normalización fonética" },
        { id: "pep", label: "PEP / personas expuestas", value: 1, unit: "flag", weight: 0.3, detail: "Hit en PEP Perú" },
        { id: "sanctions", label: "Sanciones (OFAC / UE / ONU)", value: 0, unit: "flag", weight: 0.2, detail: "Sin hit" },
        { id: "adverse_media", label: "Medios adversos", value: 0.88, unit: "ratio", weight: 0.15, detail: "2 menciones relevantes" },
      ],
    },
  ],
  reasoning: "MAIA detectó coincidencia de alta confianza en PEP y medios adversos.",
  sourceCoverage: [
    { name: "PEP Perú", status: "found" },
    { name: "OFAC SDN", status: "not_found" },
    { name: "Medios adversos", status: "found" },
    { name: "UN Consolidated", status: "not_screened" },
  ],
  adverseMedia: [
    { id: "am-1", title: "Exfuncionario vinculado a investigación de lavado", source: "El Comercio", date: "12/03/2024", snippet: "El nombre aparece en cobertura sobre una investigación preliminar.", url: "https://example.com/noticia-1", sentiment: "negative" },
    { id: "am-2", title: "Participación en evento gremial", source: "Gestión", date: "05/06/2022", snippet: "Nota neutra sobre asistencia a foro empresarial.", url: "https://example.com/noticia-2", sentiment: "neutral" },
  ],
}

function clean(name: string) {
  return {
    profile: {
      id: `sub-${Date.now()}`,
      name,
      document: "Sin documento",
      nationality: "—",
      birthdate: "—",
      tags: ["Consulta nueva"],
    },
    matches: [],
    reasoning: "No se encontraron coincidencias en las listas consultadas.",
    sourceCoverage: [
      { name: "PEP Perú", status: "not_found" },
      { name: "OFAC SDN", status: "not_found" },
      { name: "Medios adversos", status: "not_found" },
    ],
    adverseMedia: [],
  }
}

function send(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(JSON.stringify(body))
}

export function startFakeApi(options: FakeApiOptions = {}): Promise<FakeApi> {
  const feedback: Record<string, unknown>[] = []

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost")

    if (options.token && req.headers.authorization !== `Bearer ${options.token}`) {
      return send(res, 401, { error: "unauthorized" })
    }

    if (req.method === "GET" && url.pathname === "/screening/search") {
      const q = (url.searchParams.get("q") ?? "").trim()
      if (q === "__error500") return send(res, 500, { error: "boom" })
      if (q === "__invalid") return send(res, 200, { hello: "world" })
      if (q === "__empty") return send(res, 200, clean("Persona Sin Hallazgos"))
      if (/carlos/i.test(q)) return send(res, 200, carlos)
      return send(res, 200, clean(q))
    }

    if (req.method === "POST" && url.pathname === "/decisions/feedback") {
      let raw = ""
      req.on("data", (c) => (raw += c))
      req.on("end", () => {
        try {
          feedback.push(JSON.parse(raw) as Record<string, unknown>)
        } catch {
          return send(res, 400, { error: "invalid json" })
        }
        send(res, 200, {
          id: `fb-${feedback.length}`,
          status: "recorded",
          recordedAt: new Date().toISOString(),
        })
      })
      return
    }

    send(res, 404, { error: "not found" })
  })

  return new Promise((resolve) => {
    server.listen(options.port ?? 0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo
      resolve({
        url: `http://127.0.0.1:${port}`,
        feedback,
        close: () =>
          new Promise<void>((done) => {
            server.closeAllConnections?.()
            server.close(() => done())
          }),
      })
    })
  })
}

// Ejecución directa: node scripts/fake-maia-api.ts
if (process.argv[1] && /fake-maia-api\.ts$/.test(process.argv[1])) {
  const port = Number(process.env.FAKE_API_PORT ?? 4010)
  const token = process.env.FAKE_API_TOKEN ?? "test-token"
  startFakeApi({ port, token }).then((api) => {
    console.log(`Fake MAIA API en ${api.url}  (Bearer ${token})`)
  })
}
