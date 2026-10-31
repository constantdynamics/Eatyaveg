import { VEGGIE_BY_ID } from '../content/veggies';
import type { VeggieId } from '../domain/types';
import type { Colors } from './types';

/** Tekenvak van een vriendje; de voeten staan op y = 232. */
export const CHAR_W = 200;
export const CHAR_H = 240;
export const CHAR_GROUND = 232;

export function colorsOf(id: VeggieId): Colors {
  const p = VEGGIE_BY_ID[id].palette;
  return { body: p.body, shade: p.shade, accent: p.accent, leaf: p.leaf ?? p.shade };
}
