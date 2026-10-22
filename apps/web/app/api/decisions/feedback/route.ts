import { NextResponse } from "next/server"

import {
  parseFeedbackRequest,
  sendDecisionFeedback,
} from "@/lib/decisions-service"
import { ApiError, apiErrorMessages } from "@/lib/api/errors"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const payload = parseFeedbackRequest(body)
    const result = await sendDecisionFeedback(payload)
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
