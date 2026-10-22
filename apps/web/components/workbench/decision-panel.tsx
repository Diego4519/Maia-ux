"use client"

import { useEffect, useState } from "react"
import { Check, ShieldAlert, X } from "lucide-react"

import { RiskBadge } from "@/components/maia/risk-badge"
import { AgentReasoningCard } from "@/components/workbench/agent-reasoning-card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import type { RiskLevel } from "@/lib/mock-data"
import type { SourceCoverageItem } from "@/lib/demo-profiles"
import type { EngineAgreement } from "@/lib/api/types"
import { cn } from "@workspace/ui/lib/utils"
import { useCountUp } from "@/lib/use-count-up"

export type DecisionAction = "accept" | "reject" | "escalate" | null

/** Lo que el operador agrega a su decisión (todo opcional salvo el motivo al discrepar). */
export interface DecisionExtras {
  engineAgreement?: EngineAgreement
  comment?: string
}

export interface DecisionResult {
  mockMode?: boolean
  status?: "recorded" | "queued" | "demo"
}

interface DecisionPanelProps {
  name: string
  confidence: number
  riskLevel: RiskLevel
  caseId: string
  reasoning: string
  sourceCoverage: SourceCoverageItem[]
  decisionLabel?: string
  interactive?: boolean
  /** Async: devuelve false para abortar; o { mockMode, status } para informar el estado. */
  onDecide?: (
    action: Exclude<DecisionAction, null>,
    extras: DecisionExtras
  ) => void | boolean | DecisionResult | Promise<void | boolean | DecisionResult>
}

type Action = Exclude<DecisionAction, null>

const actionCopy: Record<Action, string> = {
  accept: "Aceptado con mitigantes",
  reject: "Rechazado",
  escalate: "Escalado a revisión",
}

const actionIntent: Record<Action, string> = {
  accept: "Aceptar con mitigantes",
  escalate: "Escalar a revisión humana",
  reject: "Rechazar onboarding",
}

const agreementCopy: Record<EngineAgreement, string> = {
  agree: "Coincides con el análisis de MAIA",
  disagree: "No coincides con el análisis de MAIA",
}

const MAX_COMMENT = 500

export function DecisionPanel({
  name,
  confidence,
  riskLevel,
  caseId,
  reasoning,
  sourceCoverage,
  decisionLabel = "Revisión humana",
  interactive = true,
  onDecide,
}: DecisionPanelProps) {
  const [decision, setDecision] = useState<DecisionAction>(null)
  const animatedConfidence = useCountUp(confidence, true, 700)
  const [pending, setPending] = useState<Action | null>(null)
  const [agreement, setAgreement] = useState<EngineAgreement | null>(null)
  const [comment, setComment] = useState("")
  const [deciding, setDeciding] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [result, setResult] = useState<DecisionResult | null>(null)
  const [recorded, setRecorded] = useState<DecisionExtras>({})

  useEffect(() => {
    setDecision(null)
    setPending(null)
    setAgreement(null)
    setComment("")
    setFeedbackError(null)
    setResult(null)
    setRecorded({})
  }, [caseId, confidence, name])

  const needsReason = agreement === "disagree"
  const reasonMissing = needsReason && comment.trim().length === 0

  function pick(action: Action) {
    if (decision || deciding) return
    setPending((current) => (current === action ? null : action))
    setFeedbackError(null)
  }

  function cancel() {
    setPending(null)
    setAgreement(null)
    setComment("")
    setFeedbackError(null)
  }

  async function confirm() {
    if (!pending || deciding) return
    if (reasonMissing) {
      setFeedbackError("Explica brevemente por qué no coincides con MAIA.")
      return
    }
    const extras: DecisionExtras = {
      engineAgreement: agreement ?? undefined,
      comment: comment.trim() || undefined,
    }
    setDeciding(true)
    setFeedbackError(null)
    try {
      const outcome = await onDecide?.(pending, extras)
      if (outcome === false) {
        setFeedbackError("No se pudo registrar tu decisión. Intenta de nuevo.")
        return
      }
      setResult(
        outcome && typeof outcome === "object" ? outcome : { status: "recorded" }
      )
      setRecorded(extras)
      setDecision(pending)
      setPending(null)
    } catch (err) {
      setFeedbackError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar tu decisión. Intenta de nuevo."
      )
    } finally {
      setDeciding(false)
    }
  }

  const choiceBase =
    "maia-btn-press h-11 sm:h-10 aria-pressed:ring-2 aria-pressed:ring-offset-0"

  return (
    <Card
      className="maia-panel-accent maia-fade-up relative sticky top-20 h-fit overflow-hidden border-border shadow-md"
      style={{ animationDelay: "140ms" }}
    >
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-heading text-base font-bold">
            Superficie de decisión
          </CardTitle>
          {decision ? (
            <Badge
              variant="secondary"
              className={cn(
                "maia-decision-pop",
                decision === "reject" &&
                  "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
                decision === "accept" &&
                  "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
                decision === "escalate" &&
                  "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
              )}
            >
              {actionCopy[decision]}
            </Badge>
          ) : (
            <Badge variant="outline">{decisionLabel}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div>
          <p className="font-medium leading-snug">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground">Caso {caseId}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confianza MAIA</span>
            <span className="font-heading font-semibold tabular-nums maia-count-up">
              {animatedConfidence}%
            </span>
          </div>
          <div
            role="meter"
            aria-label="Confianza MAIA"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={confidence}
            className="h-2.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${animatedConfidence}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <RiskBadge level={riskLevel} />
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Cobertura de fuentes
          </p>
          <div className="space-y-2">
            {sourceCoverage.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                El servicio no informó la cobertura de fuentes.
              </p>
            ) : (
              sourceCoverage.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between text-xs"
                >
                  <span>{s.name}</span>
                  <span
                    className={cn(
                      "font-medium",
                      s.status === "found" && "font-semibold text-foreground",
                      s.status === "not_found" && "text-muted-foreground",
                      s.status === "not_screened" &&
                        "text-amber-700 dark:text-amber-400"
                    )}
                  >
                    {s.status === "found"
                      ? "Encontrado"
                      : s.status === "not_found"
                        ? "Sin match"
                        : "No screeneado"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <AgentReasoningCard text={reasoning} />

        {interactive ? (
          <div className="space-y-3 border-t pt-4">
            {decision ? (
              <div
                role="status"
                className="maia-decision-pop space-y-1.5 rounded-lg border bg-muted/20 p-3 text-xs"
              >
                <p className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Check className="size-3.5" aria-hidden />
                  Decisión registrada: {actionCopy[decision]}
                </p>
                {recorded.engineAgreement ? (
                  <p className="text-muted-foreground">
                    {agreementCopy[recorded.engineAgreement]}
                  </p>
                ) : null}
                {recorded.comment ? (
                  <p className="text-muted-foreground">
                    Motivo: {recorded.comment}
                  </p>
                ) : null}
                {result?.status === "queued" ? (
                  <p className="text-muted-foreground">
                    Quedó en cola; se confirmará en breve.
                  </p>
                ) : null}
                {result?.mockMode ? (
                  <p className="text-muted-foreground">
                    Modo demostración: esta decisión no se envió al servicio real.
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Tu decisión</p>
                  <p className="text-xs text-muted-foreground">
                    Elige una opción y confírmala.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Button
                    size="sm"
                    variant="outline"
                    aria-pressed={pending === "accept"}
                    className={cn(
                      choiceBase,
                      "border-emerald-200 text-emerald-800 hover:bg-emerald-50 aria-pressed:bg-emerald-50 aria-pressed:ring-emerald-300 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40 dark:aria-pressed:bg-emerald-950/40 dark:aria-pressed:ring-emerald-700"
                    )}
                    disabled={deciding}
                    onClick={() => pick("accept")}
                  >
                    <Check className="mr-1 size-3.5" aria-hidden />
                    Aceptar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-pressed={pending === "escalate"}
                    className={cn(
                      choiceBase,
                      "border-amber-200 text-amber-800 hover:bg-amber-50 aria-pressed:bg-amber-50 aria-pressed:ring-amber-300 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/40 dark:aria-pressed:bg-amber-950/40 dark:aria-pressed:ring-amber-700"
                    )}
                    disabled={deciding}
                    onClick={() => pick("escalate")}
                  >
                    <ShieldAlert className="mr-1 size-3.5" aria-hidden />
                    Escalar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-pressed={pending === "reject"}
                    className={cn(
                      choiceBase,
                      "border-red-200 text-red-700 hover:bg-red-50 aria-pressed:bg-red-50 aria-pressed:ring-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40 dark:aria-pressed:bg-red-950/40 dark:aria-pressed:ring-red-700"
                    )}
                    disabled={deciding}
                    onClick={() => pick("reject")}
                  >
                    <X className="mr-1 size-3.5" aria-hidden />
                    Rechazar
                  </Button>
                </div>

                {pending ? (
                  <div className="maia-enter space-y-3 rounded-lg border bg-muted/20 p-3">
                    <p className="text-sm font-medium">
                      Vas a: {actionIntent[pending]}
                    </p>

                    <fieldset className="space-y-1.5">
                      <legend className="text-xs text-muted-foreground">
                        ¿Coincides con el análisis de MAIA? (opcional)
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            ["agree", "Sí, coincido"],
                            ["disagree", "No coincido"],
                          ] as const
                        ).map(([value, label]) => (
                          <Button
                            key={value}
                            type="button"
                            size="sm"
                            variant="outline"
                            aria-pressed={agreement === value}
                            disabled={deciding}
                            className="maia-btn-press h-9 aria-pressed:border-foreground aria-pressed:bg-muted aria-pressed:font-semibold"
                            onClick={() =>
                              setAgreement((a) => (a === value ? null : value))
                            }
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </fieldset>

                    <div className="space-y-1.5">
                      <label
                        htmlFor={`decision-comment-${caseId}`}
                        className="text-xs text-muted-foreground"
                      >
                        {needsReason ? "Motivo (obligatorio)" : "Motivo (opcional)"}
                      </label>
                      <Textarea
                        id={`decision-comment-${caseId}`}
                        value={comment}
                        maxLength={MAX_COMMENT}
                        rows={3}
                        disabled={deciding}
                        aria-invalid={reasonMissing && !!feedbackError}
                        placeholder={
                          needsReason
                            ? "¿Qué falló en el análisis?"
                            : "Contexto para la auditoría del caso"
                        }
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <p className="text-right text-[11px] tabular-nums text-muted-foreground">
                        {comment.length}/{MAX_COMMENT}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="maia-btn-press h-10 flex-1"
                        disabled={deciding}
                        onClick={confirm}
                      >
                        {deciding ? "Registrando…" : "Confirmar decisión"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-10"
                        disabled={deciding}
                        onClick={cancel}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : null}

                {feedbackError ? (
                  <p
                    role="alert"
                    className="text-xs font-medium text-red-700 dark:text-red-400"
                  >
                    {feedbackError}
                  </p>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
