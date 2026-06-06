import { NextResponse } from "next/server";
import { getCaseById } from "@/lib/cases";
import { askGeminiPatient } from "@/lib/gemini";
import { createMockPatientResponse } from "@/lib/scoring";
import type { TranscriptMessage } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    caseId?: string;
    transcript?: TranscriptMessage[];
  };

  if (!body.caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  const osceCase = getCaseById(body.caseId);
  if (!osceCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const transcript = body.transcript ?? [];
  const geminiResponse = await askGeminiPatient(osceCase, transcript);
  const fallbackResponse = createMockPatientResponse(
    osceCase,
    transcript.filter((message) => message.role === "candidate").at(-1)?.content ?? ""
  );

  return NextResponse.json({
    response: geminiResponse ?? fallbackResponse,
    provider: geminiResponse ? "gemini" : "mock"
  });
}
