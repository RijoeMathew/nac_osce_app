"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SkipForward,
  Volume2
} from "lucide-react";

type TimerPhase = "prep" | "station" | "complete";
type WindowWithAudioFallback = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const PREP_SECONDS = 2 * 60;
const STATION_SECONDS = 11 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getPhaseLabel(phase: TimerPhase) {
  if (phase === "prep") {
    return "Move and read";
  }

  if (phase === "station") {
    return "Station";
  }

  return "Complete";
}

function getPhaseDuration(phase: TimerPhase) {
  return phase === "prep" ? PREP_SECONDS : STATION_SECONDS;
}

function playTone(pattern: Array<{ frequency: number; duration: number; gap?: number }>) {
  const AudioContextConstructor =
    window.AudioContext ?? (window as WindowWithAudioFallback).webkitAudioContext;
  if (!AudioContextConstructor) {
    return;
  }

  const context = new AudioContextConstructor();
  let offset = 0;

  pattern.forEach((item) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = item.frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + offset + item.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime + offset);
    oscillator.stop(context.currentTime + offset + item.duration);
    offset += item.duration + (item.gap ?? 0.08);
  });

  window.setTimeout(() => void context.close(), Math.ceil((offset + 0.2) * 1000));
}

function playAlarm(type: "enter" | "end" | "warning") {
  if (type === "enter") {
    playTone([
      { frequency: 740, duration: 0.32 },
      { frequency: 740, duration: 0.32 }
    ]);
    navigator.vibrate?.([180, 80, 180]);
    return;
  }

  if (type === "warning") {
    playTone([{ frequency: 620, duration: 0.22 }]);
    navigator.vibrate?.(120);
    return;
  }

  playTone([
    { frequency: 420, duration: 0.55, gap: 0.12 },
    { frequency: 420, duration: 0.55, gap: 0.12 },
    { frequency: 420, duration: 0.75 }
  ]);
  navigator.vibrate?.([260, 110, 260, 110, 360]);
}

export function NacOsceTimer() {
  const [phase, setPhase] = useState<TimerPhase>("prep");
  const [secondsRemaining, setSecondsRemaining] = useState(PREP_SECONDS);
  const [stationIndex, setStationIndex] = useState(1);
  const [stationCount, setStationCount] = useState(12);
  const [isRunning, setIsRunning] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [oneMinuteWarning, setOneMinuteWarning] = useState(true);
  const warningPlayedRef = useRef(false);

  const progress = useMemo(() => {
    if (phase === "complete") {
      return 100;
    }

    const duration = getPhaseDuration(phase);
    return Math.round(((duration - secondsRemaining) / duration) * 100);
  }, [phase, secondsRemaining]);

  const isWarning = phase === "station" && secondsRemaining <= 60 && secondsRemaining > 0;

  const moveToNextPhase = useCallback(() => {
    warningPlayedRef.current = false;

    if (phase === "prep") {
      setPhase("station");
      setSecondsRemaining(STATION_SECONDS);
      playAlarm("enter");
      return;
    }

    if (stationIndex >= stationCount) {
      setPhase("complete");
      setSecondsRemaining(0);
      setIsRunning(false);
      playAlarm("end");
      return;
    }

    setStationIndex((current) => current + 1);
    setPhase("prep");
    setSecondsRemaining(PREP_SECONDS);
    playAlarm("end");
  }, [phase, stationCount, stationIndex]);

  function resetTimer() {
    setPhase("prep");
    setSecondsRemaining(PREP_SECONDS);
    setStationIndex(1);
    setIsRunning(false);
    warningPlayedRef.current = false;
  }

  useEffect(() => {
    if (!isRunning || phase === "complete") {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (phase === "station" && oneMinuteWarning && current === 61 && !warningPlayedRef.current) {
          warningPlayedRef.current = true;
          playAlarm("warning");
        }

        if (current <= 1) {
          window.clearInterval(interval);

          if (autoAdvance) {
            window.setTimeout(moveToNextPhase, 0);
          } else {
            setIsRunning(false);
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [autoAdvance, isRunning, moveToNextPhase, oneMinuteWarning, phase]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7fafc] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3 py-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-clinical-teal">NAC OSCE timer</p>
            <h1 className="text-2xl font-semibold text-clinical-navy sm:text-3xl">Practice circuit</h1>
          </div>
          <button
            type="button"
            onClick={() => playAlarm("enter")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-clinical-line bg-white text-clinical-navy shadow-sm hover:bg-slate-50"
            aria-label="Test alarm"
            title="Test alarm"
          >
            <Volume2 size={19} />
          </button>
        </header>

        <section className="mt-4 flex w-full max-w-[calc(100vw-2rem)] min-w-0 flex-1 flex-col justify-center rounded-lg border border-clinical-line bg-white p-4 shadow-panel sm:max-w-full sm:p-6">
          <div className="grid gap-4 sm:flex sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Station {stationIndex} of {stationCount}
              </p>
              <p className="mt-2 inline-flex items-center gap-2 rounded-md bg-clinical-mist px-3 py-1 text-sm font-semibold text-clinical-navy">
                {phase === "complete" ? <CheckCircle2 size={16} /> : <Bell size={16} />}
                {getPhaseLabel(phase)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Official timing</p>
              <p className="mt-1 text-sm font-semibold text-clinical-navy">2:00 + 11:00</p>
            </div>
          </div>

          <div className="mt-8">
            <div
              className={`mx-auto flex aspect-square w-full max-w-[18rem] items-center justify-center rounded-full border-[10px] sm:max-w-[21rem] ${
                isWarning ? "timer-warning border-red-500 bg-red-50" : "border-clinical-teal bg-[#f9fefe]"
              }`}
            >
              <div className="text-center">
                <p className={`font-mono text-6xl font-semibold sm:text-7xl ${isWarning ? "text-red-700" : "text-clinical-navy"}`}>
                  {formatTime(secondsRemaining)}
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {phase === "complete" ? "Done" : isRunning ? "Running" : "Paused"}
                </p>
              </div>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${isWarning ? "bg-red-500" : "bg-clinical-teal"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setIsRunning((current) => !current)}
              disabled={phase === "complete"}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-clinical-blue px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={moveToNextPhase}
              disabled={phase === "complete"}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-md border border-clinical-line bg-white px-3 text-sm font-semibold text-clinical-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SkipForward size={18} />
              Next
            </button>
            <button
              type="button"
              onClick={resetTimer}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-md border border-clinical-line bg-white px-3 text-sm font-semibold text-clinical-navy hover:bg-slate-50"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </section>

        <section className="mt-4 w-full max-w-[calc(100vw-2rem)] min-w-0 rounded-lg border border-clinical-line bg-white p-4 shadow-panel sm:max-w-full sm:p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-clinical-navy">
            <Settings2 size={18} />
            Settings
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Stations</span>
              <input
                type="number"
                min={1}
                max={20}
                value={stationCount}
                onChange={(event) => {
                  const nextCount = Math.min(20, Math.max(1, Number(event.target.value) || 1));
                  setStationCount(nextCount);
                  setStationIndex((current) => Math.min(current, nextCount));
                }}
                className="mt-2 h-11 w-full rounded-md border border-clinical-line px-3 text-base outline-none focus:border-clinical-teal focus:ring-2 focus:ring-clinical-teal/20"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-md border border-clinical-line px-3 py-3">
              <span className="text-sm font-semibold text-slate-700">Auto next</span>
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(event) => setAutoAdvance(event.target.checked)}
                className="h-5 w-5 accent-clinical-teal"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-md border border-clinical-line px-3 py-3">
              <span className="text-sm font-semibold text-slate-700">1 min warning</span>
              <input
                type="checkbox"
                checked={oneMinuteWarning}
                onChange={(event) => setOneMinuteWarning(event.target.checked)}
                className="h-5 w-5 accent-clinical-teal"
              />
            </label>
          </div>
        </section>

        <footer className="px-2 py-4 text-center text-xs leading-5 text-slate-500">
          <span className="block">MCC timing reference:</span>
          <span className="block">2 minutes between stations, 11 minutes per station.</span>
        </footer>
      </div>
    </main>
  );
}
