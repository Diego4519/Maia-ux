import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { RiskLevel } from "@/lib/mock-data"

// Claro: texto 700 sobre tinte 50. Oscuro: texto 300 sobre tinte translúcido (contraste AA).
const styles: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  medium:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  high: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
}

const labels: Record<RiskLevel, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-bold", styles[level])}>
      {labels[level]}
    </Badge>
  )
}
