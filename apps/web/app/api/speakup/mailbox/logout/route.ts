import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import {
  destroyMailboxSession,
  MAILBOX_COOKIE,
} from "@/lib/speakup/store"

export async function POST() {
  const jar = await cookies()
  destroyMailboxSession(jar.get(MAILBOX_COOKIE)?.value)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(MAILBOX_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}
