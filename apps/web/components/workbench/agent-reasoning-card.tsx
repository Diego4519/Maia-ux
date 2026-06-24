import { Brain } from "lucide-react"

interface AgentReasoningCardProps {
  text: string
  title?: string
}

export function AgentReasoningCard({
  text,
  title = "Razonamiento MAIA",
}: AgentReasoningCardProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Brain className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {title}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  )
}
