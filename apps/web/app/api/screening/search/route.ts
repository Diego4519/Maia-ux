import { NextResponse } from "next/server"

import { searchScreening } from "@/lib/screening-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim() ?? ""

  if (!q) {
    return NextResponse.json(
      { error: "Parámetro q requerido" },
      { status: 400 }
    )
  }

  const result = await searchScreening(q)
  return NextResponse.json(result)
}
