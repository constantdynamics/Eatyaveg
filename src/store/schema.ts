/**
 * Schema's voor opgeslagen data en import (§11.3). Met `zod/mini`: dezelfde validatie, een
 * fractie van de bundelgrootte (de contentvalidatie gebruikt de volledige zod, buiten de app).
 */
import * as z from 'zod/mini';
import { ALLERGENS, CHILD_COLORS, SECTIONS, VEGGIE_IDS } from '../domain/types';

export const veggieIdSchema = z.enum(VEGGIE_IDS);
export const allergenSchema = z.enum(ALLERGENS);
export const sectionSchema = z.enum(SECTIONS);
const phaseSchema = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const visibilitySchema = z.literal([1, 2, 3, 4]);
const variantSchema = z.enum(['verstopt', 'zichtbaar']);
const isoSchema = z.string().check(z.minLength(10));
const nonEmpty = z.string().check(z.minLength(1));
const intIn = (min: number, max: number) => z.int().check(z.minimum(min), z.maximum(max));

export const childSchema = z.object({
  id: nonEmpty,
  name: z.string().check(z.minLength(1), z.maxLength(40)),
  spokenName: z.optional(z.string().check(z.maxLength(60))),
  color: z.enum(CHILD_COLORS),
  createdAt: isoSchema,
});

export const eatEventSchema = z.object({
  id: nonEmpty,
  childId: nonEmpty,
  veggieId: veggieIdSchema,
  at: isoSchema,
  source: z.enum(['plus', 'raster', 'recept', 'start']),
  recipeId: z.optional(z.string()),
  visibility: z.optional(visibilitySchema),
});

export const practiceEventSchema = z.object({
  id: nonEmpty,
  childId: nonEmpty,
  veggieId: veggieIdSchema,
  at: isoSchema,
  enabled: z.boolean(),
});

export const settingsSchema = z.object({
  perPhase: z.literal([2, 3]),
  dailyCap: intIn(1, 10),
  regrowPerPhase: intIn(1, 3),
  shrinkDays: intIn(1, 60),
  maxShrink: intIn(1, 8),
  sound: z.boolean(),
  speech: z.boolean(),
  voiceURI: z.optional(z.string()),
  reveal: z.boolean(),
  enabledVeggies: z.array(veggieIdSchema),
  allergies: z.array(allergenSchema),
  parentNames: z.optional(z.array(z.string().check(z.maxLength(30)))),
  favoriteRecipeIds: z.array(z.string()),
});

export const shoppingSchema = z.object({
  recipes: z.array(
    z.object({
      recipeId: nonEmpty,
      servings: intIn(1, 20),
      variant: variantSchema,
      addedAt: isoSchema,
    }),
  ),
  manual: z.array(
    z.object({
      id: nonEmpty,
      name: z.string().check(z.minLength(1), z.maxLength(80)),
      section: sectionSchema,
      addedAt: isoSchema,
    }),
  ),
  items: z.record(
    z.string(),
    z.object({
      bought: z.optional(z.boolean()),
      atHome: z.optional(z.boolean()),
      hidden: z.optional(z.boolean()),
    }),
  ),
});

export const snapshotSchema = z.object({
  childId: nonEmpty,
  seenAt: isoSchema,
  veggies: z.partialRecord(
    veggieIdSchema,
    z.object({
      phase: phaseSchema,
      drops: intIn(0, 3),
      count: z.optional(z.int().check(z.minimum(0))),
    }),
  ),
});

export const metaSchema = z.object({
  schemaVersion: z.int().check(z.minimum(1)),
  onboarded: z.boolean(),
  createdAt: isoSchema,
  selectedChildId: z.optional(z.string()),
  daily: z.optional(
    z.object({ date: z.string(), recipeId: z.string(), skipped: z.array(z.string()) }),
  ),
  recentDailyMains: z.optional(z.array(z.object({ date: z.string(), veggieId: veggieIdSchema }))),
  cooked: z.optional(
    z.object({
      date: z.string(),
      recipeId: z.string(),
      variant: variantSchema,
      servings: intIn(1, 20),
      logged: z.optional(z.boolean()),
    }),
  ),
  persistRequested: z.optional(z.boolean()),
});

export const exportFileSchema = z.object({
  app: z.literal('familie-vriendelijk'),
  schemaVersion: z.int().check(z.minimum(1)),
  exportedAt: isoSchema,
  data: z.unknown(),
});
