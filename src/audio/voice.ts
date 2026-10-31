/** Wordt in mijlpaal 7 gevuld met de Web Speech API (nl-NL). */
export function estimateSpeechMs(text: string): number {
  return Math.min(6000, 600 + text.split(/\s+/).length * 330);
}

export function speak(text: string, _opts: { signal?: AbortSignal } = {}): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, estimateSpeechMs(text)));
}

export function cancelSpeech(): void {}
