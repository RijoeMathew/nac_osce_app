import { NextResponse } from "next/server";
import { getCaseById } from "@/lib/cases";
import { askGeminiExaminer } from "@/lib/gemini";
import { createMockScore } from "@/lib/scoring";
import type { ScoreResult, TranscriptMessage } from "@/lib/types";

function tryParseGeminiScore(text: string | null, fallback: ScoreResult) {
  if (!text) {
    return fallback;
  }

  try {
    return JSON.parse(text) as ScoreResult;
  } catch {
    return fallback;
  }
}

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
  const fallback = createMockScore(osceCase, transcript);
  const geminiScoreText = await askGeminiExaminer(osceCase, transcript);

  return NextResponse.json({
    score: tryParseGeminiScore(geminiScoreText, fallback),
    provider: geminiScoreText ? "gemini" : "mock"
  });
}
