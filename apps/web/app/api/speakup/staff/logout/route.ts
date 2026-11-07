import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { destroyStaffSession, STAFF_COOKIE } from "@/lib/speakup/store"

export async function POST() {
  const jar = await cookies()
  destroyStaffSession(jar.get(STAFF_COOKIE)?.value)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(STAFF_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}
