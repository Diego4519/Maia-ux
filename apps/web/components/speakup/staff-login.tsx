"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

const DEMOS = [
  { email: "ana@maia.demo", role: "Receptor" },
  { email: "carlos@maia.demo", role: "Investigador" },
  { email: "lucia@maia.demo", role: "Administrador" },
]

export function StaffLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("ana@maia.demo")
  const [password, setPassword] = useState("maia-demo")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const res = await fetch("/api/speakup/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const json = (await res.json()) as { error?: string }
    if (!res.ok) {
      setError(json.error || "No pudimos iniciar sesión.")
      setSubmitting(false)
      return
    }
    router.push("/bandeja")
    router.refresh()
  }

  return (
    <PublicShell showTeamLink={false}>
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Acceso del equipo</CardTitle>
            <CardDescription>
              Cuentas de demostración por rol. La bandeja muestra solo lo que el
              servidor autoriza para esa persona. No hay selector de rol en
              pantalla.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <label className="block text-sm font-medium">
                Correo
                <Input
                  className="mt-1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium">
                Contraseña
                <Input
                  className="mt-1"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Entrando…" : "Entrar"}
              </Button>
            </form>
            <ul className="mt-5 space-y-1 text-xs text-muted-foreground">
              {DEMOS.map((d) => (
                <li key={d.email}>
                  <button
                    type="button"
                    className="underline-offset-2 hover:underline"
                    onClick={() => {
                      setEmail(d.email)
                      setPassword("maia-demo")
                    }}
                  >
                    {d.role}: {d.email}
                  </button>
                  {" · "}
                  maia-demo
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              <Link href="/" className="underline-offset-2 hover:underline">
                Volver al canal público
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  )
}
