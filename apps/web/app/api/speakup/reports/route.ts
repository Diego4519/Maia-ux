import { NextRequest, NextResponse } from "next/server"

import { createPublicReport } from "@/lib/speakup/store"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  await new Promise((r) => setTimeout(r, 500))

  if (typeof body?.narrative === "string" && body.narrative.includes("FAIL")) {
    return NextResponse.json(
      { error: "No se pudo guardar el reporte (simulado)" },
      { status: 500 }
    )
  }

  const narrative =
    typeof body?.narrative === "string" ? body.narrative.trim() : ""
  if (!narrative) {
    return NextResponse.json(
      { error: "Cuéntanos qué ocurrió para poder enviar el reporte." },
      { status: 400 }
    )
  }

  const created = createPublicReport({
    mode: typeof body?.mode === "string" ? body.mode : "anonymous",
    narrative,
    category: typeof body?.category === "string" ? body.category : null,
    attachments: Array.isArray(body?.attachments) ? body.attachments : [],
  })

  return NextResponse.json({
    trackingCode: created.trackingCode,
    secret: created.secret,
    receivedAt: created.createdAt,
    status: "received",
  })
}
