/**
 * Maakt ingeladen of geïmporteerde data veilig bruikbaar. Ongeldige onderdelen worden apart
 * gezet (quarantaine) in plaats van weggegooid: een walvis raak je nooit kwijt.
 */
import {
  childSchema,
  eatEventSchema,
  metaSchema,
  practiceEventSchema,
  settingsSchema,
  shoppingSchema,
  snapshotSchema,
} from './schema';
import { defaultSettings, emptyShopping, type PersistedState } from './state';
import { SCHEMA_VERSION } from '../config/app';
import type { GardenSnapshot, Settings } from '../domain/types';

export interface SanitizeResult {
  state: PersistedState;
  rejected: unknown[];
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

interface Parser<T> {
  safeParse(value: unknown): { success: true; data: T } | { success: false };
}

function keepValid<T>(value: unknown, schema: Parser<T>, rejected: unknown[]): T[] {
  if (!Array.isArray(value)) {
    if (value !== undefined) rejected.push(value);
    return [];
  }
  const out: T[] = [];
  for (const item of value) {
    const parsed = schema.safeParse(item);
    if (parsed.success) out.push(parsed.data);
    else rejected.push(item);
  }
  return out;
}

function sanitizeSettings(value: unknown): Settings {
  const raw = asRecord(value);
  const base = defaultSettings();
  const merged = { ...base, ...raw };
  const parsed = settingsSchema.safeParse(merged);
  if (parsed.success) return parsed.data;
  // Per veld terugvallen op de standaard.
  const result: Record<string, unknown> = { ...base };
  const shape = settingsSchema.shape;
  for (const key of Object.keys(shape) as (keyof typeof shape)[]) {
    const field = shape[key].safeParse(raw[key]);
    if (field.success && field.data !== undefined) result[key] = field.data;
  }
  return settingsSchema.parse(result);
}

export function sanitizeState(input: unknown, nowIso: string): SanitizeResult {
  const raw = asRecord(input);
  const rejected: unknown[] = [];

  const metaRaw = asRecord(raw.meta);
  const metaParsed = metaSchema.safeParse({ schemaVersion: SCHEMA_VERSION, ...metaRaw });
  const meta = metaParsed.success
    ? { ...metaParsed.data, schemaVersion: SCHEMA_VERSION }
    : {
        schemaVersion: SCHEMA_VERSION,
        onboarded: metaRaw.onboarded === true,
        createdAt: typeof metaRaw.createdAt === 'string' ? metaRaw.createdAt : nowIso,
      };
  if (!metaParsed.success) rejected.push({ meta: metaRaw });

  const shoppingParsed = shoppingSchema.safeParse(raw.shopping ?? emptyShopping());
  if (!shoppingParsed.success) rejected.push({ shopping: raw.shopping });

  const snapshots: Record<string, GardenSnapshot> = {};
  for (const [key, value] of Object.entries(asRecord(raw.snapshots))) {
    const parsed = snapshotSchema.safeParse(value);
    if (parsed.success) snapshots[key] = parsed.data;
    else rejected.push({ snapshot: value });
  }

  const state: PersistedState = {
    meta,
    children: keepValid(raw.children, childSchema, rejected),
    eatEvents: keepValid(raw.eatEvents, eatEventSchema, rejected),
    practiceEvents: keepValid(raw.practiceEvents, practiceEventSchema, rejected),
    settings: sanitizeSettings(raw.settings),
    shopping: shoppingParsed.success ? shoppingParsed.data : emptyShopping(),
    snapshots,
  };
  return { state, rejected };
}
