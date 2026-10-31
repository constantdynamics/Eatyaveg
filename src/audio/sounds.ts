/**
 * Geluidjes, zelf gemaakt met de Web Audio API (geen bestanden): kort, zacht, nooit schel.
 */
import { getAudio } from './context';
import { getAudioPrefs } from './prefs';

export type SoundName =
  'plop' | 'pling' | 'groei' | 'kwaak' | 'giechel' | 'druppel' | 'fontein' | 'woesj' | 'tik';

function tone(
  ctx: AudioContext,
  out: AudioNode,
  {
    type = 'sine',
    from,
    to = from,
    start = 0,
    dur,
    peak = 0.2,
  }: {
    type?: OscillatorType;
    from: number;
    to?: number;
    start?: number;
    dur: number;
    peak?: number;
  },
) {
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.02, dur / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(
  ctx: AudioContext,
  out: AudioNode,
  {
    dur,
    from,
    to,
    peak = 0.12,
    start = 0,
  }: { dur: number; from: number; to: number; peak?: number; start?: number },
) {
  const t = ctx.currentTime + start;
  const length = Math.ceil(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + dur * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(out);
  src.start(t);
  src.stop(t + dur + 0.02);
}

const SOUNDS: Record<SoundName, (ctx: AudioContext, out: AudioNode) => void> = {
  plop: (c, o) => tone(c, o, { from: 520, to: 180, dur: 0.14, peak: 0.25 }),
  pling: (c, o) => {
    tone(c, o, { from: 1046, dur: 0.6, peak: 0.12 });
    tone(c, o, { from: 1568, dur: 0.45, peak: 0.06, start: 0.02 });
  },
  groei: (c, o) => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(c, o, { type: 'triangle', from: f, dur: 0.22, peak: 0.16, start: i * 0.12 }),
    );
    tone(c, o, { type: 'triangle', from: 1319, dur: 0.5, peak: 0.12, start: 0.5 });
  },
  kwaak: (c, o) => {
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1100;
    lp.connect(o);
    tone(c, lp, { type: 'square', from: 360, to: 250, dur: 0.16, peak: 0.08 });
    tone(c, lp, { type: 'square', from: 340, to: 240, dur: 0.16, peak: 0.08, start: 0.2 });
  },
  giechel: (c, o) => {
    [740, 880, 820, 960, 860].forEach((f, i) =>
      tone(c, o, { from: f, to: f * 0.92, dur: 0.07, peak: 0.1, start: i * 0.075 }),
    );
  },
  druppel: (c, o) => {
    tone(c, o, { from: 1400, to: 620, dur: 0.09, peak: 0.16 });
    tone(c, o, { from: 1100, to: 700, dur: 0.06, peak: 0.06, start: 0.1 });
  },
  fontein: (c, o) => {
    noise(c, o, { dur: 0.7, from: 600, to: 2400, peak: 0.08 });
    tone(c, o, { from: 784, dur: 0.3, peak: 0.06, start: 0.45 });
  },
  woesj: (c, o) => noise(c, o, { dur: 0.35, from: 400, to: 1800, peak: 0.07 }),
  tik: (c, o) => tone(c, o, { from: 1500, dur: 0.035, peak: 0.08 }),
};

export function playSound(name: SoundName): void {
  if (!getAudioPrefs().sound) return;
  const audio = getAudio();
  if (!audio || audio.ctx.state !== 'running') return;
  try {
    SOUNDS[name](audio.ctx, audio.master);
  } catch {
    // Geluid is nooit essentieel.
  }
}
