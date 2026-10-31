/**
 * Bouwstenen voor recepten. Vaste namen en afdelingen per ingrediënt zorgen dat de
 * boodschappenlijst gelijke ingrediënten netjes optelt.
 */
import type { Ingredient, Recipe, Section, Unit } from '../../domain/types';

type Extra = Partial<Pick<Ingredient, 'basic' | 'optional' | 'variant' | 'note' | 'plural'>>;

export function ing(
  name: string,
  qty: number,
  unit: Unit,
  section: Section,
  extra: Extra = {},
): Ingredient {
  return { name, qty, unit, section, ...extra };
}

type RecipeInput = Omit<
  Recipe,
  'servings' | 'difficulty' | 'hasVariants' | 'nextStep' | 'veggies'
> &
  Partial<Pick<Recipe, 'servings' | 'difficulty' | 'hasVariants' | 'nextStep' | 'veggies'>>;

export function defineRecipe(input: RecipeInput): Recipe {
  return {
    servings: 4,
    difficulty: 'makkelijk',
    nextStep: false,
    veggies: [input.mainVeggie],
    hasVariants: input.steps.some((s) => typeof s !== 'string'),
    ...input,
  };
}

// Basisvoorraad
export const olie = (qty = 1, extra: Extra = {}) =>
  ing('olijfolie', qty, 'el', 'houdbaar', { basic: true, ...extra });
export const zout = () => ing('zout', 1, 'snufje', 'kruiden', { basic: true });
export const peper = () => ing('peper', 1, 'snufje', 'kruiden', { basic: true });
export const nootmuskaat = () => ing('nootmuskaat', 1, 'snufje', 'kruiden', { basic: true });
export const water = (ml: number, extra: Extra = {}) =>
  ing('water', ml, 'ml', 'overig', { basic: true, ...extra });

// Groente en fruit
export const ui = (qty = 1) => ing('ui', qty, 'stuks', 'groente-fruit', { plural: 'uien' });
export const knoflook = (qty = 1) => ing('knoflook', qty, 'teentje', 'groente-fruit');
export const citroen = (qty = 0.5) =>
  ing('citroen', qty, 'stuks', 'groente-fruit', { plural: 'citroenen' });
export const banaan = (qty = 1, extra: Extra = {}) =>
  ing('banaan', qty, 'stuks', 'groente-fruit', { plural: 'bananen', note: 'rijp', ...extra });
export const appel = (qty = 1) => ing('appel', qty, 'stuks', 'groente-fruit', { plural: 'appels' });
export const aardappelen = (g = 1000) =>
  ing('aardappelen', g, 'g', 'groente-fruit', { note: 'kruimig' });
export const wortel = (g: number, extra: Extra = {}) =>
  ing('wortel', g, 'g', 'groente-fruit', extra);
export const courgette = (qty = 1, extra: Extra = {}) =>
  ing('courgette', qty, 'stuks', 'groente-fruit', { plural: 'courgettes', ...extra });
export const pompoen = (g: number) =>
  ing('pompoenblokjes', g, 'g', 'groente-fruit', { note: 'voorgesneden of zelf geschild' });
export const komkommer = (qty = 1) =>
  ing('komkommer', qty, 'stuks', 'groente-fruit', { plural: 'komkommers' });
export const tomaat = (qty: number) =>
  ing('tomaat', qty, 'stuks', 'groente-fruit', { plural: 'tomaten' });
export const doperwten = (g: number) =>
  ing('doperwten', g, 'g', 'diepvries', { note: 'diepvries' });
export const bloemkool = (g: number) => ing('bloemkoolroosjes', g, 'g', 'groente-fruit');
export const sperziebonen = (g: number) => ing('sperziebonen', g, 'g', 'groente-fruit');
export const prei = (qty: number) =>
  ing('prei', qty, 'stuks', 'groente-fruit', { plural: 'preien' });
export const paprika = (qty: number) =>
  ing('rode paprika', qty, 'stuks', 'groente-fruit', { plural: "rode paprika's" });
export const broccoli = (g: number, extra: Extra = {}) =>
  ing('broccoli', g, 'g', 'groente-fruit', extra);
export const spinazie = (g: number, extra: Extra = {}) =>
  ing('verse spinazie', g, 'g', 'groente-fruit', { note: 'jonge bladeren', ...extra });
export const bieten = (g: number) =>
  ing('gekookte rode bieten', g, 'g', 'groente-fruit', { note: 'vacuüm verpakt' });
export const spruitjes = (g: number) => ing('spruitjes', g, 'g', 'groente-fruit');

// Vlees
export const gehakt = (g = 500) =>
  ing('gehakt', g, 'g', 'vlees-vis', { note: 'half-om-half of rund' });
export const kipfilet = (g = 400) => ing('kipfilet', g, 'g', 'vlees-vis');

// Zuivel en eieren
export const ei = (qty = 1) => ing('ei', qty, 'stuks', 'zuivel-eieren', { plural: 'eieren' });
export const melk = (ml: number, extra: Extra = {}) =>
  ing('halfvolle melk', ml, 'ml', 'zuivel-eieren', extra);
export const boter = (g: number) => ing('roomboter', g, 'g', 'zuivel-eieren');
export const kaas = (g: number) =>
  ing('geraspte kaas', g, 'g', 'zuivel-eieren', { note: 'jong belegen' });
export const parmezaan = (g: number) =>
  ing('Parmezaanse kaas', g, 'g', 'zuivel-eieren', { note: 'geraspt' });
export const roomkaas = (g: number) =>
  ing('roomkaas', g, 'g', 'zuivel-eieren', { note: 'naturel' });
export const yoghurt = (g: number, extra: Extra = {}) =>
  ing('volle yoghurt', g, 'g', 'zuivel-eieren', extra);
export const griekseYoghurt = (g: number) => ing('Griekse yoghurt', g, 'g', 'zuivel-eieren');
export const kookroom = (ml: number) => ing('kookroom', ml, 'ml', 'zuivel-eieren');

// Brood en granen
export const pasta = (g = 350, soort = 'pasta', note?: string) =>
  ing(soort, g, 'g', 'brood-granen', note ? { note } : {});
export const wraps = (qty: number) =>
  ing('tortillawrap', qty, 'stuks', 'brood-granen', { plural: 'tortillawraps' });

// Houdbaar
export const rijst = (g = 250) => ing('rijst', g, 'g', 'houdbaar');
export const paneermeel = (g = 50) => ing('paneermeel', g, 'g', 'houdbaar');
export const bloem = (g: number) => ing('bloem', g, 'g', 'houdbaar');
export const passata = (ml = 500) =>
  ing('passata', ml, 'ml', 'houdbaar', { note: 'gezeefde tomaten' });
export const tomatenblokjes = (qty = 1) =>
  ing('tomatenblokjes', qty, 'blik', 'houdbaar', { note: '400 g' });
export const bouillon = (qty = 1) =>
  ing('groentebouillonblokje', qty, 'stuks', 'houdbaar', {
    plural: 'groentebouillonblokjes',
    note: 'zoutarm',
  });
export const kikkererwten = (qty = 1) =>
  ing('kikkererwten', qty, 'blik', 'houdbaar', { note: '400 g' });
export const tahin = (el = 1) => ing('tahin (sesampasta)', el, 'el', 'houdbaar');
export const honing = (tl = 1) => ing('honing', tl, 'tl', 'houdbaar', { optional: true });

// Kruiden
export const basilicum = (tl = 1) => ing('gedroogde basilicum', tl, 'tl', 'kruiden');
export const oregano = (tl = 1) => ing('gedroogde oregano', tl, 'tl', 'kruiden');
export const kaneel = (tl = 0.5) => ing('kaneel', tl, 'tl', 'kruiden');
export const paprikapoeder = (tl = 1) =>
  ing('paprikapoeder', tl, 'tl', 'kruiden', { note: 'edelzoet, niet pittig' });
export const bieslook = (el = 1) =>
  ing('verse bieslook', el, 'el', 'kruiden', { note: 'fijngeknipt' });

// Diepvries
export const diepvries = (name: string, g: number, extra: Extra = {}) =>
  ing(name, g, 'g', 'diepvries', extra);

/** Vaste zinnen die in veel recepten terugkomen. */
export const ZOUT_STAP =
  'Schep eerst de kinderportie op en doe pas daarna zout en peper bij de rest.';
export const HONING_TIP =
  'Geen honing voor kinderen jonger dan 1 jaar. Rijp fruit is meestal zoet genoeg.';
export const SMOOTHIE_TIP =
  'Geef een smoothie af en toe, bij het ontbijt of als tussendoortje, aan tafel in een beker. Hele groente en fruit eten blijft het fijnst.';
