import type { Mood, Pose } from '../../characters/types';
import type { VeggieId } from '../../domain/types';
import type { CameraMode } from './camera';
import type { Spot } from './world';
import type { ObjectId } from './ZoneObjects';

export type Fx = 'jump' | 'giggle' | 'pop' | 'wiggle';

/** Wat een vriendje op dit moment in de tuin laat zien. */
export interface BuddyDisplay {
  phase: number;
  drops: number;
  dropsNeeded: number;
  spot: Spot;
  mood: Mood;
  pose: Pose;
  fx?: Fx;
  fxKey: number;
  newDrop?: number;
  showAnimal: boolean;
  /** Verschuiving tijdens verhuizen naar de eigen zone (wereld-eenheden). */
  travel: { dx: number; dy: number };
  /** Rustig heen en weer wandelen in rust. */
  idleOffset: number;
  fountainKey: number;
  practicing: boolean;
  regrowing: boolean;
}

export type GardenMode = CameraMode & { id?: VeggieId };

export interface GardenState {
  mode: GardenMode;
  camMs: number;
  dragDx: number;
  buddies: Partial<Record<VeggieId, BuddyDisplay>>;
  objects: Partial<Record<ObjectId, number>>;
  confetti: number;
  dim: VeggieId | null;
  /** Het vorige focusvriendje blijft even boven de vervagende dimlaag. */
  lastDim: VeggieId | null;
  playing: boolean;
}

export type GardenAction =
  | { type: 'mode'; mode: GardenMode; ms?: number }
  | { type: 'drag'; dx: number }
  | { type: 'patch'; id: VeggieId; patch: Partial<BuddyDisplay> }
  | { type: 'patchAll'; patch: Partial<BuddyDisplay> }
  | { type: 'object'; id: ObjectId }
  | { type: 'confetti' }
  | { type: 'dim'; id: VeggieId | null }
  | { type: 'playing'; value: boolean };
