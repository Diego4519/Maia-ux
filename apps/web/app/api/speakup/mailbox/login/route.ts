import { NextRequest, NextResponse } from "next/server"

import {
  attemptMailboxLogin,
  cookieOptions,
  GENERIC_LOGIN_ERROR,
  LOCKED_LOGIN_ERROR,
  MAILBOX_COOKIE,
} from "@/lib/speakup/store"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const trackingCode =
    typeof body?.trackingCode === "string" ? body.trackingCode : ""
  const secret = typeof body?.secret === "string" ? body.secret : ""

  if (!trackingCode || !secret) {
    return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 401 })
  }

  const result = await attemptMailboxLogin({ trackingCode, secret })
  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === "locked" ? LOCKED_LOGIN_ERROR : GENERIC_LOGIN_ERROR,
      },
      { status: 401 }
    )
  }

  const res = NextResponse.json({ ok: true, trackingCode: result.trackingCode })
  res.cookies.set(MAILBOX_COOKIE, result.token, cookieOptions())
  return res
}
