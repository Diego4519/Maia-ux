import { NextResponse } from "next/server"

import { pingMongo } from "@/lib/screening-service"

export async function GET() {
  try {
    const status = await pingMongo()
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo conectar a MongoDB",
      },
      { status: 500 }
    )
  }
}
