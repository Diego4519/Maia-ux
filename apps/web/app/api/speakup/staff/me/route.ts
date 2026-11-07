import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { getStaffSession, STAFF_COOKIE } from "@/lib/speakup/store"

export async function GET() {
  const jar = await cookies()
  const user = getStaffSession(jar.get(STAFF_COOKIE)?.value)
  if (!user) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }
  return NextResponse.json({
    user: {
      name: user.name,
      role: user.roleLabel,
      email: user.email,
    },
  })
}
