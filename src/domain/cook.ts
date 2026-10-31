/** Kookmodus (§10.2): welke ingrediënten horen bij een stap? Eenvoudige, voorspelbare herkenning. */
import type { Ingredient } from './types';

/** Woorden die in een stap kunnen staan voor samengestelde ingrediëntnamen. */
const ALIASES: Record<string, string[]> = {
  tortillawrap: ['wrap'],
  pompoenblokjes: ['pompoen'],
  groentebouillonblokje: ['bouillon'],
  'gekookte rode bieten': ['biet'],
  bloemkoolroosjes: ['bloemkool'],
  cherrytomaatjes: ['tomaatjes'],
  mangoblokjes: ['mango'],
  ananasstukjes: ['ananas'],
  'perziken op sap': ['perzik'],
  'tahin (sesampasta)': ['tahin'],
  'blaadje munt': ['munt'],
  'zoutarme sojasaus': ['sojasaus'],
  'crème fraîche': ['crème fraîche'],
  'parmezaanse kaas': ['kaas'],
  'rode paprika': ['paprika'],
  'halfvolle melk': ['melk'],
  'griekse yoghurt': ['yoghurt'],
  'volle yoghurt': ['yoghurt'],
};

const FILLER = new Set([
  'verse',
  'gedroogde',
  'geraspte',
  'halfvolle',
  'volle',
  'griekse',
  'zoutarme',
  'gekookte',
  'jonge',
  'rode',
  'blauwe',
  'op',
  'sap',
]);

function escape(word: string): string {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function ingredientKeywords(ing: Pick<Ingredient, 'name' | 'plural'>): string[] {
  const name = ing.name.toLowerCase();
  const alias = ALIASES[name];
  if (alias) return alias;
  const base = name.replace(/\(.*?\)/g, ' ');
  const words = base.split(/[^a-zà-ÿ]+/).filter((w) => w && !FILLER.has(w));
  const keys = new Set<string>(words);
  if (ing.plural) keys.add(ing.plural.toLowerCase());
  return [...keys];
}

/** Ingrediënten die in de tekst van een stap genoemd worden, in de volgorde van de lijst. */
export function ingredientsForStep<T extends Pick<Ingredient, 'name' | 'plural'>>(
  step: string,
  ingredients: readonly T[],
): T[] {
  const text = step.toLowerCase();
  return ingredients.filter((ing) =>
    ingredientKeywords(ing).some((k) => {
      if (k.length <= 2) return new RegExp(`(^|[^a-zà-ÿ])${escape(k)}([^a-zà-ÿ]|$)`).test(text);
      return text.includes(k) || (k.length > 5 && text.includes(k.slice(0, -1)));
    }),
  );
}
