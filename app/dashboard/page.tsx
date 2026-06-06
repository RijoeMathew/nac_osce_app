import Link from "next/link";
import { Activity, Clock, LineChart, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CaseCard } from "@/components/CaseCard";
import { StatCard } from "@/components/StatCard";
import { sampleCases } from "@/lib/cases";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-clinical-navy">Practice overview</h1>
          </div>
          <Link
            href="/simulation/chest-pain"
            className="rounded-md bg-clinical-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start next station
          </Link>
        </div>
        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Sessions" value="12" detail="Mock local data" icon={Activity} />
          <StatCard label="Average score" value="74%" detail="Last five stations" icon={LineChart} />
          <StatCard label="Practice time" value="3.6h" detail="Timed mode total" icon={Clock} />
          <StatCard label="Focus" value="Safety" detail="Red flag coverage" icon={Target} />
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-clinical-navy">Recommended stations</h2>
              <Link href="/cases" className="text-sm font-semibold text-clinical-blue hover:text-blue-700">
                Case library
              </Link>
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {sampleCases.slice(0, 4).map((osceCase) => (
                <CaseCard key={osceCase.id} osceCase={osceCase} />
              ))}
            </div>
          </div>
          <aside className="rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
            <h2 className="text-xl font-semibold text-clinical-navy">Recent feedback</h2>
            <div className="mt-4 space-y-4">
              {[
                ["Chest Pain", "Clarify cardiac risk factors earlier", "78%"],
                ["Depression", "Make safety assessment more explicit", "71%"],
                ["Pediatric Fever", "Strong caregiver counselling", "84%"]
              ].map(([title, note, score]) => (
                <div key={title} className="rounded-md border border-clinical-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-clinical-navy">{title}</p>
                    <span className="text-sm font-semibold text-clinical-teal">{score}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
