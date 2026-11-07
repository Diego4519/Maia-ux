import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import path from "path"

import {
  generateSecret,
  generateTrackingCode,
  hashSecret,
  newId,
  newSalt,
  newSessionToken,
  secretsMatch,
} from "./crypto"
import {
  filterCasesForRole,
  filterReportsForRole,
  findStaffByEmail,
  SEED_CASES,
  SEED_REPORTS,
  STAFF_USERS,
} from "./staff"
import type {
  AttachmentMeta,
  InboxCase,
  InboxReport,
  MailMessage,
  StaffUser,
} from "./types"

const CATEGORY_LABELS: Record<string, string> = {
  acoso: "Acoso o discriminación",
  fraude: "Fraude o soborno",
  represalia: "Represalia",
  seguridad: "Seguridad e higiene",
  otro: "Otro incumplimiento",
  "no-estoy-seguro": "No estoy seguro",
}

function categoryLabel(raw: string | null | undefined) {
  if (!raw) return "No especificada"
  return CATEGORY_LABELS[raw] || raw
}

function normalizeAttachments(raw: unknown): AttachmentMeta[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    const a = item as { name?: string; size?: number; type?: string }
    return {
      name: String(a?.name ?? "archivo"),
      size: Number(a?.size ?? 0),
      type: String(a?.type ?? "application/octet-stream"),
    }
  })
}

export type ReportRecord = {
  trackingCode: string
  secretHash: string
  secretSalt: string
  createdAt: string
  narrative: string
  mode: string
  category: string | null
  messages: MailMessage[]
}

type MailboxSession = {
  token: string
  trackingCode: string
  expiresAt: number
}

type StaffSession = {
  token: string
  userId: string
  expiresAt: number
}

type StoreFile = {
  reports: Record<string, ReportRecord>
  lockouts: Record<string, { failedAttempts: number; lockedUntil: number | null }>
  mailboxSessions: Record<string, MailboxSession>
  staffSessions: Record<string, StaffSession>
  inboxReports: InboxReport[]
  inboxCases: InboxCase[]
}

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "speakup.json")
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000
const SESSION_MS = 8 * 60 * 60 * 1000

function emptyStore(): StoreFile {
  return {
    reports: {},
    lockouts: {},
    mailboxSessions: {},
    staffSessions: {},
    inboxReports: SEED_REPORTS,
    inboxCases: SEED_CASES,
  }
}

function mergeSeeds(store: StoreFile) {
  const seedReportIds = new Set(SEED_REPORTS.map((row) => row.id))
  const seedCaseIds = new Set(SEED_CASES.map((row) => row.id))
  store.inboxReports = [
    ...SEED_REPORTS,
    ...store.inboxReports.filter((row) => !seedReportIds.has(row.id)),
  ]
  store.inboxCases = [
    ...SEED_CASES,
    ...store.inboxCases.filter((row) => !seedCaseIds.has(row.id)),
  ]
}

function readStore(): StoreFile {
  try {
    if (!existsSync(DATA_FILE)) return emptyStore()
    const parsed = JSON.parse(readFileSync(DATA_FILE, "utf8")) as StoreFile
    parsed.inboxReports ??= []
    parsed.inboxCases ??= []
    parsed.mailboxSessions ??= {}
    parsed.staffSessions ??= {}
    parsed.lockouts ??= {}
    parsed.reports ??= {}
    if (!parsed.inboxReports.length) parsed.inboxReports = [...SEED_REPORTS]
    if (!parsed.inboxCases.length) parsed.inboxCases = [...SEED_CASES]
    mergeSeeds(parsed)
    return parsed
  } catch {
    return emptyStore()
  }
}

function writeStore(store: StoreFile) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function createPublicReport(input: {
  mode: string
  narrative: string
  category?: string | null
  attachments?: unknown
}) {
  const store = readStore()
  const trackingCode = generateTrackingCode()
  const secret = generateSecret()
  const secretSalt = newSalt()
  const now = new Date().toISOString()
  const attachments = normalizeAttachments(input.attachments)
  const category = categoryLabel(input.category)
  const messages: MailMessage[] = [
    {
      id: newId("msg"),
      from: "team",
      body: "Recibimos tu reporte. Para avanzar, ¿puedes contarnos si hay fechas, lugares o personas adicionales que no hayas incluido? Si tienes un archivo que ayude a entender lo ocurrido, puedes adjuntarlo aquí.",
      createdAt: now,
      attachments: [],
    },
  ]
  if (attachments.length) {
    messages.push({
      id: newId("msg"),
      from: "reporter",
      body: "Adjuntos enviados con el reporte.",
      createdAt: now,
      attachments,
    })
  }

  store.reports[trackingCode] = {
    trackingCode,
    secretHash: hashSecret(secret, secretSalt),
    secretSalt,
    createdAt: now,
    narrative: input.narrative,
    mode: input.mode,
    category,
    messages,
  }

  store.inboxReports.unshift({
    id: newId("rep"),
    trackingCode,
    createdAt: now,
    status: "recibido",
    category,
    ownerId: "ana",
    urgency: "media",
    dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    narrative: input.narrative,
    mode: input.mode,
  })

  writeStore(store)
  return { trackingCode, secret, createdAt: now }
}

export async function attemptMailboxLogin(opts: {
  trackingCode: string
  secret: string
}) {
  await delay(280)
  const store = readStore()
  const code = opts.trackingCode.replace(/\s+/g, "").toUpperCase()
  const now = Date.now()
  const lock = store.lockouts[code] ?? { failedAttempts: 0, lockedUntil: null }
  const report = store.reports[code]

  if (lock.lockedUntil && lock.lockedUntil > now) {
    return { ok: false as const, reason: "locked" as const }
  }

  const valid =
    !!report && secretsMatch(opts.secret, report.secretSalt, report.secretHash)

  if (!valid) {
    lock.failedAttempts += 1
    if (lock.failedAttempts >= MAX_ATTEMPTS) lock.lockedUntil = now + LOCK_MS
    store.lockouts[code] = lock
    writeStore(store)
    return {
      ok: false as const,
      reason: (lock.lockedUntil && lock.lockedUntil > now
        ? "locked"
        : "invalid") as "locked" | "invalid",
    }
  }

  store.lockouts[code] = { failedAttempts: 0, lockedUntil: null }
  const token = newSessionToken()
  store.mailboxSessions[token] = {
    token,
    trackingCode: code,
    expiresAt: now + SESSION_MS,
  }
  writeStore(store)
  return { ok: true as const, token, trackingCode: code }
}

export function getMailboxSession(token: string | undefined) {
  if (!token) return null
  const store = readStore()
  const session = store.mailboxSessions[token]
  if (!session || session.expiresAt < Date.now()) return null
  const report = store.reports[session.trackingCode]
  if (!report) return null
  return { session, report }
}

export function destroyMailboxSession(token: string | undefined) {
  if (!token) return
  const store = readStore()
  delete store.mailboxSessions[token]
  writeStore(store)
}

export function appendMailboxReply(opts: {
  token: string
  body: string
  attachments: AttachmentMeta[]
}) {
  const store = readStore()
  const session = store.mailboxSessions[opts.token]
  if (!session || session.expiresAt < Date.now()) {
    return { ok: false as const, status: 401 }
  }
  const report = store.reports[session.trackingCode]
  if (!report) return { ok: false as const, status: 401 }

  const message: MailMessage = {
    id: newId("msg"),
    from: "reporter",
    body: opts.body.trim(),
    createdAt: new Date().toISOString(),
    attachments: opts.attachments,
  }
  report.messages.push(message)
  writeStore(store)
  return { ok: true as const, messages: report.messages }
}

export async function attemptStaffLogin(email: string, password: string) {
  await delay(200)
  const user = findStaffByEmail(email)
  if (!user || user.password !== password) {
    return { ok: false as const }
  }
  const store = readStore()
  const token = newSessionToken()
  store.staffSessions[token] = {
    token,
    userId: user.id,
    expiresAt: Date.now() + SESSION_MS,
  }
  writeStore(store)
  return { ok: true as const, token, user }
}

export function getStaffSession(token: string | undefined): StaffUser | null {
  if (!token) return null
  const store = readStore()
  const session = store.staffSessions[token]
  if (!session || session.expiresAt < Date.now()) return null
  return STAFF_USERS.find((u) => u.id === session.userId) ?? null
}

export function destroyStaffSession(token: string | undefined) {
  if (!token) return
  const store = readStore()
  delete store.staffSessions[token]
  writeStore(store)
}

export function listInboxFor(user: StaffUser) {
  const store = readStore()
  return {
    reports: filterReportsForRole(store.inboxReports, user.role, user.id),
    cases: filterCasesForRole(store.inboxCases, user.role, user.id),
  }
}

export const MAILBOX_COOKIE = "speakup_mailbox"
export const STAFF_COOKIE = "maia_staff"
export const GENERIC_LOGIN_ERROR =
  "No pudimos abrir el buzón. Revisa el código y la clave e inténtalo de nuevo."
export const LOCKED_LOGIN_ERROR =
  "Por seguridad, el acceso quedó temporalmente bloqueado tras varios intentos. Vuelve a intentar más tarde."
export const STAFF_LOGIN_ERROR =
  "No pudimos iniciar sesión. Revisa el correo y la contraseña."

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60,
  }
}
