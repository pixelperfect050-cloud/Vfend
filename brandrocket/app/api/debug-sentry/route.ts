import { NextResponse } from "next/server"

// A faulty API route to test Sentry's error monitoring
export function GET() {
  throw new Error("Sentry Debug Test Error")
  return NextResponse.json({ message: "This should never be reached" })
}
