"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, FileText } from "lucide-react";
import { AvatarPanel } from "@/components/AvatarPanel";
import { Timer } from "@/components/Timer";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { getSpeechRecognition, speak } from "@/lib/speech";
import type { OsceCase, SessionPhase, TranscriptMessage } from "@/lib/types";

const READING_SECONDS = 120;
const ENCOUNTER_SECONDS = 660;

function createMessage(role: TranscriptMessage["role"], content: string): TranscriptMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString()
  };
}

export function SimulationRoom({ osceCase }: { osceCase: OsceCase }) {
  const [phase, setPhase] = useState<SessionPhase>("reading");
  const [secondsRemaining, setSecondsRemaining] = useState(READING_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<TranscriptMessage[]>([
    createMessage("system", "Reading time started.")
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isPatientSpeaking, setIsPatientSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof getSpeechRecognition> | null>(null);

  const speechState = useMemo(
    () =>
      getSpeechRecognition(
        (text) => setInputValue((current) => [current, text].filter(Boolean).join(" ")),
        () => setIsListening(false)
      ),
    []
  );

  useEffect(() => {
    recognitionRef.current = speechState;
  }, [speechState]);

  useEffect(() => {
    if (!isRunning || phase === "ended") {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          if (phase === "reading") {
            setPhase("encounter");
            setMessages((existing) => [...existing, createMessage("patient", osceCase.openingPrompt)]);
            speak(osceCase.openingPrompt);
            return ENCOUNTER_SECONDS;
          }

          setPhase("ended");
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, osceCase.openingPrompt, phase]);

  function beginEncounter() {
    setPhase("encounter");
    setSecondsRemaining(ENCOUNTER_SECONDS);
    setIsRunning(true);
    setMessages((existing) => [...existing, createMessage("patient", osceCase.openingPrompt)]);
    setIsPatientSpeaking(true);
    speak(osceCase.openingPrompt);
    window.setTimeout(() => setIsPatientSpeaking(false), 1600);
  }

  async function submitMessage() {
    const trimmed = inputValue.trim();
    if (!trimmed || phase !== "encounter" || isSubmitting) {
      return;
    }

    const candidateMessage = createMessage("candidate", trimmed);
    const nextMessages = [...messages, candidateMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsSubmitting(true);

    const response = await fetch("/api/patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId: osceCase.id, transcript: nextMessages })
    });
    const data = (await response.json()) as { response: string };
    const patientMessage = createMessage("patient", data.response);
    setMessages((existing) => [...existing, patientMessage]);
    setIsPatientSpeaking(true);
    speak(data.response);
    window.setTimeout(() => setIsPatientSpeaking(false), 1800);
    setIsSubmitting(false);
  }

  function endStation() {
    setPhase("ended");
    setIsRunning(false);
    setSecondsRemaining(0);
    setMessages((existing) => [...existing, createMessage("system", "Station ended. Examiner scoring is ready.")]);
  }

  function toggleSpeech() {
    if (!recognitionRef.current?.supported) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)_24rem]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
            <p className="text-xs font-semibold uppercase tracking-wide text-clinical-teal">{osceCase.stationType}</p>
            <h1 className="mt-2 text-2xl font-semibold text-clinical-navy">{osceCase.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{osceCase.candidateInstructions}</p>
          </section>
          <section className="rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
            <h2 className="flex items-center gap-2 font-semibold text-clinical-navy">
              <FileText size={18} aria-hidden="true" />
              Case card
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {osceCase.visibleInfo.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
            <h2 className="flex items-center gap-2 font-semibold text-clinical-navy">
              <ClipboardCheck size={18} aria-hidden="true" />
              Checklist
            </h2>
            <ul className="mt-4 space-y-3 text-xs leading-5 text-slate-600">
              {osceCase.checklist.map((item) => (
                <li key={item.id} className="rounded-md bg-slate-50 p-2">
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
        </aside>
        <section className="space-y-5">
          <Timer
            phase={phase}
            secondsRemaining={secondsRemaining}
            isRunning={isRunning}
            onToggle={() => setIsRunning((current) => !current)}
            onEnd={endStation}
          />
          {phase === "reading" ? (
            <button
              type="button"
              onClick={beginEncounter}
              className="w-full rounded-md bg-clinical-teal px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Begin encounter
            </button>
          ) : null}
          <div className="grid gap-5 md:grid-cols-2">
            <AvatarPanel
              label={`${osceCase.patientName}, ${osceCase.patientAge}`}
              role="patient"
              state={osceCase.emotionalState}
              speaking={isPatientSpeaking}
            />
            <AvatarPanel label="AI examiner" role="examiner" state="calm" />
          </div>
          {phase === "ended" ? (
            <Link
              href={`/results/mock-${osceCase.id}?case=${osceCase.id}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-clinical-blue px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              View feedback
            </Link>
          ) : null}
        </section>
        <TranscriptPanel
          messages={messages}
          inputValue={inputValue}
          isListening={isListening}
          speechSupported={speechState.supported}
          onInputChange={setInputValue}
          onSubmit={submitMessage}
          onToggleSpeech={toggleSpeech}
        />
      </div>
    </div>
  );
}
