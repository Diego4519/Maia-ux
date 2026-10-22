import { Check, Gavel, Search, Shield } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

const steps: { id: 1 | 2 | 3; label: string; icon: LucideIcon }[] = [
  { id: 1, label: "Buscar", icon: Search },
  { id: 2, label: "Analizar", icon: Shield },
  { id: 3, label: "Decidir", icon: Gavel },
]

export function FlowStepper({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  return (
    <ol className="maia-fade-up flex w-full max-w-md items-center justify-between gap-1">
      {steps.map((step, i) => {
        const done = activeStep > step.id
        const active = activeStep === step.id
        const Icon = step.icon
        return (
          <li
            key={step.id}
            aria-current={active ? "step" : undefined}
            className="flex flex-1 items-center"
          >
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-[background-color,border-color,color,box-shadow] duration-300",
                  done && "border-foreground bg-foreground text-background",
                  active &&
                    "border-foreground bg-background text-foreground ring-4 ring-foreground/10",
                  !done && !active && "border-border bg-muted/30 text-muted-foreground"
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : <Icon className="size-4" />}
              </span>
              <span
                className={cn(
                  "text-xs font-bold",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span
                className={cn(
                  "mx-1 mb-5 h-0.5 flex-1 max-w-8 transition-colors duration-300",
                  done ? "bg-foreground" : "bg-border"
                )}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
