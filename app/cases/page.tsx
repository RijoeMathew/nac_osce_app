import { AppShell } from "@/components/AppShell";
import { CaseCard } from "@/components/CaseCard";
import { sampleCases } from "@/lib/cases";

export default function CasesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Case library</p>
          <h1 className="mt-2 text-3xl font-semibold text-clinical-navy">Original NAC-style stations</h1>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sampleCases.map((osceCase) => (
            <CaseCard key={osceCase.id} osceCase={osceCase} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
