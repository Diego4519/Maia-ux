import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { appendMailboxReply, MAILBOX_COOKIE } from "@/lib/speakup/store"

export async function POST(req: NextRequest) {
  const jar = await cookies()
  const token = jar.get(MAILBOX_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const text = typeof body?.body === "string" ? body.body.trim() : ""
  const attachments = Array.isArray(body?.attachments) ? body.attachments : []

  if (!text && attachments.length === 0) {
    return NextResponse.json(
      { error: "Escribe una respuesta o adjunta un archivo." },
      { status: 400 }
    )
  }

  const result = appendMailboxReply({
    token,
    body: text,
    attachments: attachments.map(
      (a: { name?: string; size?: number; type?: string }) => ({
        name: String(a?.name ?? "archivo"),
        size: Number(a?.size ?? 0),
        type: String(a?.type ?? "application/octet-stream"),
      })
    ),
  })

  if (!result.ok) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }

  return NextResponse.json({ ok: true, messages: result.messages })
}
