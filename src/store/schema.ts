/** Zod-schema's voor opgeslagen data en import (§11.3). */
import { z } from 'zod';
import { ALLERGENS, CHILD_COLORS, SECTIONS, VEGGIE_IDS } from '../domain/types';

export const veggieIdSchema = z.enum(VEGGIE_IDS);
export const allergenSchema = z.enum(ALLERGENS);
export const sectionSchema = z.enum(SECTIONS);
const phaseSchema = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const visibilitySchema = z.literal([1, 2, 3, 4]);
const variantSchema = z.enum(['verstopt', 'zichtbaar']);
const isoSchema = z.string().min(10);

export const childSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(40),
  spokenName: z.string().max(60).optional(),
  color: z.enum(CHILD_COLORS),
  createdAt: isoSchema,
});

export const eatEventSchema = z.object({
  id: z.string().min(1),
  childId: z.string().min(1),
  veggieId: veggieIdSchema,
  at: isoSchema,
  source: z.enum(['plus', 'raster', 'recept', 'start']),
  recipeId: z.string().optional(),
  visibility: visibilitySchema.optional(),
});

export const practiceEventSchema = z.object({
  id: z.string().min(1),
  childId: z.string().min(1),
  veggieId: veggieIdSchema,
  at: isoSchema,
  enabled: z.boolean(),
});

export const settingsSchema = z.object({
  perPhase: z.literal([2, 3]),
  dailyCap: z.number().int().min(1).max(10),
  regrowPerPhase: z.number().int().min(1).max(3),
  shrinkDays: z.number().int().min(1).max(60),
  maxShrink: z.number().int().min(1).max(8),
  sound: z.boolean(),
  speech: z.boolean(),
  voiceURI: z.string().optional(),
  reveal: z.boolean(),
  enabledVeggies: z.array(veggieIdSchema),
  allergies: z.array(allergenSchema),
  parentNames: z.array(z.string().max(30)).optional(),
  favoriteRecipeIds: z.array(z.string()),
});

export const shoppingSchema = z.object({
  recipes: z.array(
    z.object({
      recipeId: z.string().min(1),
      servings: z.number().int().min(1).max(20),
      variant: variantSchema,
      addedAt: isoSchema,
    }),
  ),
  manual: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1).max(80),
      section: sectionSchema,
      addedAt: isoSchema,
    }),
  ),
  items: z.record(
    z.string(),
    z.object({
      bought: z.boolean().optional(),
      atHome: z.boolean().optional(),
      hidden: z.boolean().optional(),
    }),
  ),
});

export const snapshotSchema = z.object({
  childId: z.string().min(1),
  seenAt: isoSchema,
  veggies: z.partialRecord(
    veggieIdSchema,
    z.object({
      phase: phaseSchema,
      drops: z.number().int().min(0).max(3),
      count: z.number().int().min(0).optional(),
    }),
  ),
});

export const metaSchema = z.object({
  schemaVersion: z.number().int().min(1),
  onboarded: z.boolean(),
  createdAt: isoSchema,
  selectedChildId: z.string().optional(),
  daily: z
    .object({ date: z.string(), recipeId: z.string(), skipped: z.array(z.string()) })
    .optional(),
  recentDailyMains: z.array(z.object({ date: z.string(), veggieId: veggieIdSchema })).optional(),
  cooked: z
    .object({
      date: z.string(),
      recipeId: z.string(),
      variant: variantSchema,
      servings: z.number().int().min(1).max(20),
      logged: z.boolean().optional(),
    })
    .optional(),
  persistRequested: z.boolean().optional(),
});

export const persistedStateSchema = z.object({
  meta: metaSchema,
  children: z.array(childSchema),
  eatEvents: z.array(eatEventSchema),
  practiceEvents: z.array(practiceEventSchema),
  settings: settingsSchema,
  shopping: shoppingSchema,
  snapshots: z.record(z.string(), snapshotSchema),
});

export const exportFileSchema = z.object({
  app: z.literal('familie-vriendelijk'),
  schemaVersion: z.number().int().min(1),
  exportedAt: isoSchema,
  data: z.unknown(),
});
