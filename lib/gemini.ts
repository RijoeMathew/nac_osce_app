import { GoogleGenerativeAI } from "@google/generative-ai";
import type { OsceCase, TranscriptMessage } from "@/lib/types";

export async function askGeminiPatient(osceCase: OsceCase, transcript: TranscriptMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  // Placeholder: refine this prompt and add guardrail logging before production use.
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" });
  const lastCandidateMessage = transcript.filter((message) => message.role === "candidate").at(-1)?.content ?? "";

  const prompt = `
You are an AI patient simulator for an original Canada-style OSCE practice case.
Stay strictly within these hidden facts and disclosure rules.
Be realistic, concise, and do not reveal symptoms unless asked.

Case: ${osceCase.title}
Patient emotional state: ${osceCase.emotionalState}
Hidden facts: ${JSON.stringify(osceCase.hiddenFacts, null, 2)}
Candidate just said: ${lastCandidateMessage}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function askGeminiExaminer(osceCase: OsceCase, transcript: TranscriptMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  // Placeholder: replace with JSON schema response validation for production scoring.
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `
You are an OSCE examiner. Score the transcript using this checklist and return concise JSON.

Checklist: ${JSON.stringify(osceCase.checklist, null, 2)}
Hidden red flags: ${JSON.stringify(osceCase.hiddenFacts.redFlags, null, 2)}
Transcript: ${JSON.stringify(transcript, null, 2)}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
