"use client";

import { Mic, Send, Square } from "lucide-react";
import type { TranscriptMessage } from "@/lib/types";

type TranscriptPanelProps = {
  messages: TranscriptMessage[];
  inputValue: string;
  isListening: boolean;
  speechSupported: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onToggleSpeech: () => void;
};

export function TranscriptPanel({
  messages,
  inputValue,
  isListening,
  speechSupported,
  onInputChange,
  onSubmit,
  onToggleSpeech
}: TranscriptPanelProps) {
  return (
    <section className="flex min-h-[32rem] flex-col rounded-lg border border-clinical-line bg-white shadow-panel">
      <div className="border-b border-clinical-line px-4 py-3">
        <h2 className="font-semibold text-clinical-navy">Transcript</h2>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-lg p-3 text-sm leading-6 ${
              message.role === "candidate"
                ? "ml-8 bg-blue-50 text-blue-950"
                : message.role === "patient"
                  ? "mr-8 bg-clinical-mist text-clinical-navy"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{message.role}</p>
            {message.content}
          </div>
        ))}
      </div>
      <div className="border-t border-clinical-line p-3">
        <textarea
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          rows={3}
          placeholder="Type candidate message"
          className="w-full resize-none rounded-md border border-clinical-line px-3 py-2 text-sm outline-none focus:border-clinical-teal focus:ring-2 focus:ring-clinical-teal/20"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onToggleSpeech}
            disabled={!speechSupported}
            className="inline-flex items-center gap-2 rounded-md border border-clinical-line px-3 py-2 text-sm font-semibold text-clinical-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isListening ? <Square size={16} /> : <Mic size={16} />}
            {isListening ? "Stop" : "Dictate"}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-md bg-clinical-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
