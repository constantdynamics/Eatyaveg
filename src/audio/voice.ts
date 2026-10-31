/**
 * De stem (§8.5): Web Speech in het Nederlands (nl-NL, anders nl-BE), iets langzamer en hoger.
 * Bij voorkeur een stem die op het apparaat zelf werkt (localService), zodat bijvoorbeeld de naam
 * van het kind het apparaat niet verlaat. Geen Nederlandse stem: geen spraak. Nooit een
 * anderstalige stem.
 */
import { getAudioPrefs } from './prefs';

export interface VoiceOption {
  uri: string;
  name: string;
  lang: string;
  local: boolean;
}

const RATE = 0.9;
const PITCH = 1.15;

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis
    : null;
}

export function estimateSpeechMs(text: string): number {
  return Math.min(6500, 700 + text.split(/\s+/).length * 380);
}

function dutch(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const nl = voices.filter((v) => /^nl([-_]|$)/i.test(v.lang));
  const rank = (v: SpeechSynthesisVoice) =>
    (v.localService ? 0 : 2) + (/^nl[-_]NL/i.test(v.lang) ? 0 : 1);
  return [...nl].sort((a, b) => rank(a) - rank(b));
}

export function listDutchVoices(): VoiceOption[] {
  const s = synth();
  if (!s) return [];
  return dutch(s.getVoices()).map((v) => ({
    uri: v.voiceURI,
    name: v.name,
    lang: v.lang,
    local: v.localService,
  }));
}

/** Wacht op voiceschanged (sommige browsers laden de stemmen pas later). */
export function voicesReady(timeoutMs = 1500): Promise<void> {
  const s = synth();
  if (!s) return Promise.resolve();
  if (s.getVoices().length > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      s.removeEventListener('voiceschanged', done);
      resolve();
    };
    s.addEventListener('voiceschanged', done);
    setTimeout(done, timeoutMs);
  });
}

/**
 * De stem die gebruikt wordt: de gekozen stem (ook als die via internet werkt: dan heeft de ouder
 * daar bewust voor gekozen), anders de beste stem op het apparaat zelf.
 */
export function pickVoice(): SpeechSynthesisVoice | undefined {
  const s = synth();
  if (!s) return undefined;
  const candidates = dutch(s.getVoices());
  const chosen = getAudioPrefs().voiceURI;
  if (chosen) {
    const match = candidates.find((v) => v.voiceURI === chosen);
    if (match) return match;
  }
  return candidates.find((v) => v.localService);
}

export function cancelSpeech(): void {
  synth()?.cancel();
}

/** Spreekt een zin uit; resolvet als de zin klaar is (of na een veilige tijd, of bij afbreken). */
export function speak(
  text: string,
  { signal, force = false }: { signal?: AbortSignal; force?: boolean } = {},
): Promise<void> {
  const s = synth();
  const voice = pickVoice();
  if (!s || !voice || (!force && !getAudioPrefs().speech)) {
    // Geen spraak: wel dezelfde rustige timing, zodat momenten niet voorbij flitsen.
    return new Promise((resolve) => {
      const t = setTimeout(resolve, Math.min(1800, estimateSpeechMs(text) * 0.6));
      signal?.addEventListener('abort', () => {
        clearTimeout(t);
        resolve();
      });
    });
  }
  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(safety);
      resolve();
    };
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = RATE;
    u.pitch = PITCH;
    u.onend = finish;
    u.onerror = finish;
    // Sommige browsers sturen geen 'end': nooit eeuwig wachten.
    const safety = setTimeout(finish, estimateSpeechMs(text) * 2 + 1000);
    signal?.addEventListener('abort', () => {
      s.cancel();
      finish();
    });
    s.speak(u);
  });
}

let unlocked = false;

/** iOS: de eerste uiting moet in een tik-handler; een lege, stille uiting ontgrendelt. */
export function unlockSpeech(): void {
  const s = synth();
  if (!s || unlocked) return;
  unlocked = true;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    s.speak(u);
  } catch {
    // niet ondersteund
  }
}
