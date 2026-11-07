import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import {
  getStaffSession,
  listInboxFor,
  STAFF_COOKIE,
} from "@/lib/speakup/store"
import {
  ownerName,
  phaseLabel,
  statusLabel,
  urgencyLabel,
} from "@/lib/speakup/staff"

export async function GET(req: NextRequest) {
  const jar = await cookies()
  const user = getStaffSession(jar.get(STAFF_COOKIE)?.value)
  if (!user) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }

  const view = new URL(req.url).searchParams.get("view")
  const data = listInboxFor(user)

  if (view === "cases") {
    return NextResponse.json({
      user: { name: user.name, role: user.roleLabel },
      rows: data.cases.map((c) => ({
        referencia: c.id,
        fecha: c.createdAt,
        estado: phaseLabel(c.phase),
        categoria: c.category,
        responsable: ownerName(c.ownerId),
        urgencia: urgencyLabel(c.urgency),
        vencimiento: c.dueAt,
        titulo: c.title,
      })),
    })
  }

  return NextResponse.json({
    user: { name: user.name, role: user.roleLabel },
    rows: data.reports.map((r) => ({
      referencia: r.trackingCode,
      fecha: r.createdAt,
      estado: statusLabel(r.status),
      categoria: r.category,
      responsable: ownerName(r.ownerId),
      urgencia: urgencyLabel(r.urgency),
      vencimiento: r.dueAt,
    })),
  })
}
