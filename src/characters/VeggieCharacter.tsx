/**
 * Een groentevriendje als systeem: lichaam per groente + gedeelde ogen, mond, wangen,
 * armpjes en beentjes. Bijvoorbeeld <VeggieCharacter veggie="wortel" mood="blij" pose="zwaaien" />.
 */
import type { CSSProperties } from 'react';
import { phaseDef } from '../content/phases';
import type { Phase, VeggieId } from '../domain/types';
import { BODIES } from './bodies';
import { Arm, Face, Leg } from './parts';
import { PROPS, type PropSpec } from './props';
import { CHAR_H, CHAR_W, colorsOf } from './geometry';
import type { CharacterProps, Point } from './types';

const GROUND = 232;

interface Layout {
  left: Point;
  right: Point;
  leftClass?: string;
  rightClass?: string;
  prop?: { spec: PropSpec; x: number; y: number; layer: 'behind-arms' | 'front' };
}

function layoutFor(veggie: VeggieId, pose: CharacterProps['pose'], phase: number): Layout {
  const body = BODIES[veggie];
  const [sl, sr] = body.shoulders;
  const restLeft: Point = [sl[0] - 16, sl[1] + 38];
  const restRight: Point = [sr[0] + 16, sr[1] + 38];

  switch (pose) {
    case 'zwaaien':
      return { left: restLeft, right: [sr[0] + 30, sr[1] - 42], rightClass: 'fv-arm-wave' };
    case 'dansen':
      return {
        left: [sl[0] - 30, sl[1] - 34],
        right: [sr[0] + 30, sr[1] - 34],
        leftClass: 'fv-arm-dance-l',
        rightClass: 'fv-arm-dance-r',
      };
    case 'lopen':
      return {
        left: restLeft,
        right: restRight,
        leftClass: 'fv-arm-swing-l',
        rightClass: 'fv-arm-swing-r',
      };
    case 'kracht': {
      const p = Math.min(9, Math.max(1, phase)) as Exclude<Phase, 0>;
      const spec = PROPS[phaseDef(p).prop];
      if (spec.hold === 'boven') {
        const bottom = body.headTop + 8;
        return {
          left: [100 - spec.w * 0.42, bottom - 4],
          right: [100 + spec.w * 0.42, bottom - 4],
          prop: { spec, x: 100, y: bottom, layer: 'behind-arms' },
        };
      }
      if (spec.hold === 'zij') {
        const hand: Point = [sr[0] + 26, sr[1] + 34];
        return {
          left: restLeft,
          right: hand,
          prop: { spec, x: hand[0], y: hand[1] + spec.h + 8, layer: 'behind-arms' },
        };
      }
      if (spec.hold === 'voor') {
        const y = body.belly + spec.h / 2;
        return {
          left: [100 - spec.w / 2 + 4, body.belly],
          right: [100 + spec.w / 2 - 4, body.belly],
          prop: { spec, x: 100, y, layer: 'behind-arms' },
        };
      }
      return {
        left: [100 - spec.w / 2 - 4, GROUND - spec.h * 0.55],
        right: [100 + spec.w / 2 + 4, GROUND - spec.h * 0.55],
        prop: { spec, x: 100, y: GROUND, layer: 'behind-arms' },
      };
    }
    default:
      return { left: restLeft, right: restRight };
  }
}

export function VeggieCharacter({
  veggie,
  mood = 'blij',
  pose = 'staan',
  phase = 1,
  size = 120,
  animated = true,
  breathe = true,
  delay = 0,
  title,
  className = '',
}: CharacterProps) {
  const body = BODIES[veggie];
  const c = colorsOf(veggie);
  const layout = layoutFor(veggie, pose, phase);
  const [hl, hr] = body.hips;
  const walking = animated && pose === 'lopen';
  const dancing = animated && pose === 'dansen';
  const style = { '--fv-delay': `${-delay}s` } as CSSProperties;

  const prop = layout.prop && (
    <g transform={`translate(${layout.prop.x} ${layout.prop.y})`}>{layout.prop.spec.render()}</g>
  );

  return (
    <svg
      viewBox={`0 0 ${CHAR_W} ${CHAR_H}`}
      width={(size * CHAR_W) / CHAR_H}
      height={size}
      overflow="visible"
      className={`fv-char ${animated ? 'fv-char--animated' : ''} ${className}`}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g className={dancing ? 'fv-dance-body' : animated && breathe ? 'fv-breathe' : undefined}>
        <Leg
          hip={hl}
          ground={GROUND}
          side="links"
          className={walking ? 'fv-leg-walk-l' : dancing ? 'fv-leg-dance-l' : undefined}
        />
        <Leg
          hip={hr}
          ground={GROUND}
          side="rechts"
          className={walking ? 'fv-leg-walk-r' : dancing ? 'fv-leg-dance-r' : undefined}
        />
        {body.render(c)}
        <Face {...body.face} mood={mood} blink={animated && mood !== 'juichend'} />
        {body.front?.(c)}
        {prop}
        <Arm
          from={body.shoulders[0]}
          to={layout.left}
          className={animated ? layout.leftClass : undefined}
        />
        <Arm
          from={body.shoulders[1]}
          to={layout.right}
          className={animated ? layout.rightClass : undefined}
        />
      </g>
    </svg>
  );
}
