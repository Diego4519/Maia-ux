"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import type { DecisionAction } from "@/components/workbench/decision-panel"
import type { EvidenceCase, RiskLevel } from "@/lib/mock-data"
import {
  activityFeed as initialActivity,
  apiAlerts as initialAlerts,
  evidenceCases as initialEvidence,
  exceptionQueue as initialExceptions,
  opsSnapshot as initialOps,
} from "@/lib/mock-data"

export interface ExceptionItem {
  id: string
  name: string
  reason: string
  riskLevel: RiskLevel
  age: string
  href: string
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  time: string
}

interface RecordDecisionParams {
  name: string
  action: Exclude<DecisionAction, null>
  riskLevel: RiskLevel
  mode?: EvidenceCase["mode"]
}

interface WorkbenchContextValue {
  exceptionQueue: ExceptionItem[]
  evidenceCases: EvidenceCase[]
  activityFeed: ActivityItem[]
  pendingAlerts: number
  autoResolvedToday: number
  lastEvidenceId: string | null
  recordDecision: (params: RecordDecisionParams) => string
  resolveAlert: (id: string) => void
  resolvedAlertIds: string[]
  resetDemo: () => void
}

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null)

const decisionLabels: Record<Exclude<DecisionAction, null>, string> = {
  accept: "Aceptar con mitigantes",
  reject: "Rechazado",
  escalate: "Escalado a revisión humana",
}

function nowTime() {
  return new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function todayDate() {
  return new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function WorkbenchProvider({ children }: { children: React.ReactNode }) {
  const [exceptionQueue, setExceptionQueue] =
    useState<ExceptionItem[]>(initialExceptions)
  const [evidenceCases, setEvidenceCases] =
    useState<EvidenceCase[]>(initialEvidence)
  const [activityFeed, setActivityFeed] =
    useState<ActivityItem[]>(initialActivity)
  const [autoResolvedToday, setAutoResolvedToday] = useState(
    initialOps.autoResolvedToday
  )
  const [resolvedAlertIds, setResolvedAlertIds] = useState<string[]>([])
  const [lastEvidenceId, setLastEvidenceId] = useState<string | null>(null)

  const pendingAlerts = useMemo(
    () =>
      initialAlerts.filter(
        (a) =>
          a.status === "needs_resolution" && !resolvedAlertIds.includes(a.id)
      ).length,
    [resolvedAlertIds]
  )

  const recordDecision = useCallback(
    ({ name, action, riskLevel, mode = "Individual" }: RecordDecisionParams) => {
      const decision = decisionLabels[action]
      const evidenceId = `ev-new-${Date.now()}`

      setExceptionQueue((prev) =>
        prev.filter((ex) => ex.name.toLowerCase() !== name.toLowerCase())
      )

      const caseNumber = `CASE-${10092 + evidenceCases.length}`
      const newEvidence: EvidenceCase = {
        id: evidenceId,
        caseNumber,
        name,
        mode,
        decision,
        riskLevel,
        date: todayDate(),
      }

      setEvidenceCases((prev) => [newEvidence, ...prev])
      setAutoResolvedToday((n) => n + 1)
      setLastEvidenceId(evidenceId)

      setActivityFeed((prev) => [
        {
          id: `act-${Date.now()}`,
          title: "Decisión registrada",
          detail: `${name} · ${decision}`,
          time: nowTime(),
        },
        ...prev.slice(0, 5),
      ])

      return evidenceId
    },
    [evidenceCases.length]
  )

  const resolveAlert = useCallback((id: string) => {
    setResolvedAlertIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    )
    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        title: "Alerta API resuelta",
        detail: `${id} · resuelto por analista`,
        time: nowTime(),
      },
      ...prev.slice(0, 5),
    ])
  }, [])

  const resetDemo = useCallback(() => {
    setExceptionQueue(initialExceptions)
    setEvidenceCases(initialEvidence)
    setActivityFeed(initialActivity)
    setAutoResolvedToday(initialOps.autoResolvedToday)
    setResolvedAlertIds([])
    setLastEvidenceId(null)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("maia-guide-dismissed")
      sessionStorage.removeItem("maia-boot-seen")
    }
  }, [])

  const value = useMemo(
    () => ({
      exceptionQueue,
      evidenceCases,
      activityFeed,
      pendingAlerts,
      autoResolvedToday,
      lastEvidenceId,
      recordDecision,
      resolveAlert,
      resolvedAlertIds,
      resetDemo,
    }),
    [
      exceptionQueue,
      evidenceCases,
      activityFeed,
      pendingAlerts,
      autoResolvedToday,
      lastEvidenceId,
      recordDecision,
      resolveAlert,
      resolvedAlertIds,
      resetDemo,
    ]
  )

  return (
    <WorkbenchContext.Provider value={value}>{children}</WorkbenchContext.Provider>
  )
}

export function useWorkbench() {
  const ctx = useContext(WorkbenchContext)
  if (!ctx) {
    throw new Error("useWorkbench must be used within WorkbenchProvider")
  }
  return ctx
}
