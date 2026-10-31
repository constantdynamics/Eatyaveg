/**
 * Contentvalidatie (§9.6). Draait in CI via `npm run validate:content` en als unit-test.
 * Fouten breken de build; waarschuwingen worden alleen gemeld.
 */
import { z } from 'zod';
import {
  ALLERGENS,
  SECTIONS,
  UNITS,
  VEGGIE_IDS,
  type Allergen,
  type Recipe,
  type VeggieId,
} from '../domain/types';
import { FORBIDDEN_WORDS, lines } from './lines';
import { PHASES } from './phases';
import { RECIPES } from './recipes';
import { VEGGIES } from './veggies';

const ingredientSchema = z.object({
  name: z.string().min(1),
  plural: z.string().optional(),
  qty: z.number().positive(),
  unit: z.enum(UNITS),
  section: z.enum(SECTIONS),
  basic: z.boolean().optional(),
  optional: z.boolean().optional(),
  variant: z.enum(['verstopt', 'zichtbaar']).optional(),
  note: z.string().optional(),
});

const recipeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['hoofdgerecht', 'saus-dip', 'soep', 'smoothie', 'ontbijt-bakken', 'snack']),
  mainVeggie: z.enum(VEGGIE_IDS),
  veggies: z.array(z.enum(VEGGIE_IDS)).min(1),
  visibility: z.literal([1, 2, 3, 4]),
  hasVariants: z.boolean(),
  nextStep: z.boolean(),
  weekend: z.boolean().optional(),
  timeMinutes: z.number().int().positive(),
  servings: z.number().int().positive(),
  difficulty: z.enum(['makkelijk', 'gemiddeld']),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z
    .array(
      z.union([
        z.string().min(5),
        z.object({ verstopt: z.string().min(5), zichtbaar: z.string().min(5) }),
      ]),
    )
    .min(1),
  tips: z.object({
    verstoppen: z.string().optional(),
    weerstand: z.string().optional(),
    bewaren: z.string().optional(),
    veiligheid: z.string().optional(),
  }),
  allergens: z.array(z.enum(ALLERGENS)),
});

const SPICY =
  /(chili|sambal|cayenne|wasabi|sriracha|jalape|harissa|tabasco|piri ?piri|rode peper|spaanse peper)/i;

const ALLERGEN_RULES: { allergen: Allergen; match: RegExp; except?: RegExp }[] = [
  {
    allergen: 'melk',
    match:
      /(melk|room|kaas|boter|yoghurt|kwark|crème fraîche|creme fraiche|mascarpone|ricotta|mozzarella|parmezaan|feta)/i,
    except: /(kokosmelk|amandelmelk|havermelk|sojamelk|pindakaas|pindaboter|notenboter|kokosroom)/i,
  },
  { allergen: 'ei', match: /\b(ei|eieren|eidooier|eiwit)\b/i },
  {
    allergen: 'gluten',
    match:
      /(bloem|pasta|spaghetti|macaroni|penne|fusilli|farfalle|lasagne|paneermeel|brood|wrap|tortilla|couscous|havermout|bulgur|tarwe|spelt|cracker|beschuit|sojasaus|ketjap)/i,
    except: /(bloemkool|sesampasta|notenpasta|pindapasta|tahin)/i,
  },
  {
    allergen: 'noten',
    match: /(amandel|walnot|walnoot|hazelno|cashew|pecan|pistache|notenpasta|macadamia)/i,
  },
  { allergen: 'pinda', match: /pinda/i },
  { allergen: 'soja', match: /(soja|tofu|edamame|ketjap)/i },
  { allergen: 'sesam', match: /(sesam|tahin)/i },
  { allergen: 'selderij', match: /(selderij|bouillon)/i },
  { allergen: 'mosterd', match: /mosterd/i },
  {
    allergen: 'vis',
    match: /(\bvis\b|zalm|tonijn|kabeljauw|koolvis|pangasius|ansjovis|makreel|haring|sardine)/i,
  },
  { allergen: 'schaaldieren', match: /(garnaal|garnalen|krab|kreeft)/i },
  { allergen: 'weekdieren', match: /(mossel|inktvis|oester)/i },
];

const WHOLE_NUTS =
  /(amandelen|walnoten|hazelnoten|cashewnoten|pecannoten|pinda's|pindas|\bnoten\b)/i;
const GROUND = /(gemalen|pasta|boter|meel|kaas)/i;
const FISH = ALLERGEN_RULES.find((r) => r.allergen === 'vis')!.match;

export const VEGGIE_KEYWORDS: Record<VeggieId, { match: RegExp; except?: RegExp }> = {
  wortel: { match: /wortel/i },
  courgette: { match: /courgette/i },
  pompoen: { match: /pompoen/i },
  komkommer: { match: /komkommer/i },
  tomaat: { match: /(tomaat|tomaten|passata)/i },
  doperwten: { match: /(doperwt|erwtjes|\berwten)/i, except: /kikkererwt/i },
  bloemkool: { match: /bloemkool/i },
  sperziebonen: { match: /(sperziebon|sperzieboon)/i },
  prei: { match: /\bprei/i },
  paprika: { match: /paprika/i, except: /paprikapoeder/i },
  broccoli: { match: /broccoli/i },
  spinazie: { match: /spinazie/i },
  'rode-biet': { match: /biet/i },
  spruitjes: { match: /spruit/i },
};

const SWEETENERS = /(honing|suiker|siroop|stroop|agave)/i;

function stepTexts(r: Recipe): string[] {
  return r.steps.flatMap((s) => (typeof s === 'string' ? [s] : [s.verstopt, s.zichtbaar]));
}

export function validateRecipes(recipes: readonly Recipe[]): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  for (const r of recipes) {
    const at = (msg: string) => `${r.id}: ${msg}`;
    const parsed = recipeSchema.safeParse(r);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push(at(`${issue.path.join('.')}: ${issue.message}`));
      }
      continue;
    }
    if (seen.has(r.id)) errors.push(at('dubbele id'));
    seen.add(r.id);

    if (!r.veggies.includes(r.mainVeggie)) errors.push(at('mainVeggie ontbreekt in veggies[]'));
    if (r.steps.length > 5) errors.push(at(`${r.steps.length} stappen (maximaal 5)`));
    if (r.steps.length < 3) warnings.push(at(`maar ${r.steps.length} stappen (richtlijn 3–4)`));
    if (r.timeMinutes > 30 && !r.weekend)
      errors.push(at(`${r.timeMinutes} minuten zonder weekend: true`));
    if (r.nextStep && r.visibility < 3)
      errors.push(at('Volgende stap moet zichtbaarheid 3 of 4 hebben'));
    if (!r.nextStep && r.visibility >= 3 && r.category !== 'smoothie') {
      warnings.push(at('zichtbaarheid 3–4 maar niet gemarkeerd als Volgende stap'));
    }
    const hasVariantSteps = r.steps.some((s) => typeof s !== 'string');
    if (r.hasVariants !== hasVariantSteps) errors.push(at('hasVariants klopt niet met de stappen'));
    if (r.hasVariants && r.visibility !== 1)
      errors.push(at('recepten met varianten hebben zichtbaarheid 1 (en 2)'));
    if (!r.hasVariants && r.ingredients.some((i) => i.variant)) {
      errors.push(at('ingrediënt met variant in een recept zonder varianten'));
    }

    const names = r.ingredients.map((i) => i.name);
    const texts = [r.name, ...names, ...stepTexts(r)];
    for (const text of texts) {
      if (SPICY.test(text)) errors.push(at(`pittig ingrediënt: "${text}"`));
    }

    for (const rule of ALLERGEN_RULES) {
      const hit = names.find((n) => rule.match.test(n) && !(rule.except?.test(n) ?? false));
      if (hit && !r.allergens.includes(rule.allergen)) {
        errors.push(at(`allergeen ${rule.allergen} ontbreekt (door "${hit}")`));
      }
    }

    for (const n of names) {
      if (WHOLE_NUTS.test(n) && !GROUND.test(n)) errors.push(at(`hele noten: "${n}"`));
    }

    const hasHoney = names.some((n) => /honing/i.test(n));
    if (hasHoney && !/1 jaar/.test(r.tips.veiligheid ?? '')) {
      errors.push(at('honing zonder veiligheidstip (geen honing onder 1 jaar)'));
    }

    if (
      (r.veggies.includes('spinazie') || r.veggies.includes('rode-biet')) &&
      names.some((n) => FISH.test(n))
    ) {
      errors.push(at('spinazie of rode biet gecombineerd met vis'));
    }

    for (const id of VEGGIE_IDS) {
      const kw = VEGGIE_KEYWORDS[id];
      const hit = names.find((n) => kw.match.test(n) && !(kw.except?.test(n) ?? false));
      if (hit && !r.veggies.includes(id))
        errors.push(at(`bevat ${id} ("${hit}") maar staat niet in veggies[]`));
    }

    const nonBasic = r.ingredients.filter((i) => !i.basic).length;
    if (nonBasic > 10) warnings.push(at(`${nonBasic} ingrediënten (meer dan 10)`));

    if (r.category === 'smoothie') {
      let sweetEl = 0;
      for (const i of r.ingredients) {
        if (SWEETENERS.test(i.name))
          sweetEl += i.unit === 'tl' ? i.qty! / 3 : i.unit === 'el' ? i.qty! : 99;
        if (/dadel/i.test(i.name)) sweetEl += i.qty!;
      }
      if (sweetEl > 1) warnings.push(at('smoothie met meer dan 1 eetlepel toegevoegd zoetmiddel'));
    }

    if ((r.description.match(/[.!?](\s|$)/g) ?? []).length > 1) {
      warnings.push(at('beschrijving is langer dan één zin'));
    }
  }

  // Minimumeisen per hoofdgroente (smoothies tellen niet mee).
  for (const id of VEGGIE_IDS) {
    const mine = recipes.filter((r) => r.mainVeggie === id && r.category !== 'smoothie');
    const hidden = mine.filter((r) => r.visibility <= 2);
    if (hidden.length < 2)
      errors.push(`${id}: ${hidden.length} recept(en) op niveau 1–2 (minimaal 2)`);
    if (!mine.some((r) => r.nextStep)) errors.push(`${id}: geen Volgende stap-recept`);
  }

  if (recipes.length < 50) errors.push(`maar ${recipes.length} recepten (minimaal 50)`);
  const smoothies = recipes.filter((r) => r.category === 'smoothie').length;
  if (smoothies < 10) errors.push(`maar ${smoothies} smoothies (minimaal 10)`);
  const weekend = recipes.filter((r) => r.weekend).length;
  if (weekend < 3) warnings.push(`maar ${weekend} weekendrecepten (richtlijn ongeveer 4)`);

  return { errors, warnings };
}

export function validateVeggiesAndLines(): string[] {
  const errors: string[] = [];
  if (VEGGIES.length < 12) errors.push(`maar ${VEGGIES.length} groenten (minimaal 12)`);
  for (const v of VEGGIES) {
    const { verstoppen, weerstand, volgendeStap } = v.tips;
    if (verstoppen.length < 2 || verstoppen.length > 3)
      errors.push(`${v.id}: 2–3 tips om te verstoppen`);
    if (weerstand.length < 2 || weerstand.length > 3)
      errors.push(`${v.id}: 2–3 tips bij weerstand`);
    if (volgendeStap.length < 1 || volgendeStap.length > 2)
      errors.push(`${v.id}: 1–2 tips voor de volgende stap`);
  }
  if (PHASES.length !== 9) errors.push('er moeten 9 fases zijn');

  const samples: string[] = [
    ...lines.greet('Noor'),
    ...lines.greet(),
    ...lines.touch('Broccoli'),
    ...lines.touchSeed(),
    ...lines.reveal('wortel en prei'),
    ...lines.discovery('Pompoen'),
    ...lines.discoveryMany(),
    ...lines.drop(),
    ...lines.growth('Wortel', 'een konijn'),
    ...PHASES.flatMap((p) => lines.power('Wortel', p.power)),
    ...lines.fountain(),
    ...lines.mentor('Broccoli', 'broccoli'),
    ...lines.mentorPractice('Broccoli', 'broccoli'),
    ...lines.beforeDinner('Pompoen'),
    ...lines.beforeDinnerSeed('pompoen'),
    ...lines.practice('Broccoli'),
    ...lines.bye(),
  ];
  for (const s of samples) {
    if (FORBIDDEN_WORDS.some((w) => w.test(s))) errors.push(`zin met verboden woord: "${s}"`);
    const words = s.split(/\s+/).length;
    if (words > 12) errors.push(`zin te lang (${words} woorden): "${s}"`);
  }
  return errors;
}

export function validateContent(): { errors: string[]; warnings: string[] } {
  const { errors, warnings } = validateRecipes(RECIPES);
  return { errors: [...errors, ...validateVeggiesAndLines()], warnings };
}
