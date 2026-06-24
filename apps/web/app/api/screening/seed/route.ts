import { NextResponse } from "next/server"

import { seedScreeningSubjects } from "@/lib/screening-service"

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción" }, { status: 403 })
  }

  try {
    const result = await seedScreeningSubjects()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Error al sembrar datos",
      },
      { status: 500 }
    )
  }
}
