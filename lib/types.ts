export type EmotionalState = "anxious" | "angry" | "sad" | "confused" | "calm";

export type StationDomain =
  | "history"
  | "communication"
  | "clinical-reasoning"
  | "management";

export type CaseChecklistItem = {
  id: string;
  label: string;
  domain: StationDomain;
  weight: number;
};

export type HiddenCaseFacts = {
  presentingConcern: string;
  facts: string[];
  redFlags: string[];
  patientQuestions: string[];
  disclosureRules: string[];
};

export type OsceCase = {
  id: string;
  title: string;
  stationType: string;
  setting: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  patientName: string;
  patientAge: number;
  emotionalState: EmotionalState;
  openingPrompt: string;
  candidateInstructions: string;
  visibleInfo: string[];
  hiddenFacts: HiddenCaseFacts;
  checklist: CaseChecklistItem[];
  suggestedNextCaseIds: string[];
};

export type TranscriptMessage = {
  id: string;
  role: "candidate" | "patient" | "system";
  content: string;
  createdAt: string;
};

export type SessionPhase = "reading" | "encounter" | "ended";

export type ScoreResult = {
  overallScore: number;
  historyScore: number;
  communicationScore: number;
  clinicalReasoningScore: number;
  managementScore: number;
  missedRedFlags: string[];
  missedQuestions: string[];
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
  suggestedNextCaseIds: string[];
};
