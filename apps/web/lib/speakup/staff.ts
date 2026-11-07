import type { InboxCase, InboxReport, StaffRole, StaffUser } from "./types"

export const STAFF_USERS: StaffUser[] = [
  {
    id: "ana",
    name: "Ana Receptor",
    email: "ana@maia.demo",
    password: "maia-demo",
    role: "receptor",
    roleLabel: "Receptor",
  },
  {
    id: "carlos",
    name: "Carlos Investigador",
    email: "carlos@maia.demo",
    password: "maia-demo",
    role: "investigador",
    roleLabel: "Investigador",
  },
  {
    id: "lucia",
    name: "Lucía Admin",
    email: "lucia@maia.demo",
    password: "maia-demo",
    role: "administrador",
    roleLabel: "Administrador",
  },
]

export function findStaffByEmail(email: string) {
  const key = email.trim().toLowerCase()
  return STAFF_USERS.find((u) => u.email === key) ?? null
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export const SEED_REPORTS: InboxReport[] = [
  {
    id: "rep_1",
    trackingCode: "SU-ALFA-2391",
    createdAt: new Date(Date.now() - 36e5).toISOString(),
    status: "recibido",
    category: "Acoso o discriminación",
    ownerId: "ana",
    urgency: "alta",
    dueAt: daysFromNow(2),
    narrative: "Un supervisor pidió borrar documentos el viernes en Lima.",
    mode: "anonymous",
  },
  {
    id: "rep_2",
    trackingCode: "SU-BETA-4410",
    createdAt: new Date(Date.now() - 86e5).toISOString(),
    status: "en_evaluacion",
    category: "Fraude o soborno",
    ownerId: "ana",
    urgency: "media",
    dueAt: daysFromNow(5),
    narrative: "Posible conflicto en un proceso de compras.",
    mode: "confidential",
  },
  {
    id: "rep_3",
    trackingCode: "SU-GAMA-8802",
    createdAt: new Date(Date.now() - 172e5).toISOString(),
    status: "recibido",
    category: "No estoy seguro",
    ownerId: null,
    urgency: "baja",
    dueAt: daysFromNow(7),
    narrative: "Situación en otra sede; pocos datos.",
    mode: "anonymous",
  },
]

export const SEED_CASES: InboxCase[] = [
  {
    id: "MAIA-CA-104",
    createdAt: new Date(Date.now() - 3 * 86e5).toISOString(),
    phase: "investigacion",
    category: "Acoso o discriminación",
    ownerId: "carlos",
    urgency: "alta",
    dueAt: daysFromNow(1),
    title: "Expediente Lima · presunta hostilidad laboral",
  },
  {
    id: "MAIA-CA-118",
    createdAt: new Date(Date.now() - 8 * 86e5).toISOString(),
    phase: "revision",
    category: "Fraude o soborno",
    ownerId: "carlos",
    urgency: "media",
    dueAt: daysFromNow(4),
    title: "Compras · posible conflicto de interés",
  },
  {
    id: "MAIA-CA-090",
    createdAt: new Date(Date.now() - 20 * 86e5).toISOString(),
    phase: "abierto",
    category: "Represalia",
    ownerId: "lucia",
    urgency: "alta",
    dueAt: daysFromNow(3),
    title: "Ruta independiente · reporte contra receptor habitual",
  },
]

export function filterReportsForRole(
  reports: InboxReport[],
  role: StaffRole,
  userId: string
) {
  if (role === "administrador" || role === "revisor") return reports
  if (role === "receptor" || role === "receptor_independiente") {
    return reports.filter(
      (r) => r.ownerId === userId || r.ownerId === null || r.ownerId === "ana"
    )
  }
  return []
}

export function filterCasesForRole(
  cases: InboxCase[],
  role: StaffRole,
  userId: string
) {
  if (role === "administrador" || role === "revisor") return cases
  if (role === "investigador") {
    return cases.filter((c) => c.ownerId === userId)
  }
  return []
}

export function statusLabel(status: InboxReport["status"]) {
  const map: Record<InboxReport["status"], string> = {
    recibido: "Recibido",
    en_evaluacion: "En evaluación",
    vinculado: "Vinculado a caso",
    fuera_de_alcance: "Fuera de alcance",
  }
  return map[status]
}

export function phaseLabel(phase: InboxCase["phase"]) {
  const map: Record<InboxCase["phase"], string> = {
    abierto: "Abierto",
    investigacion: "Investigación",
    revision: "Revisión",
    cerrado: "Cerrado",
  }
  return map[phase]
}

export function urgencyLabel(u: InboxReport["urgency"]) {
  const map = { baja: "Baja", media: "Media", alta: "Alta" }
  return map[u]
}

export function ownerName(id: string | null) {
  if (!id) return "Sin asignar"
  return STAFF_USERS.find((u) => u.id === id)?.name ?? id
}
