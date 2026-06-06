import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { OsceCase } from "@/lib/types";

export function CaseCard({ osceCase }: { osceCase: OsceCase }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-clinical-teal">{osceCase.difficulty}</p>
          <h3 className="mt-2 text-xl font-semibold text-clinical-navy">{osceCase.title}</h3>
        </div>
        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-clinical-blue">
          {osceCase.stationType}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin size={16} aria-hidden="true" />
          {osceCase.setting}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} aria-hidden="true" />
          2 min reading · 11 min encounter
        </p>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{osceCase.candidateInstructions}</p>
      <Link
        href={`/simulation/${osceCase.id}`}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-clinical-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Start station
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
