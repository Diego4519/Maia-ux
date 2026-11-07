"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

import { saveOneTimeSecret } from "@/lib/speakup/credentials-session"
import { useMaiaToast } from "@/components/maia/maia-toast"
import { FileDrop, type UploadedFile } from "@/components/speakup/file-drop"
import { PublicShell } from "@/components/speakup/public-shell"

type Mode = "anonymous" | "confidential"

const STEPS = ["Modalidad", "Hechos", "Revisión y envío"]

const CATEGORIES = [
  { value: "acoso", label: "Acoso o discriminación" },
  { value: "fraude", label: "Fraude o soborno" },
  { value: "represalia", label: "Represalia" },
  { value: "seguridad", label: "Seguridad e higiene" },
  { value: "otro", label: "Otro incumplimiento" },
  { value: "no-estoy-seguro", label: "No estoy seguro" },
]

export function ReporterWizard() {
  const router = useRouter()
  const { toast } = useMaiaToast()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const sendingRef = useRef(false)
  const [mode, setMode] = useState<Mode>("anonymous")
  const [what, setWhat] = useState("")
  const [when, setWhen] = useState("")
  const [where, setWhere] = useState("")
  const [people, setPeople] = useState("")
  const [category, setCategory] = useState("")
  const [email, setEmail] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])

  const whatError = useMemo(() => {
    if (!touched) return undefined
    if (!what.trim()) return "Cuéntanos qué ocurrió, aunque sea en pocas palabras."
    return undefined
  }, [touched, what])

  function next() {
    if (step === 1) {
      setTouched(true)
      if (!what.trim()) return
    }
    setStep((s) => Math.min(s + 1, 2))
  }

  async function submit() {
    if (!what.trim()) {
      setTouched(true)
      setStep(1)
      return
    }
    if (sendingRef.current) return
    sendingRef.current = true
    setSubmitting(true)
    setSendError(null)
    try {
      const res = await fetch("/api/speakup/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          narrative: what,
          when: when || null,
          where: where || null,
          people: people || null,
          category: category || null,
          contactEmail: mode === "confidential" ? email || null : null,
          attachments: files,
        }),
      })
      if (!res.ok) throw new Error("fail")
      const json = (await res.json()) as { trackingCode: string; secret: string }
      saveOneTimeSecret(json.trackingCode, json.secret)
      router.push(`/speakup/confirm/${json.trackingCode}`)
    } catch {
      const msg =
        "No pudimos enviar tu reporte. Tu información sigue aquí. No se creó un duplicado."
      setSendError(msg)
      toast(msg, "error")
      sendingRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Nueva denuncia
        </p>
        <h1 className="font-heading mt-2 text-2xl font-semibold sm:text-3xl">
          Cuéntanos qué pasó. Nos encargamos del resto.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solo «qué ocurrió» es obligatorio. No hace falta categoría, archivo ni
          correo.
        </p>

        <div className="mt-6 mb-4 flex gap-2 text-xs">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={cn(
                "flex-1 rounded-md border px-2 py-1.5",
                i === step
                  ? "border-foreground/20 bg-muted font-medium"
                  : i < step
                    ? "text-muted-foreground"
                    : "text-muted-foreground/70"
              )}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {step === 0 && "¿Cómo quieres presentarlo?"}
              {step === 1 && "Describe los hechos"}
              {step === 2 && "Revisa antes de enviar"}
            </CardTitle>
            <CardDescription>
              {step === 0 &&
                "Anónimo o con identidad confidencial. Puedes cambiarlo antes de enviar."}
              {step === 1 &&
                "Lo único obligatorio es contarnos qué pasó. El resto es opcional."}
              {step === 2 &&
                "Esta es la información que recibirá el equipo autorizado."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode("anonymous")}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left",
                    mode === "anonymous" ? "border-foreground/30 bg-muted/40" : ""
                  )}
                >
                  <p className="font-medium">Anónimo</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nadie en la organización verá quién reportó. No pedimos
                    correo ni nombre. Vuelves al buzón con código y clave.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("confidential")}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left",
                    mode === "confidential"
                      ? "border-foreground/30 bg-muted/40"
                      : ""
                  )}
                >
                  <p className="font-medium">Con identidad confidencial</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Solo personas autorizadas, bajo auditoría. Puedes dejar un
                    correo. Cada consulta de tu identidad queda registrada.
                  </p>
                </button>
                <p className="text-xs text-muted-foreground">
                  No prometemos anonimato absoluto: hechos muy específicos
                  pueden hacer reconocible a quien reporta.
                </p>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <label className="block text-sm font-medium">
                  ¿Qué ocurrió?
                  <Textarea
                    className="mt-1 min-h-28"
                    value={what}
                    onChange={(e) => setWhat(e.target.value)}
                    placeholder="En tus palabras. Si no estás seguro de un detalle, dilo así."
                  />
                </label>
                {whatError ? (
                  <p className="text-xs text-destructive" role="alert">
                    {whatError}
                  </p>
                ) : null}
                <label className="block text-sm font-medium">
                  ¿Cuándo pasó?{" "}
                  <span className="font-normal text-muted-foreground">
                    (opcional)
                  </span>
                  <Input
                    className="mt-1"
                    type="date"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium">
                  ¿Dónde pasó?{" "}
                  <span className="font-normal text-muted-foreground">
                    (opcional)
                  </span>
                  <Input
                    className="mt-1"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    placeholder="Oficina, sede, canal online…"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Personas involucradas{" "}
                  <span className="font-normal text-muted-foreground">
                    (opcional)
                  </span>
                  <Textarea
                    className="mt-1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    placeholder="Nombres o cargos."
                  />
                </label>
                <label className="block text-sm font-medium">
                  Categoría{" "}
                  <span className="font-normal text-muted-foreground">
                    (opcional)
                  </span>
                  <select
                    className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Selecciona una (o déjalo en blanco)</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
                {mode === "confidential" ? (
                  <label className="block text-sm font-medium">
                    Correo de contacto{" "}
                    <span className="font-normal text-muted-foreground">
                      (opcional)
                    </span>
                    <Input
                      className="mt-1"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                ) : null}
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div>
                  <p className="mb-1 text-sm font-medium">
                    Adjuntos{" "}
                    <span className="font-normal text-muted-foreground">
                      (opcional)
                    </span>
                  </p>
                  <FileDrop files={files} onChange={setFiles} />
                </div>
                <dl className="space-y-2 text-sm">
                  <Row
                    label="Modalidad"
                    value={
                      mode === "anonymous"
                        ? "Anónimo"
                        : "Con identidad confidencial"
                    }
                  />
                  <Row label="Qué ocurrió" value={what || "—"} />
                  <Row
                    label="Cuándo / dónde"
                    value={`${when || "Sin fecha"} · ${where || "Sin lugar"}`}
                  />
                  <Row label="Personas" value={people || "—"} />
                  <Row
                    label="Categoría"
                    value={
                      CATEGORIES.find((c) => c.value === category)?.label ||
                      "No especificada"
                    }
                  />
                  <Row
                    label="Adjuntos"
                    value={
                      files.length
                        ? files.map((f) => f.name).join(", ")
                        : "Ninguno"
                    }
                  />
                </dl>
              </>
            ) : null}

            <p className="text-xs text-muted-foreground">
              Aunque elijas Anónimo, el texto o los archivos podrían contener
              datos que te identifiquen.
            </p>
            {sendError ? (
              <div className="space-y-2" role="alert">
                <p className="text-sm text-destructive">{sendError}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={submit}
                  disabled={submitting}
                >
                  Reintentar
                </Button>
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0 || submitting}
              onClick={() => setStep((s) => s - 1)}
            >
              Atrás
            </Button>
            {step < 2 ? (
              <Button type="button" onClick={next}>
                Continuar
              </Button>
            ) : (
              <Button type="button" onClick={submit} disabled={submitting}>
                {submitting ? "Enviando…" : sendError ? "Reintentar envío" : "Enviar reporte"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </PublicShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 whitespace-pre-wrap">{value}</dd>
    </div>
  )
}
