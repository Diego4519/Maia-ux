import type * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { RiskLevel } from "@/lib/mock-data"

interface MaiaCardProps extends React.ComponentProps<typeof Card> {
  title: string
  description?: string
  value?: string | number
  riskLevel?: RiskLevel
}

const riskBorder: Record<RiskLevel, string> = {
  low: "border-l-slate-300",
  medium: "border-l-amber-500",
  high: "border-l-red-600",
}

export function MaiaCard({
  title,
  description,
  value,
  riskLevel,
  className,
  ...props
}: MaiaCardProps) {
  return (
    <Card
      className={cn(
        riskLevel && "border-l-4",
        riskLevel && riskBorder[riskLevel],
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {value !== undefined ? (
        <CardContent>
          <p className="font-heading text-3xl font-semibold tracking-tight">
            {value}
          </p>
        </CardContent>
      ) : null}
    </Card>
  )
}
