import Link from "next/link";
import { ArrowRight, ClipboardCheck, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CaseCard } from "@/components/CaseCard";
import { sampleCases } from "@/lib/cases";

export default function LandingPage() {
  return (
    <AppShell>
      <section className="border-b border-clinical-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_28rem] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">AI OSCE practice</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-clinical-navy">
              NAC OSCE Helper
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Practice original Canada-style clinical stations with an AI patient, timed encounters, transcripts,
              examiner scoring, and progress tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-clinical-blue px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open dashboard
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 rounded-md border border-clinical-line bg-white px-5 py-3 text-sm font-semibold text-clinical-navy hover:bg-slate-50"
              >
                Browse cases
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-clinical-line bg-[#f8fbfc] p-5 shadow-panel">
            <div className="rounded-lg bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Live station</p>
                  <p className="mt-1 text-4xl font-semibold text-clinical-navy">10:42</p>
                </div>
                <span className="rounded-md bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">Encounter</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: Sparkles, label: "AI patient" },
                  { icon: ClipboardCheck, label: "AI examiner" },
                  { icon: Mic, label: "Speech input" },
                  { icon: ShieldCheck, label: "Original cases" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-md border border-clinical-line p-4">
                      <Icon size={22} className="text-clinical-teal" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold text-clinical-navy">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Case library</p>
            <h2 className="mt-2 text-3xl font-semibold text-clinical-navy">Start with a core station</h2>
          </div>
          <Link href="/cases" className="text-sm font-semibold text-clinical-blue hover:text-blue-700">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sampleCases.slice(0, 3).map((osceCase) => (
            <CaseCard key={osceCase.id} osceCase={osceCase} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
