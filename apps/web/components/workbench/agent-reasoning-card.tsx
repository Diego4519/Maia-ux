"use client"

import { useEffect, useState } from "react"
import { Brain } from "lucide-react"

interface AgentReasoningCardProps {
  text: string
  title?: string
}

export function AgentReasoningCard({
  text,
  title = "Razonamiento MAIA",
}: AgentReasoningCardProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-muted/50 px-4 py-3.5">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Brain className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {title}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500 maia-pulse-soft" />
          <span className="text-[10px]">IA activa</span>
        </span>
      </div>
      <p
        className="text-sm leading-relaxed text-foreground transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {text}
      </p>
    </div>
  )
}
