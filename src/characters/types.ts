import type { ReactNode } from 'react';
import type { VeggieId } from '../domain/types';

export type Mood = 'blij' | 'verrast' | 'juichend' | 'trots';
export type Pose = 'staan' | 'lopen' | 'zwaaien' | 'dansen' | 'kracht';
export type HoldMode = 'boven' | 'zij' | 'voor' | 'knuffel';

export interface Colors {
  body: string;
  shade: string;
  accent: string;
  leaf: string;
}

export type Point = readonly [number, number];

/**
 * Lichaam van een vriendje in een vak van 200 × 240 (voeten op y = 232).
 * Gezicht, armen en benen komen uit gedeelde onderdelen.
 */
export interface BodySpec {
  /** Lichaam inclusief blad, steel en versiering, zonder gezicht en ledematen. */
  render: (c: Colors) => ReactNode;
  /** Deel dat vóór de armen ligt (bijvoorbeeld een blad dat over de schouder valt). */
  front?: (c: Colors) => ReactNode;
  face: { x: number; y: number; scale: number };
  shoulders: [Point, Point];
  hips: [Point, Point];
  /** Bovenkant van het hoofd (zonder blad): hier rust een opgetild rekwisiet. */
  headTop: number;
  /** Buikhoogte voor rekwisieten die vóór het lichaam gedragen worden. */
  belly: number;
}

export interface CharacterProps {
  veggie: VeggieId;
  mood?: Mood;
  pose?: Pose;
  /** Fase 1–9: bepaalt het rekwisiet bij pose "kracht". */
  phase?: number;
  /** Hoogte in pixels; de breedte volgt (200 : 240). */
  size?: number;
  animated?: boolean;
  /** Ademen binnen de SVG; de tuin laat de HTML-laag ademen (goedkoper). */
  breathe?: boolean;
  /** Persoonlijke vertraging voor knipperen en ademen, zodat niet alles tegelijk beweegt. */
  delay?: number;
  title?: string;
  className?: string;
}
