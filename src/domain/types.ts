/** Kerntypen (§12). Nederlandse domeintermen waar dat duidelijker is. */

export const VEGGIE_IDS = [
  'wortel',
  'courgette',
  'pompoen',
  'komkommer',
  'tomaat',
  'doperwten',
  'bloemkool',
  'sperziebonen',
  'prei',
  'paprika',
  'broccoli',
  'spinazie',
  'rode-biet',
  'spruitjes',
] as const;

export type VeggieId = (typeof VEGGIE_IDS)[number];

export type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // 0 = nog niet ontdekt
export type Visibility = 1 | 2 | 3 | 4; // onzichtbaar · licht zichtbaar · zichtbaar · puur

export const ALLERGENS = [
  'gluten',
  'ei',
  'melk',
  'noten',
  'pinda',
  'soja',
  'sesam',
  'selderij',
  'mosterd',
  'vis',
  'schaaldieren',
  'weekdieren',
  'lupine',
  'sulfiet',
] as const;
export type Allergen = (typeof ALLERGENS)[number];

export const SECTIONS = [
  'groente-fruit',
  'vlees-vis',
  'zuivel-eieren',
  'brood-granen',
  'houdbaar',
  'diepvries',
  'kruiden',
  'overig',
] as const;
export type Section = (typeof SECTIONS)[number];

export const UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'el',
  'tl',
  'stuks',
  'teentje',
  'blik',
  'pak',
  'snufje',
] as const;
export type Unit = (typeof UNITS)[number];

export type Taste = 'makkelijk' | 'gemiddeld' | 'uitdagend';

export interface VeggiePalette {
  body: string;
  shade: string;
  accent: string;
  leaf?: string;
}

export interface Veggie {
  id: VeggieId;
  name: string; // 'Doperwten'
  buddyName: string; // 'Erwtje'
  /** Hoe de groente in een zin klinkt: "Er zat ___ in je eten!" */
  spoken: string;
  taste: Taste;
  palette: VeggiePalette;
  tips: { verstoppen: string[]; weerstand: string[]; volgendeStap: string[] };
}

export interface PhaseDef {
  phase: Exclude<Phase, 0>;
  animal: string; // 'konijn'
  animalWithArticle: string; // 'een konijn'
  power: string; // 'helpen met de boodschappen'
  prop: PropId;
}

export type PropId =
  | 'blokje'
  | 'boeken'
  | 'schooltas'
  | 'boodschappentas'
  | 'tuinstoel'
  | 'borden'
  | 'koffer'
  | 'volwassene'
  | 'familie';

export interface Child {
  id: string;
  name: string; // voornaam of bijnaam
  spokenName?: string; // uitspraak voor de stem
  color: ChildColor;
  createdAt: string;
}

export const CHILD_COLORS = [
  'child-1',
  'child-2',
  'child-3',
  'child-4',
  'child-5',
  'child-6',
] as const;
export type ChildColor = (typeof CHILD_COLORS)[number];

export type EatSource = 'plus' | 'raster' | 'recept' | 'start';

export interface EatEvent {
  id: string;
  childId: string;
  veggieId: VeggieId;
  at: string; // ISO
  source: EatSource;
  recipeId?: string;
  visibility?: Visibility;
}

export interface PracticeEvent {
  // Weer oefenen aan of uit
  id: string;
  childId: string;
  veggieId: VeggieId;
  at: string;
  enabled: boolean;
}

export interface SeenVeggie {
  phase: Phase;
  drops: number;
  /** Aantal registraties dat het kind al heeft gezien (voor de walvis-fontein). */
  count?: number;
}

export interface GardenSnapshot {
  // wat het kind het laatst heeft gezien
  childId: string;
  seenAt: string;
  veggies: Partial<Record<VeggieId, SeenVeggie>>;
}

export type VariantKey = 'verstopt' | 'zichtbaar';

export interface Ingredient {
  name: string;
  /** Meervoud voor stuks, bijvoorbeeld 'uien'. */
  plural?: string;
  qty?: number;
  unit?: Unit;
  section: Section;
  basic?: boolean; // basisvoorraad: zout, peper, olie
  optional?: boolean;
  variant?: VariantKey;
  /** Korte toelichting, bijvoorbeeld 'zoutarm' of '400 g'. */
  note?: string;
}

export type RecipeCategory =
  'hoofdgerecht' | 'saus-dip' | 'soep' | 'smoothie' | 'ontbijt-bakken' | 'snack';

export type RecipeStep = string | { verstopt: string; zichtbaar: string };

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  mainVeggie: VeggieId;
  veggies: VeggieId[]; // alle groenten die erin zitten
  visibility: Visibility;
  hasVariants: boolean; // extra verstopt / licht zichtbaar
  nextStep: boolean; // categorie Volgende stap
  weekend?: boolean; // langer dan 30 minuten
  timeMinutes: number; // totaal, inclusief voorbereiden
  servings: number; // standaard 4 (2 volwassenen + 2 kinderen)
  difficulty: 'makkelijk' | 'gemiddeld';
  ingredients: Ingredient[];
  steps: RecipeStep[]; // 3–4, max. 5
  tips: { verstoppen?: string; weerstand?: string; bewaren?: string; veiligheid?: string };
  allergens: Allergen[];
}

export interface ShoppingRecipeEntry {
  recipeId: string;
  servings: number;
  variant: VariantKey;
  addedAt: string;
}

export interface ManualShoppingItem {
  id: string;
  name: string;
  section: Section;
  addedAt: string;
}

export interface ShoppingItemState {
  bought?: boolean;
  atHome?: boolean;
  hidden?: boolean;
}

export interface ShoppingState {
  recipes: ShoppingRecipeEntry[];
  manual: ManualShoppingItem[];
  /** Status per afgeleid item (sleutel = naam + eenheidsfamilie). */
  items: Record<string, ShoppingItemState>;
}

/** Afgeleid item zoals de lijst het toont (§12 ShoppingItem). */
export interface ShoppingItem {
  id: string;
  name: string;
  qty?: number;
  unit?: Unit;
  section: Section;
  basic: boolean;
  bought: boolean;
  atHome: boolean;
  recipeIds: string[];
  manual?: boolean;
}

export interface Settings {
  perPhase: 2 | 3; // standaard 3
  dailyCap: number; // standaard 2
  regrowPerPhase: number; // standaard 2
  shrinkDays: number; // standaard 7
  maxShrink: number; // standaard 3
  sound: boolean; // standaard aan
  speech: boolean; // standaard aan
  voiceURI?: string;
  reveal: boolean; // onthulmoment, standaard aan
  enabledVeggies: VeggieId[];
  allergies: Allergen[];
  parentNames?: string[]; // bijv. ['mama', 'papa'], optioneel
  favoriteRecipeIds: string[];
}

export interface DailyPick {
  date: string; // yyyy-MM-dd (lokale tijd)
  recipeId: string;
  skipped: string[];
}

export interface CookedMark {
  date: string;
  recipeId: string;
  variant: VariantKey;
  servings: number;
  logged?: boolean;
}

export interface AppMeta {
  schemaVersion: number;
  onboarded: boolean;
  createdAt: string;
  selectedChildId?: string;
  daily?: DailyPick;
  recentDailyMains?: { date: string; veggieId: VeggieId }[];
  cooked?: CookedMark;
  persistRequested?: boolean;
}
