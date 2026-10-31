/** Dev-galerij van alle vriendjes, stemmingen, poses, krachten en dieren (alleen met ?dev=1). */
import { Animal } from '../../characters/Animal';
import { Seed } from '../../characters/Seed';
import { VeggieCharacter } from '../../characters/VeggieCharacter';
import type { Mood, Pose } from '../../characters/types';
import { PHASES } from '../../content/phases';
import { VEGGIES } from '../../content/veggies';

const MOODS: Mood[] = ['blij', 'verrast', 'juichend', 'trots'];
const POSES: Pose[] = ['staan', 'zwaaien', 'lopen', 'dansen'];

export default function CharacterGallery() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
  const animated = params.get('anim') !== '0';
  const grey = params.get('grijs') === '1';
  return (
    <main className="min-h-dvh bg-paper p-6" style={grey ? { filter: 'grayscale(1)' } : undefined}>
      <h1 className="mb-4 text-2xl">Vriendjes</h1>
      <div className="flex flex-wrap gap-6">
        {VEGGIES.map((v, i) => (
          <figure key={v.id} className="text-center">
            <VeggieCharacter
              veggie={v.id}
              size={150}
              animated={animated}
              delay={i * 0.37}
              pose="zwaaien"
            />
            <figcaption className="text-sm">{v.buddyName}</figcaption>
          </figure>
        ))}
      </div>
      <h2 className="mb-2 mt-8 text-xl">Stemmingen en poses (Wortel en Broccoli)</h2>
      <div className="flex flex-wrap gap-6">
        {MOODS.map((m) => (
          <figure key={m} className="text-center">
            <VeggieCharacter veggie="wortel" mood={m} size={130} animated={animated} />
            <figcaption className="text-sm">{m}</figcaption>
          </figure>
        ))}
        {POSES.map((p) => (
          <figure key={p} className="text-center">
            <VeggieCharacter veggie="broccoli" pose={p} size={130} animated={animated} />
            <figcaption className="text-sm">{p}</figcaption>
          </figure>
        ))}
      </div>
      <h2 className="mb-2 mt-8 text-xl">Krachten per fase</h2>
      <div className="flex flex-wrap items-end gap-8">
        {PHASES.map((p, i) => (
          <figure key={p.phase} className="text-center">
            <VeggieCharacter
              veggie={VEGGIES[(i * 3) % VEGGIES.length]!.id}
              pose="kracht"
              mood="trots"
              phase={p.phase}
              size={140}
              animated={animated}
            />
            <figcaption className="mt-2 text-sm">
              {p.phase}. {p.power}
            </figcaption>
          </figure>
        ))}
      </div>
      <h2 className="mb-2 mt-8 text-xl">Dieren en zaadje</h2>
      <div className="flex flex-wrap items-end gap-6">
        {PHASES.map((p) => (
          <figure key={p.phase} className="text-center">
            <Animal phase={p.phase} size={110} />
            <figcaption className="text-sm">{p.animal}</figcaption>
          </figure>
        ))}
        <figure className="text-center">
          <Seed veggie="pompoen" size={80} />
          <figcaption className="text-sm">zaadje</figcaption>
        </figure>
      </div>
    </main>
  );
}
