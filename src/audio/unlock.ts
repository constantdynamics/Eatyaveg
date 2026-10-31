/** Ontgrendel geluid en spraak in de tik-handler (browsers blokkeren autoplay, §8.5). */
import { getAudio } from './context';
import { unlockSpeech } from './voice';

export function unlockAudio(): void {
  const audio = getAudio();
  if (audio && audio.ctx.state === 'suspended') void audio.ctx.resume().catch(() => undefined);
  if (audio) {
    // Een stil buffertje: nodig op oudere iOS-versies.
    try {
      const buffer = audio.ctx.createBuffer(1, 1, 22050);
      const src = audio.ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(audio.ctx.destination);
      src.start(0);
    } catch {
      // geen probleem
    }
  }
  unlockSpeech();
}
