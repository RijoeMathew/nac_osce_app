import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ScoreResult } from "@/lib/types";

type ScoreBreakdownProps = {
  score: ScoreResult;
};

const rows = [
  ["History", "historyScore"],
  ["Communication", "communicationScore"],
  ["Clinical reasoning", "clinicalReasoningScore"],
  ["Management", "managementScore"]
] as const;

export function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-clinical-line bg-white p-6 shadow-panel">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Overall score</p>
            <p className="mt-2 text-6xl font-semibold text-clinical-navy">{score.overallScore}%</p>
          </div>
          <CheckCircle2 size={38} className="text-clinical-teal" aria-hidden="true" />
        </div>
        <div className="mt-6 space-y-4">
          {rows.map(([label, key]) => (
            <div key={key}>
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>{label}</span>
                <span>{score[key]}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-clinical-teal" style={{ width: `${score[key]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-clinical-line bg-white p-6 shadow-panel">
        <h2 className="flex items-center gap-2 font-semibold text-clinical-navy">
          <AlertTriangle size={18} className="text-amber-600" aria-hidden="true" />
          Missed red flags
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {score.missedRedFlags.length ? (
            score.missedRedFlags.map((item) => <li key={item}>• {item}</li>)
          ) : (
            <li>No major red flags missed in this mock score.</li>
          )}
        </ul>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <FeedbackList title="Strengths" items={score.strengths} />
        <FeedbackList title="Weaknesses" items={score.weaknesses} />
        <FeedbackList title="Tips" items={score.improvementTips} />
      </section>
    </div>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
      <h3 className="font-semibold text-clinical-navy">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
