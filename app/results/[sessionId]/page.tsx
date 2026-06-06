import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { getCaseById, sampleCases } from "@/lib/cases";
import { createMockScore } from "@/lib/scoring";
import type { TranscriptMessage } from "@/lib/types";

const mockTranscript: TranscriptMessage[] = [
  {
    id: "candidate-1",
    role: "candidate",
    content: "I would like to ask about onset, duration, associated symptoms, past history, risk factors, and safety concerns.",
    createdAt: new Date().toISOString()
  },
  {
    id: "candidate-2",
    role: "candidate",
    content: "My plan is urgent tests, follow-up, and hospital assessment if serious red flags are present.",
    createdAt: new Date().toISOString()
  }
];

export default function ResultsPage({
  searchParams
}: {
  params: { sessionId: string };
  searchParams: { case?: string };
}) {
  const osceCase = getCaseById(searchParams.case ?? "") ?? sampleCases[0];
  const score = createMockScore(osceCase, mockTranscript);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Feedback</p>
            <h1 className="mt-2 text-3xl font-semibold text-clinical-navy">{osceCase.title} results</h1>
          </div>
          <Link
            href={`/simulation/${osceCase.id}`}
            className="rounded-md bg-clinical-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Retry station
          </Link>
        </div>
        <div className="mt-6">
          <ScoreBreakdown score={score} />
        </div>
        <section className="mt-6 rounded-lg border border-clinical-line bg-white p-6 shadow-panel">
          <h2 className="font-semibold text-clinical-navy">Suggested next cases</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {score.suggestedNextCaseIds.map((caseId) => {
              const nextCase = getCaseById(caseId);
              return nextCase ? (
                <Link
                  key={caseId}
                  href={`/simulation/${caseId}`}
                  className="rounded-md border border-clinical-line px-3 py-2 text-sm font-semibold text-clinical-navy hover:bg-slate-50"
                >
                  {nextCase.title}
                </Link>
              ) : null;
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
