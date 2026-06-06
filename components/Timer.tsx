"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import type { SessionPhase } from "@/lib/types";

type TimerProps = {
  phase: SessionPhase;
  secondsRemaining: number;
  isRunning: boolean;
  onToggle: () => void;
  onEnd: () => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function Timer({ phase, secondsRemaining, isRunning, onToggle, onEnd }: TimerProps) {
  const warning = phase === "encounter" && secondsRemaining <= 60 && secondsRemaining > 0;

  return (
    <section className={`rounded-lg border bg-white p-5 shadow-panel ${warning ? "timer-warning border-red-300" : "border-clinical-line"}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{phase}</p>
          <p className={`mt-2 text-6xl font-semibold ${warning ? "text-red-600" : "text-clinical-navy"}`}>
            {formatTime(secondsRemaining)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-clinical-line bg-white text-clinical-navy hover:bg-slate-50"
            aria-label={isRunning ? "Pause timer" : "Start timer"}
            title={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            type="button"
            onClick={onEnd}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
            aria-label="End station"
            title="End station"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>
      {warning ? <p className="mt-3 text-sm font-medium text-red-600">1 minute remaining</p> : null}
    </section>
  );
}
