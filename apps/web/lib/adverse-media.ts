import type { AdverseMediaItem } from "@/lib/mock-data"

const sentimentOrder: Record<string, number> = {
  negative: 0,
  neutral: 1,
  positive: 2,
  none: 1,
}

/** Acepta dd/mm/aaaa o ISO. Devuelve 0 si no se puede interpretar. */
export function toTime(date: string): number {
  const dmy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date.trim())
  if (dmy) return new Date(+dmy[3]!, +dmy[2]! - 1, +dmy[1]!).getTime()
  const t = Date.parse(date)
  return Number.isNaN(t) ? 0 : t
}

/** Negativos primero y, dentro de cada grupo, lo más reciente arriba. */
export function sortAdverseMedia(items: AdverseMediaItem[]): AdverseMediaItem[] {
  return [...items].sort((a, b) => {
    const s =
      (sentimentOrder[a.sentiment ?? "none"] ?? 1) -
      (sentimentOrder[b.sentiment ?? "none"] ?? 1)
    return s !== 0 ? s : toTime(b.date) - toTime(a.date)
  })
}
