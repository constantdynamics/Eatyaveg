/**
 * Gesproken zinnen voor de tuin (§8.5, bijlage B). Kort (± 10 woorden), uitnodigend, met
 * varianten tegen herhaling. Nooit "je moet", nooit gezond/ongezond, nooit eten als beloning.
 */
export type LineList = readonly string[];

export const lines = {
  greet: (name?: string): LineList =>
    name
      ? [
          `Hoi ${name}!`,
          `Daar ben je weer, ${name}!`,
          `Hallo ${name}! Fijn dat je er bent.`,
          `Hoi ${name}! Kom je kijken?`,
        ]
      : ['Hoi!', 'Daar ben je weer!', 'Hallo! Fijn dat je er bent.'],

  touch: (buddy: string): LineList => [
    'Hihi, dat kriebelt!',
    `Ik ben ${buddy}!`,
    `Hoi! Ik ben ${buddy}.`,
    'Hihi! Nog een keer?',
    'Hallo daar!',
  ],

  touchSeed: (): LineList => [
    'Ik ben nog een zaadje!',
    'Ik groei nog even onder de grond.',
    'Wie zou ik worden?',
  ],

  reveal: (list: string): LineList => [
    `Er zat ${list} in je eten!`,
    `Weet je wat? Er zat ${list} in je eten!`,
  ],

  discovery: (buddy: string): LineList => [
    `Hoera, een nieuw vriendje: ${buddy}!`,
    `Kijk! Daar is ${buddy}!`,
    `Hallo ${buddy}! Welkom in de tuin!`,
  ],

  discoveryMany: (): LineList => [
    'Hoera, allemaal nieuwe vriendjes!',
    'Kijk eens, nieuwe vriendjes in de tuin!',
  ],

  drop: (): LineList => [
    'Mmm, lekker! Ik word al sterker!',
    'Dankjewel! Ik groei al een beetje.',
    'Joepie, een druppel erbij!',
    'Mmm! Nog even en ik groei!',
  ],

  growth: (buddy: string, animal: string): LineList => [
    `Kijk! ${buddy} is zo groot als ${animal}!`,
    `Wauw! ${buddy} is nu zo groot als ${animal}!`,
    `Hoera! ${buddy} is zo groot als ${animal}!`,
  ],

  power: (buddy: string, power: string): LineList => [
    `Kijk, ${buddy} kan nu ${power}!`,
    `${buddy} kan ${power}!`,
  ],

  fountain: (): LineList => [
    'Dankjewel! Wat een feest!',
    'Hoera! Kijk mijn fontein!',
    'Spetter de spat, dankjewel!',
  ],

  mentor: (target: string, spoken: string): LineList => [
    `${target} wil ook groot worden. Zullen we ${spoken} eens proeven?`,
    `Zullen we ${spoken} eens proeven? Dan groeit ${target} ook!`,
    `${target} is nog klein. Proeven we samen ${spoken}?`,
  ],

  mentorSeed: (spoken: string): LineList => [
    `Daar zit nog een zaadje. Zullen we ${spoken} eens proeven?`,
    `Wie zit daar verstopt? Proef ${spoken} maar eens!`,
  ],

  mentorPractice: (target: string, spoken: string): LineList => [
    `${target} wil weer groeien!`,
    `${target} wil weer groeien. Zullen we ${spoken} weer eens proeven?`,
  ],

  beforeDinner: (buddy: string): LineList => [
    `Hoi! Ik ben ${buddy}. Als jij een hapje proeft, groei ik!`,
    `Ik ben ${buddy}! Zullen we samen proeven?`,
    `Hoi! Ik ben ${buddy}. Ben je benieuwd hoe ik smaak?`,
  ],

  beforeDinnerSeed: (spoken: string): LineList => [
    `Ik ben nog een zaadje. Proef ${spoken}, dan kom ik tevoorschijn!`,
    `Wie zit hier verstopt? Proef ${spoken} maar eens!`,
  ],

  practice: (buddy: string): LineList => [`${buddy} wil weer groeien!`],

  bye: (): LineList => ['Doei! Tot straks!', 'Dag! Tot de volgende keer!'],
} as const;

/** Maakt van groentenamen een vloeiende opsomming: "wortel, prei en broccoli". */
export function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} en ${names[names.length - 1]}`;
}

/** Woorden die nooit in een zin voor het kind mogen staan (bijlage B, §13.2). */
export const FORBIDDEN_WORDS = [
  /\bslaap/i,
  /\bslapen\b/i,
  /\bmoet\b/i,
  /\bmoeten\b/i,
  /\bgezond/i,
  /\bongezond/i,
  /bord leeg/i,
  /als je niet/i,
  /\btoetje\b/i,
];
