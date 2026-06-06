"use client";

import { Bot, UserRoundCheck } from "lucide-react";
import type { EmotionalState } from "@/lib/types";

type AvatarPanelProps = {
  label: string;
  role: "patient" | "examiner";
  state?: EmotionalState;
  speaking?: boolean;
};

const stateColor: Record<EmotionalState, string> = {
  anxious: "bg-amber-100 text-amber-700",
  angry: "bg-red-100 text-red-700",
  sad: "bg-indigo-100 text-indigo-700",
  confused: "bg-fuchsia-100 text-fuchsia-700",
  calm: "bg-emerald-100 text-emerald-700"
};

export function AvatarPanel({ label, role, state = "calm", speaking = false }: AvatarPanelProps) {
  const Icon = role === "patient" ? Bot : UserRoundCheck;

  return (
    <div className="rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{role === "patient" ? "Patient" : "Examiner"}</p>
          <h3 className="text-lg font-semibold text-clinical-navy">{label}</h3>
        </div>
        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${stateColor[state]}`}>{state}</span>
      </div>
      <div className="mt-5 flex min-h-56 items-center justify-center rounded-lg border border-dashed border-clinical-line bg-gradient-to-b from-white to-clinical-mist">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-panel">
          <Icon size={64} className="text-clinical-teal" aria-hidden="true" />
          <span
            className={`absolute bottom-8 h-3 rounded-full bg-clinical-navy transition-all ${
              speaking ? "w-12 animate-pulse" : "w-7"
            }`}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {/* Placeholder: replace with Ready Player Me iframe or SDK avatar once configured. */}
        Avatar placeholder
      </p>
    </div>
  );
}
