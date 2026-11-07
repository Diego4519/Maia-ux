import { createHash, randomBytes, timingSafeEqual } from "crypto"

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function randomFrom(alphabet: string, length: number) {
  const bytes = randomBytes(length)
  let out = ""
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length]
  }
  return out
}

export function generateTrackingCode() {
  return `SU-${randomFrom(ALPHABET, 4)}-${randomFrom(ALPHABET, 4)}`
}

export function generateSecret() {
  return `${randomFrom(ALPHABET, 4)}-${randomFrom(ALPHABET, 4)}-${randomFrom(ALPHABET, 4)}`
}

export function newSalt() {
  return randomBytes(16).toString("hex")
}

export function hashSecret(secret: string, salt: string) {
  const normalized = secret.replace(/\s+/g, "").toUpperCase()
  return createHash("sha256").update(`${salt}:${normalized}`).digest("hex")
}

export function secretsMatch(
  secret: string,
  salt: string,
  expectedHash: string
) {
  const actual = hashSecret(secret, salt)
  const a = Buffer.from(actual, "hex")
  const b = Buffer.from(expectedHash, "hex")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function newId(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`
}

export function newSessionToken() {
  return randomBytes(24).toString("hex")
}
