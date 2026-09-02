import { Check } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

const steps = [
  { id: 1, label: "Buscar" },
  { id: 2, label: "Analizar" },
  { id: 3, label: "Decidir" },
]

export function FlowStepper({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  return (
    <ol className="maia-fade-up flex items-center gap-2 sm:gap-3">
      {steps.map((step, i) => {
        const done = activeStep > step.id
        const active = activeStep === step.id
        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300",
                  done && "border-foreground bg-foreground text-background",
                  active &&
                    "border-foreground bg-background text-foreground ring-2 ring-foreground/15 maia-glow",
                  !done && !active && "border-border text-muted-foreground"
                )}
              >
                {done ? <Check className="size-3.5" /> : step.id}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span
                className={cn(
                  "hidden h-px w-8 transition-colors duration-500 sm:block",
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
