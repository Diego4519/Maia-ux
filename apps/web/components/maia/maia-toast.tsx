"use client"

import Link from "next/link"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { CheckCircle2, Info, X, XCircle } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

type ToastType = "success" | "error" | "info"

interface ToastAction {
  label: string
  href: string
}

interface Toast {
  id: string
  message: string
  type: ToastType
  action?: ToastAction
}

interface ToastOptions {
  action?: ToastAction
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, options?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useMaiaToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useMaiaToast must be used within MaiaToastProvider")
  return ctx
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const [exiting, setExiting] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || exiting) return
    const timer = setTimeout(() => setExiting(true), toast.action ? 5000 : 2800)
    const remove = setTimeout(() => onDismiss(toast.id), toast.action ? 5200 : 3000)
    return () => {
      clearTimeout(timer)
      clearTimeout(remove)
    }
  }, [toast.id, toast.action, onDismiss, paused, exiting])

  const Icon =
    toast.type === "success"
      ? CheckCircle2
      : toast.type === "error"
        ? XCircle
        : Info

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "rounded-xl border bg-card px-5 py-4 text-sm shadow-xl backdrop-blur-md maia-glass",
        exiting ? "maia-toast-out" : "maia-toast-in",
        toast.type === "success" && "border-emerald-200/60",
        toast.type === "error" && "border-red-200/60",
        toast.type === "info" && "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "mt-0.5 size-4 shrink-0",
            toast.type === "success" && "text-emerald-600 dark:text-emerald-400",
            toast.type === "error" && "text-red-600 dark:text-red-400",
            toast.type === "info" && "text-muted-foreground"
          )}
        />
        <div className="flex-1 space-y-2">
          <span className="text-base font-semibold leading-snug">{toast.message}</span>
          {toast.action ? (
            <Link
              href={toast.action.href}
              onClick={() => onDismiss(toast.id)}
              className="inline-block text-xs font-medium underline underline-offset-2"
            >
              {toast.action.label} →
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Cerrar notificación"
          className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export function MaiaToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = "success", options?: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      setToasts((prev) => [
        ...prev.slice(-2),
        { id, message, type, action: options?.action },
      ])
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[200] flex w-full max-w-md flex-col gap-3 max-sm:left-4 max-sm:right-4 max-sm:w-auto"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
