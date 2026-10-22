import { NextResponse } from "next/server"

import { searchScreening } from "@/lib/screening-service"
import { ApiError, apiErrorMessages } from "@/lib/api/errors"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim() ?? ""

  if (!q) {
    return NextResponse.json(
      { error: apiErrorMessages.bad_request, code: "bad_request" },
      { status: 400 }
    )
  }

  try {
    const result = await searchScreening(q)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status }
      )
    }
    return NextResponse.json(
      { error: apiErrorMessages.upstream_error, code: "upstream_error" },
      { status: 500 }
    )
  }
}
