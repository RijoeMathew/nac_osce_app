import type { OsceCase, ScoreResult, TranscriptMessage } from "@/lib/types";

const domainKeywordMap = {
  history: ["onset", "duration", "past", "medication", "allerg", "family", "social", "associated"],
  communication: ["understand", "worry", "sorry", "support", "privacy", "confidential", "feel"],
  "clinical-reasoning": ["red flag", "diagnosis", "differential", "serious", "risk", "urgent"],
  management: ["plan", "test", "follow", "refer", "hospital", "treatment", "safety", "next"]
};

export function createMockPatientResponse(osceCase: OsceCase, candidateMessage: string) {
  const normalized = candidateMessage.toLowerCase();
  const matchingFact =
    osceCase.hiddenFacts.facts.find((fact) =>
      fact
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 4)
        .some((word) => normalized.includes(word))
    ) ?? osceCase.hiddenFacts.presentingConcern;

  if (normalized.includes("how are you") || normalized.includes("tell me")) {
    return osceCase.openingPrompt;
  }

  if (normalized.includes("worried") || normalized.includes("concern")) {
    return osceCase.hiddenFacts.patientQuestions[0] ?? "I am worried this could be serious.";
  }

  if (normalized.includes("pain") || normalized.includes("symptom") || normalized.includes("feel")) {
    return `It is mainly ${matchingFact.toLowerCase()}.`;
  }

  if (normalized.includes("thank")) {
    return "Okay. I appreciate you explaining that.";
  }

  return osceCase.emotionalState === "angry"
    ? "I do not feel like anyone is listening. Can you be more specific?"
    : "I can answer that, but I am not sure what detail you need.";
}

export function createMockScore(osceCase: OsceCase, transcript: TranscriptMessage[]): ScoreResult {
  const candidateText = transcript
    .filter((message) => message.role === "candidate")
    .map((message) => message.content.toLowerCase())
    .join(" ");

  const domainScores = Object.fromEntries(
    Object.entries(domainKeywordMap).map(([domain, keywords]) => {
      const hits = keywords.filter((keyword) => candidateText.includes(keyword)).length;
      return [domain, Math.min(100, Math.round((hits / Math.max(3, keywords.length)) * 100))];
    })
  ) as Record<keyof typeof domainKeywordMap, number>;

  const missedRedFlags = osceCase.hiddenFacts.redFlags.filter((redFlag) => {
    const searchable = redFlag.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
    return !searchable.some((word) => candidateText.includes(word));
  });

  const overallScore = Math.round(
    domainScores.history * 0.3 +
      domainScores.communication * 0.25 +
      domainScores["clinical-reasoning"] * 0.25 +
      domainScores.management * 0.2
  );

  return {
    overallScore,
    historyScore: domainScores.history,
    communicationScore: domainScores.communication,
    clinicalReasoningScore: domainScores["clinical-reasoning"],
    managementScore: domainScores.management,
    missedRedFlags,
    missedQuestions: osceCase.hiddenFacts.redFlags.map((item) => `Explore: ${item}`),
    strengths:
      overallScore >= 70
        ? ["Maintained station structure", "Covered several relevant clinical priorities"]
        : ["Established the presenting concern", "Used the encounter to gather some relevant details"],
    weaknesses:
      missedRedFlags.length > 0
        ? ["Important red flags were not fully explored", "Management plan needs clearer escalation steps"]
        : ["Could make the closing summary more explicit"],
    improvementTips: [
      "Use a consistent opening structure: concern, history, risk factors, impact, and safety.",
      "Name red flags out loud before moving to counselling or management.",
      "Close with a brief summary, immediate plan, and safety-net advice."
    ],
    suggestedNextCaseIds: osceCase.suggestedNextCaseIds
  };
}
