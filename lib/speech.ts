export type SpeechRecognitionState = {
  supported: boolean;
  start: () => void;
  stop: () => void;
};

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function getSpeechRecognition(
  onTranscript: (text: string) => void,
  onEnd?: () => void
): SpeechRecognitionState {
  if (typeof window === "undefined") {
    return { supported: false, start: () => undefined, stop: () => undefined };
  }

  // Placeholder: replace or augment with Deepgram streaming STT when DEEPGRAM_API_KEY is configured.
  const SpeechRecognition =
    window.SpeechRecognition ?? window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { supported: false, start: () => undefined, stop: () => undefined };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-CA";
  recognition.onresult = (event) => {
    const text = Array.from(event.results)
      .map((result) => result[0]?.transcript)
      .filter(Boolean)
      .join(" ");
    onTranscript(text);
  };
  recognition.onend = () => onEnd?.();

  return {
    supported: true,
    start: () => recognition.start(),
    stop: () => recognition.stop()
  };
}
