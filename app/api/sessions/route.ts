import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { caseId?: string };

  // Placeholder: create a Supabase practice_sessions row after auth is connected.
  return NextResponse.json({
    sessionId: `mock-${body.caseId ?? "case"}-${Date.now()}`,
    provider: "mock"
  });
}
