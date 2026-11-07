"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

import { FileDrop, type UploadedFile } from "@/components/speakup/file-drop"
import { PublicShell } from "@/components/speakup/public-shell"

type Message = {
  id: string
  from: "reporter" | "team"
  body: string
  createdAt: string
  attachments: { name: string; size: number; type: string }[]
}

export function MailboxThread() {
  const router = useRouter()
  const [trackingCode, setTrackingCode] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const res = await fetch("/api/speakup/mailbox/thread")
    if (res.status === 401) {
      router.replace("/buzon")
      return
    }
    if (!res.ok) throw new Error("thread")
    const json = (await res.json()) as {
      trackingCode: string
      messages: Message[]
    }
    setTrackingCode(json.trackingCode)
    setMessages(json.messages)
  }

  useEffect(() => {
    load().catch(() => setError("No pudimos cargar la conversación."))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function send() {
    if (!reply.trim() && files.length === 0) {
      setError("Escribe una respuesta o adjunta un archivo.")
      return
    }
    setSending(true)
    setError(null)
    const res = await fetch("/api/speakup/mailbox/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply, attachments: files }),
    })
    if (res.status === 401) {
      router.replace("/buzon")
      return
    }
    const json = (await res.json()) as { error?: string; messages?: Message[] }
    if (!res.ok) {
      setError(json.error || "No se pudo enviar.")
      setSending(false)
      return
    }
    setMessages(json.messages ?? [])
    setReply("")
    setFiles([])
    setSending(false)
  }

  async function logout() {
    await fetch("/api/speakup/mailbox/logout", { method: "POST" })
    router.replace("/")
  }

  return (
    <PublicShell showTeamLink={false}>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold">
              Conversación
            </h1>
            {trackingCode ? (
              <p className="text-sm text-muted-foreground">
                Código {trackingCode} · la clave no aparece aquí
              </p>
            ) : null}
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="max-h-[28rem] space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <article
                key={m.id}
                className={cn(
                  "max-w-[90%] rounded-lg px-3 py-2 text-sm",
                  m.from === "team"
                    ? "bg-muted"
                    : "ml-auto bg-primary text-primary-foreground"
                )}
              >
                <p className="text-[11px] uppercase tracking-wide opacity-70">
                  {m.from === "team" ? "Equipo autorizado" : "Tú"}
                </p>
                {m.body ? (
                  <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                ) : null}
                {m.attachments.length > 0 ? (
                  <ul className="mt-1 text-xs opacity-90">
                    {m.attachments.map((a) => (
                      <li key={a.name}>{a.name}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
          <div className="space-y-3 border-t p-4">
            <Textarea
              rows={4}
              placeholder="Escribe al equipo. Puedes adjuntar un archivo nuevo."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <FileDrop files={files} onChange={setFiles} />
            {error ? (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end">
              <Button onClick={send} disabled={sending}>
                {sending ? "Enviando…" : "Enviar respuesta"}
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Recarga la página: la conversación se conserva.
        </p>
      </div>
    </PublicShell>
  )
}
