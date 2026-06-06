"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Moon,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Stethoscope,
  Sun,
  Volume2
} from "lucide-react";

type TimerMode = "practice" | "exam";
type CaseType = "with-questions" | "without-questions";
type Theme = "light" | "dark";
type TimerPhase = "reading" | "encounter" | "questions" | "station-complete" | "complete";
type AlarmType = "reading-end" | "eight-minute" | "station-end";
type WindowWithAudioFallback = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const READING_SECONDS = 2 * 60;
const EIGHT_MINUTE_SECONDS = 8 * 60;
const FULL_ENCOUNTER_SECONDS = 11 * 60;
const QUESTIONS_SECONDS = 3 * 60;
const EXAM_STATIONS = 12;
const ALARM_AUDIO_SRC = "alarm.m4a";
let sharedAudioContext: AudioContext | null = null;
let sharedAlarmAudio: HTMLAudioElement | null = null;
let sharedAlarmBuffer: AudioBuffer | null = null;
let sharedAlarmBufferPromise: Promise<AudioBuffer | null> | null = null;
let sharedAlarmUnlocked = false;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getStationCount(mode: TimerMode) {
  return mode === "exam" ? EXAM_STATIONS : 1;
}

function getInitialPhaseSeconds() {
  return READING_SECONDS;
}

function getEncounterSeconds(caseType: CaseType) {
  return caseType === "without-questions" ? FULL_ENCOUNTER_SECONDS : EIGHT_MINUTE_SECONDS;
}

function getPhaseLabel(phase: TimerPhase) {
  if (phase === "reading") {
    return "Reading";
  }

  if (phase === "encounter") {
    return "Encounter";
  }

  if (phase === "questions") {
    return "Post-encounter questions";
  }

  if (phase === "station-complete") {
    return "Station complete";
  }

  return "Exam complete";
}

function getPhaseDuration(phase: TimerPhase, caseType: CaseType) {
  if (phase === "reading") {
    return READING_SECONDS;
  }

  if (phase === "encounter") {
    return getEncounterSeconds(caseType);
  }

  if (phase === "questions") {
    return QUESTIONS_SECONDS;
  }

  return 1;
}

function getAudioContext() {
  const AudioContextConstructor =
    window.AudioContext ?? (window as WindowWithAudioFallback).webkitAudioContext;
  if (!AudioContextConstructor) {
    return null;
  }

  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioContextConstructor();
  }

  return sharedAudioContext;
}

function getAlarmAudio() {
  if (typeof Audio === "undefined") {
    return null;
  }

  if (!sharedAlarmAudio) {
    sharedAlarmAudio = new Audio(ALARM_AUDIO_SRC);
    sharedAlarmAudio.preload = "auto";
    sharedAlarmAudio.volume = 1;
    sharedAlarmAudio.setAttribute("playsinline", "true");
    sharedAlarmAudio.setAttribute("webkit-playsinline", "true");
  }

  return sharedAlarmAudio;
}

function loadAlarmBuffer() {
  const context = getAudioContext();
  if (!context) {
    return null;
  }

  if (sharedAlarmBuffer) {
    return Promise.resolve(sharedAlarmBuffer);
  }

  if (sharedAlarmBufferPromise) {
    return sharedAlarmBufferPromise;
  }

  sharedAlarmBufferPromise = fetch(ALARM_AUDIO_SRC)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load alarm audio: ${response.status}`);
      }

      return response.arrayBuffer();
    })
    .then((audioData) => context.decodeAudioData(audioData))
    .then((buffer) => {
      sharedAlarmBuffer = buffer;
      return buffer;
    })
    .catch(() => null);

  return sharedAlarmBufferPromise;
}

function unlockAudio() {
  const context = getAudioContext();
  const audio = getAlarmAudio();

  if (context) {
    void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.01);
    void loadAlarmBuffer();
  }

  if (!audio || sharedAlarmUnlocked) {
    return;
  }

  audio.load();
  audio.currentTime = 0;
  audio.volume = 0.04;
  const playPromise = audio.play();
  void playPromise
    .then(() => {
      sharedAlarmUnlocked = true;
      window.setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
      }, 120);
    })
    .catch(() => {
      audio.volume = 1;
    });
}

function startAlarmBuffer(buffer: AudioBuffer) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  void context.resume();
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = 1;
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(context.destination);
  source.start(context.currentTime + 0.01);
}

function playPreparedAlarm() {
  if (!sharedAlarmBuffer) {
    return false;
  }

  startAlarmBuffer(sharedAlarmBuffer);
  return true;
}

function playAlarmBuffer(onFallback: () => void) {
  const bufferPromise = loadAlarmBuffer();
  if (!bufferPromise) {
    onFallback();
    return;
  }

  void bufferPromise.then((buffer) => {
    if (!buffer) {
      onFallback();
      return;
    }

    startAlarmBuffer(buffer);
  });
}

function playAlarmElement() {
  const audio = getAlarmAudio();
  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.volume = 1;
  const playPromise = audio.play();
  void playPromise
    .then(() => {
      sharedAlarmUnlocked = true;
    })
    .catch(() => {
      if (!playPreparedAlarm()) {
        playAlarmBuffer(() => undefined);
      }
    });
}

function playAlarm(type: AlarmType) {
  playAlarmElement();

  if (type === "reading-end") {
    navigator.vibrate?.([160, 80, 160]);
    return;
  }

  if (type === "eight-minute") {
    navigator.vibrate?.([140, 70, 140]);
    return;
  }

  navigator.vibrate?.([240, 100, 240, 100, 340]);
}

function getModeDescription(mode: TimerMode) {
  return mode === "exam" ? "12-station circuit" : "Single station";
}

function getCaseTypeDescription(caseType: CaseType) {
  return caseType === "with-questions"
    ? "2 min reading, 8 min encounter, 3 min questions"
    : "2 min reading, 11 min encounter";
}

export function NacOsceTimer() {
  const [mode, setMode] = useState<TimerMode>("practice");
  const [caseType, setCaseType] = useState<CaseType>("with-questions");
  const [theme, setTheme] = useState<Theme>("light");
  const [phase, setPhase] = useState<TimerPhase>("reading");
  const [secondsRemaining, setSecondsRemaining] = useState(getInitialPhaseSeconds);
  const [stationIndex, setStationIndex] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [seekElapsedSeconds, setSeekElapsedSeconds] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("nac-osce-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("nac-osce-theme", theme);
  }, [theme]);

  const stationCount = getStationCount(mode);
  const phaseDuration = getPhaseDuration(phase, caseType);
  const elapsedSeconds = phaseDuration - secondsRemaining;
  const sliderElapsedSeconds = seekElapsedSeconds ?? elapsedSeconds;
  const progress = useMemo(() => {
    if (phase === "complete") {
      return 100;
    }

    if (phase === "station-complete") {
      return 100;
    }

    return Math.round(((phaseDuration - secondsRemaining) / phaseDuration) * 100);
  }, [phase, phaseDuration, secondsRemaining]);
  const canSeek = phase !== "complete" && phase !== "station-complete";

  const currentSignal = useMemo(() => {
    if (phase === "reading") {
      return "Next alarm: enter room at 2:00";
    }

    if (phase === "encounter" && caseType === "with-questions") {
      return "Next alarm: 8-minute oral-question signal";
    }

    if (phase === "encounter") {
      return "Next alarm: final 11-minute signal";
    }

    if (phase === "questions") {
      return "Next alarm: final 11-minute signal";
    }

    return "Timer stopped";
  }, [caseType, phase]);

  const isWarning =
    phase === "questions" ||
    (phase === "encounter" && caseType === "without-questions" && secondsRemaining <= QUESTIONS_SECONDS);
  const signalItems = useMemo(
    () =>
      caseType === "with-questions"
        ? [
            { icon: Clock3, label: "Reading", value: "2:00" },
            { icon: Stethoscope, label: "Encounter closes", value: "8:00" },
            { icon: FileQuestion, label: "Final signal", value: "11:00" }
          ]
        : [
            { icon: Clock3, label: "Reading", value: "2:00" },
            { icon: Stethoscope, label: "Final encounter signal", value: "11:00" }
          ],
    [caseType]
  );
  const signalSchedule = caseType === "with-questions" ? "2:00, 8:00, 11:00" : "2:00, 11:00";

  const resetTimer = useCallback(
    (nextMode = mode, nextCaseType = caseType) => {
      setMode(nextMode);
      setCaseType(nextCaseType);
      setPhase("reading");
      setSecondsRemaining(READING_SECONDS);
      setStationIndex(1);
      setIsRunning(false);
      setSeekElapsedSeconds(null);
    },
    [caseType, mode]
  );

  const commitSeek = useCallback(
    (elapsedValue: number) => {
      if (!canSeek) {
        return;
      }

      const nextElapsed = Math.min(Math.max(elapsedValue, 0), phaseDuration);
      setSecondsRemaining(phaseDuration - nextElapsed);
    },
    [canSeek, phaseDuration]
  );

  const updateSeekPreview = useCallback(
    (elapsedValue: number) => {
      if (!canSeek) {
        return;
      }

      setSeekElapsedSeconds(Math.min(Math.max(elapsedValue, 0), phaseDuration));
    },
    [canSeek, phaseDuration]
  );

  const finishSeek = useCallback(() => {
    if (seekElapsedSeconds === null) {
      return;
    }

    commitSeek(seekElapsedSeconds);
    setSeekElapsedSeconds(null);
  }, [commitSeek, seekElapsedSeconds]);

  const finishStation = useCallback(() => {
    playAlarm("station-end");

    if (stationIndex >= stationCount) {
      setPhase("complete");
      setSecondsRemaining(0);
      setIsRunning(false);
      return;
    }

    if (!autoAdvance) {
      setPhase("station-complete");
      setSecondsRemaining(0);
      setIsRunning(false);
      return;
    }

    setStationIndex((current) => current + 1);
    setPhase("reading");
    setSecondsRemaining(READING_SECONDS);
    setSeekElapsedSeconds(null);
  }, [autoAdvance, stationCount, stationIndex]);

  const moveToNextPhase = useCallback(() => {
    if (phase === "reading") {
      playAlarm("reading-end");
      setPhase("encounter");
      setSecondsRemaining(getEncounterSeconds(caseType));
      setSeekElapsedSeconds(null);
      return;
    }

    if (phase === "encounter" && caseType === "with-questions") {
      playAlarm("eight-minute");
      setPhase("questions");
      setSecondsRemaining(QUESTIONS_SECONDS);
      setSeekElapsedSeconds(null);
      return;
    }

    if (phase === "encounter" || phase === "questions") {
      finishStation();
      return;
    }

    if (phase === "station-complete") {
      setStationIndex((current) => Math.min(current + 1, stationCount));
      setPhase("reading");
      setSecondsRemaining(READING_SECONDS);
      setIsRunning(true);
      setSeekElapsedSeconds(null);
    }
  }, [caseType, finishStation, phase, stationCount]);

  useEffect(() => {
    if (!isRunning || phase === "complete" || phase === "station-complete") {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          window.setTimeout(moveToNextPhase, 0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [caseType, isRunning, moveToNextPhase, phase]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-[var(--text)]">
      <div className="mx-4 flex min-h-screen flex-col py-4 sm:mx-auto sm:w-full sm:max-w-5xl sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-clinical-teal">NAC OSCE timer</p>
            <h1 className="text-2xl font-semibold text-[var(--text)] sm:text-3xl">Practice timer</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                playAlarm("reading-end");
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-clinical-line bg-[var(--surface)] text-[var(--text)] shadow-sm hover:bg-[var(--surface-muted)]"
              aria-label="Test alarm"
              title="Test alarm"
            >
              <Volume2 size={19} />
            </button>
            <button
              type="button"
              onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-clinical-line bg-[var(--surface)] text-[var(--text)] shadow-sm hover:bg-[var(--surface-muted)]"
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
          </div>
        </header>

        <section className="mt-4 w-full rounded-lg border border-clinical-line bg-[var(--surface)] p-4 shadow-panel sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-clinical-navy">Mode</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(["practice", "exam"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => resetTimer(option, caseType)}
                    className={`min-h-16 rounded-md border px-3 py-2 text-left text-sm font-semibold ${
                      mode === option
                        ? "border-clinical-teal bg-clinical-mist text-clinical-navy"
                        : "border-clinical-line bg-[var(--surface)] text-[var(--text-soft)]"
                    }`}
                  >
                    <span className="block capitalize">{option}</span>
                    <span className="mt-1 block text-xs font-medium text-[var(--text-muted)]">{getModeDescription(option)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-clinical-navy">Station type</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(["with-questions", "without-questions"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => resetTimer(mode, option)}
                    className={`min-h-16 rounded-md border px-3 py-2 text-left text-sm font-semibold ${
                      caseType === option
                        ? "border-clinical-teal bg-clinical-mist text-clinical-navy"
                        : "border-clinical-line bg-[var(--surface)] text-[var(--text-soft)]"
                    }`}
                  >
                    <span className="block">{option === "with-questions" ? "With oral questions" : "Without oral questions"}</span>
                    <span className="mt-1 block text-xs font-medium text-[var(--text-muted)]">{getCaseTypeDescription(option)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 flex w-full min-w-0 flex-1 flex-col justify-center rounded-lg border border-clinical-line bg-[var(--surface)] p-4 shadow-panel sm:p-6">
          <div className="grid gap-4 sm:flex sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Station {stationIndex} of {stationCount}
              </p>
              <p className="mt-2 inline-flex items-center gap-2 rounded-md bg-clinical-mist px-3 py-1 text-sm font-semibold text-clinical-navy">
                {phase === "complete" ? <CheckCircle2 size={16} /> : <Bell size={16} />}
                {getPhaseLabel(phase)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Signal schedule</p>
              <p className="mt-1 text-sm font-semibold text-clinical-navy">{signalSchedule}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {signalItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md border border-clinical-line bg-[var(--surface-muted)] px-3 py-2">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    <Icon size={14} />
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-clinical-navy">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div
              className={`mx-auto flex aspect-square w-full max-w-[18rem] items-center justify-center rounded-full border-[10px] sm:max-w-[21rem] ${
                isWarning ? "timer-warning border-red-500 bg-[var(--warning-bg)]" : "border-clinical-teal bg-[var(--timer-bg)]"
              }`}
            >
              <div className="text-center">
                <p className={`font-mono text-6xl font-semibold sm:text-7xl ${isWarning ? "text-red-700" : "text-clinical-navy"}`}>
                  {formatTime(secondsRemaining)}
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  {phase === "complete" ? "Done" : isRunning ? "Running" : "Paused"}
                </p>
              </div>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className={`h-full rounded-full ${isWarning ? "bg-red-500" : "bg-clinical-teal"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={phaseDuration}
                step={1}
                value={canSeek ? sliderElapsedSeconds : phaseDuration}
                onPointerDown={() => {
                  if (canSeek) {
                    setSeekElapsedSeconds(elapsedSeconds);
                  }
                }}
                onPointerUp={finishSeek}
                onPointerCancel={finishSeek}
                onBlur={finishSeek}
                onKeyUp={finishSeek}
                onChange={(event) => {
                  const nextElapsed = Number(event.target.value);
                  updateSeekPreview(nextElapsed);
                  if (seekElapsedSeconds === null) {
                    commitSeek(nextElapsed);
                  }
                }}
                disabled={!canSeek}
                aria-label="Adjust timer position"
                className="time-slider w-full accent-clinical-teal disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
                <span>{formatTime(canSeek ? sliderElapsedSeconds : phaseDuration)} elapsed</span>
                <span>{formatTime(canSeek ? phaseDuration - sliderElapsedSeconds : 0)} remaining</span>
              </div>
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-[var(--text-soft)]">{currentSignal}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                setIsRunning((current) => !current);
              }}
              disabled={phase === "complete" || phase === "station-complete"}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-clinical-blue px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                moveToNextPhase();
              }}
              disabled={phase === "complete"}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-md border border-clinical-line bg-[var(--surface)] px-3 text-sm font-semibold text-clinical-navy hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SkipForward size={18} />
              {phase === "station-complete" ? "Next station" : "Next signal"}
            </button>
            <button
              type="button"
              onClick={() => resetTimer()}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-md border border-clinical-line bg-[var(--surface)] px-3 text-sm font-semibold text-clinical-navy hover:bg-[var(--surface-muted)]"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </section>

        <section className="mt-4 w-full rounded-lg border border-clinical-line bg-[var(--surface)] p-4 shadow-panel sm:p-5">
          <label className="flex items-center justify-between gap-3 rounded-md border border-clinical-line px-3 py-3">
            <span>
              <span className="block text-sm font-semibold text-[var(--text-soft)]">Auto-advance stations</span>
              <span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">
                Useful for full 12-station mode.
              </span>
            </span>
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(event) => setAutoAdvance(event.target.checked)}
              className="h-5 w-5 shrink-0 accent-clinical-teal"
            />
          </label>
        </section>
      </div>
    </main>
  );
}
