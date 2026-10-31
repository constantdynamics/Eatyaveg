/** Fases en krachten (§7.2). Alle krachten zijn realistisch, veilig en niet gevaarlijk om na te doen. */
import type { Phase, PhaseDef } from '../domain/types';
import type { VeggieProgress } from '../domain/growth';

export const PHASES: PhaseDef[] = [
  {
    phase: 1,
    animal: 'mier',
    animalWithArticle: 'een mier',
    power: 'een speelgoedblokje optillen',
    prop: 'blokje',
  },
  {
    phase: 2,
    animal: 'lieveheersbeestje',
    animalWithArticle: 'een lieveheersbeestje',
    power: 'een stapel boeken dragen',
    prop: 'boeken',
  },
  {
    phase: 3,
    animal: 'egel',
    animalWithArticle: 'een egel',
    power: 'een schooltas dragen',
    prop: 'schooltas',
  },
  {
    phase: 4,
    animal: 'konijn',
    animalWithArticle: 'een konijn',
    power: 'helpen met de boodschappen',
    prop: 'boodschappentas',
  },
  {
    phase: 5,
    animal: 'poes',
    animalWithArticle: 'een poes',
    power: 'een tuinstoel verplaatsen',
    prop: 'tuinstoel',
  },
  {
    phase: 6,
    animal: 'jaguar',
    animalWithArticle: 'een jaguar',
    power: 'de tafel dekken voor het hele gezin',
    prop: 'borden',
  },
  {
    phase: 7,
    animal: 'beer',
    animalWithArticle: 'een beer',
    power: 'de grote koffer dragen',
    prop: 'koffer',
  },
  {
    phase: 8,
    animal: 'dinosaurus',
    animalWithArticle: 'een dinosaurus',
    power: 'een grote mens optillen',
    prop: 'volwassene',
  },
  {
    phase: 9,
    animal: 'walvis',
    animalWithArticle: 'een walvis',
    power: 'de hele familie een groepsknuffel geven',
    prop: 'familie',
  },
];

export function phaseDef(phase: Exclude<Phase, 0>): PhaseDef {
  return PHASES[phase - 1]!;
}

/**
 * De kracht als tekst. Standaard neutraal; vult de ouder in hoe het kind de ouders noemt,
 * dan wordt het persoonlijk ("de koffer van papa dragen", "mama optillen").
 */
export function powerText(phase: Exclude<Phase, 0>, parentNames: readonly string[] = []): string {
  const names = parentNames.map((n) => n.trim()).filter(Boolean);
  if (names.length > 0) {
    if (phase === 7) return `de koffer van ${names[1] ?? names[0]} dragen`;
    if (phase === 8) return `${names[0]} optillen`;
  }
  return phaseDef(phase).power;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Status voor de ouder: "Zo groot als een konijn · nog 2× tot poes". */
export function progressStatus(p: VeggieProgress): string {
  if (p.phase === 0) return 'Nog een zaadje';
  const def = phaseDef(p.phase);
  if (p.maxed) return 'Zo groot als een walvis';
  const next = phaseDef((p.phase + 1) as Exclude<Phase, 0>);
  const remaining = p.dropsNeeded - p.drops;
  const size = `Zo groot als ${def.animalWithArticle}`;
  const rest = `nog ${remaining}× tot ${next.animal}`;
  return p.regrowing ? `${size} · weer aan het groeien · ${rest}` : `${size} · ${rest}`;
}

export function phaseTitle(phase: Phase): string {
  return phase === 0 ? 'Zaadje' : capitalize(phaseDef(phase).animal);
}
