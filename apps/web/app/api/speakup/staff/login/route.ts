import { NextRequest, NextResponse } from "next/server"

import {
  attemptStaffLogin,
  cookieOptions,
  STAFF_COOKIE,
  STAFF_LOGIN_ERROR,
} from "@/lib/speakup/store"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = typeof body?.email === "string" ? body.email : ""
  const password = typeof body?.password === "string" ? body.password : ""
  const result = await attemptStaffLogin(email, password)
  if (!result.ok) {
    return NextResponse.json({ error: STAFF_LOGIN_ERROR }, { status: 401 })
  }
  const res = NextResponse.json({
    ok: true,
    name: result.user.name,
    role: result.user.roleLabel,
  })
  res.cookies.set(STAFF_COOKIE, result.token, cookieOptions())
  return res
}
