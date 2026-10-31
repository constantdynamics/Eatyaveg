import { Seed } from '../../characters/Seed';
import type { VeggieId } from '../../domain/types';
import type { Fx } from './types';

interface SeedViewProps {
  id: VeggieId;
  x: number;
  y: number;
  fx?: Fx;
  fxKey: number;
  focus: boolean;
  hitMin: number;
}

export function SeedView({ id, x, y, fx, fxKey, focus, hitMin }: SeedViewProps) {
  return (
    <div
      className={`fv-buddy ${focus ? 'fv-buddy--focus' : ''}`}
      style={{ left: x, top: y, zIndex: Math.round(y) }}
    >
      <div
        key={fxKey}
        className={fx ? `fv-fx-${fx}` : undefined}
        style={{
          position: 'absolute',
          left: -24,
          bottom: -4,
          transformOrigin: '50% 100%',
          lineHeight: 0,
        }}
      >
        <Seed veggie={id} size={50} />
      </div>
      <div
        className="fv-hit"
        data-tap="seed"
        data-id={id}
        style={{ width: Math.max(48, hitMin), height: Math.max(64, hitMin) }}
      />
    </div>
  );
}
