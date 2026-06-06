import { AppShell } from "@/components/AppShell";

const domainScores = [
  ["History", 76],
  ["Communication", 82],
  ["Clinical reasoning", 68],
  ["Management", 71]
];

const recentSessions = [
  ["Chest Pain", "78%", "Risk factors"],
  ["Depression", "71%", "Safety assessment"],
  ["Pediatric Fever", "84%", "Counselling"],
  ["Abdominal Pain", "69%", "Pregnancy screening"]
];

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Progress</p>
          <h1 className="mt-2 text-3xl font-semibold text-clinical-navy">Performance trends</h1>
        </div>
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <div className="rounded-lg border border-clinical-line bg-white p-6 shadow-panel">
            <h2 className="font-semibold text-clinical-navy">Domain scores</h2>
            <div className="mt-6 space-y-5">
              {domainScores.map(([label, value]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-clinical-teal" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-lg border border-clinical-line bg-white p-6 shadow-panel">
            <h2 className="font-semibold text-clinical-navy">Recent sessions</h2>
            <div className="mt-4 space-y-3">
              {recentSessions.map(([title, score, focus]) => (
                <div key={title} className="rounded-md border border-clinical-line p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-clinical-navy">{title}</p>
                    <span className="text-sm font-semibold text-clinical-teal">{score}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{focus}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
