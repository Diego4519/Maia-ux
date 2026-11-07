import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { getMailboxSession, MAILBOX_COOKIE } from "@/lib/speakup/store"

export async function GET() {
  const jar = await cookies()
  const session = getMailboxSession(jar.get(MAILBOX_COOKIE)?.value)
  if (!session) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }
  return NextResponse.json({
    trackingCode: session.report.trackingCode,
    createdAt: session.report.createdAt,
    messages: session.report.messages,
  })
}
