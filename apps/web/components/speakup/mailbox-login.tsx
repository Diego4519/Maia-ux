"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

import { PublicShell } from "@/components/speakup/public-shell"

export function MailboxLoginForm() {
  const router = useRouter()
  const [trackingCode, setTrackingCode] = useState("")
  const [secret, setSecret] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/speakup/mailbox/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode, secret }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(
          json.error ||
            "No pudimos abrir el buzón. Revisa el código y la clave e inténtalo de nuevo."
        )
        setSubmitting(false)
        return
      }
      router.push("/speakup/inbox")
      router.refresh()
    } catch {
      setError(
        "No pudimos abrir el buzón. Revisa el código y la clave e inténtalo de nuevo."
      )
      setSubmitting(false)
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Consultar y responder</CardTitle>
            <CardDescription>
              Ingresa el código y la clave que recibiste al enviar. Un código
              sin clave no abre el buzón.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <label className="block text-sm font-medium">
                Código de seguimiento
                <Input
                  className="mt-1"
                  autoComplete="off"
                  placeholder="SU-XXXX-XXXX"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium">
                Clave secreta
                <Input
                  className="mt-1"
                  type="password"
                  autoComplete="off"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  required
                />
              </label>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Verificando…" : "Abrir buzón"}
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              Si te equivocas varias veces, el acceso se bloquea un rato. Los
              mensajes no confirman si el código existe.
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  )
}
