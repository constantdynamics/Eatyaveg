/** Eén gedeelde AudioContext, pas aangemaakt na een tik (autoplay-regels). */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

type AudioContextCtor = typeof AudioContext;

export function getAudio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    // Zacht: geluid is nooit hard (§8.5, §14.3).
    master.gain.value = 0.45;
    master.connect(ctx.destination);
  }
  return { ctx, master: master! };
}
