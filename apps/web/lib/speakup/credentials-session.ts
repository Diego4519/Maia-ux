const prefix = "speakup.secret."

export function saveOneTimeSecret(trackingCode: string, secret: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(
    `${prefix}${trackingCode}`,
    JSON.stringify({ secret, savedAt: Date.now() })
  )
}

export function readOneTimeSecret(trackingCode: string): string | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(`${prefix}${trackingCode}`)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { secret?: string }
    return parsed.secret ?? null
  } catch {
    return null
  }
}

export function clearOneTimeSecret(trackingCode: string) {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(`${prefix}${trackingCode}`)
}
