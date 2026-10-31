/** Een vriendje in de tuinwereld: karakter, druppels, dier, zonnestraal en tikvlak. */
import type { CSSProperties } from 'react';
import { Animal } from '../../characters/Animal';
import { VeggieCharacter } from '../../characters/VeggieCharacter';
import type { VeggieId } from '../../domain/types';
import type { BuddyDisplay } from './types';

const BASE = 240;

interface BuddyViewProps {
  id: VeggieId;
  x: number;
  y: number;
  /** Getoonde hoogte in wereld-eenheden. */
  size: number;
  display: BuddyDisplay;
  showDrops: boolean;
  showAnimal: boolean;
  focus: boolean;
  /** Minimale tikvlakmaat in wereld-eenheden (een peuter tikt met de hele hand). */
  hitMin: number;
  delay: number;
  animated: boolean;
}

function DropsRow({
  filled,
  total,
  newDrop,
  size,
}: {
  filled: number;
  total: number;
  newDrop?: number;
  size: number;
}) {
  return (
    <div
      className="absolute flex flex-col gap-[6%]"
      style={{ left: size * 0.42, bottom: size * 0.08, width: size * 0.2 }}
    >
      {Array.from({ length: total }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 22"
          width={size * 0.17}
          height={size * 0.19}
          overflow="visible"
          aria-hidden="true"
        >
          <path
            d="M10 1 C 10 1, 3 9, 3 13 A 7 7 0 0 0 17 13 C 17 9, 10 1, 10 1 Z"
            fill="#fffdf8"
            stroke="#5b9bd5"
            strokeWidth={1.8}
          />
          {total - 1 - i < filled && (
            <path
              key={newDrop === total - 1 - i ? `n${newDrop}` : 'f'}
              className={newDrop === total - 1 - i ? 'fv-drop-new' : undefined}
              d="M10 1 C 10 1, 3 9, 3 13 A 7 7 0 0 0 17 13 C 17 9, 10 1, 10 1 Z"
              fill="#5b9bd5"
            />
          )}
        </svg>
      ))}
    </div>
  );
}

export function BuddyView({
  id,
  x,
  y,
  size,
  display,
  showDrops,
  showAnimal,
  focus,
  hitMin,
  delay,
  animated,
}: BuddyViewProps) {
  const hitW = Math.max(size * 0.85, hitMin);
  const hitH = Math.max(size * 1.02, hitMin);
  const moveStyle: CSSProperties = {
    transform: `translate(${display.travel.dx + display.idleOffset}px, ${display.travel.dy}px)`,
  };
  return (
    <div
      className={`fv-buddy ${focus ? 'fv-buddy--focus' : ''}`}
      style={{ left: x, top: y, zIndex: Math.round(y) }}
    >
      {display.regrowing && display.practicing && (
        <svg
          className="absolute"
          style={{ left: -size * 0.65, bottom: 0 }}
          width={size * 1.3}
          height={size * 1.75}
          viewBox="0 0 130 175"
          aria-hidden="true"
        >
          <path d="M55 0 L75 0 L130 175 L0 175 Z" fill="#fff2c2" opacity={0.55} />
        </svg>
      )}
      {showAnimal && display.phase > 0 && (
        <div
          className="absolute fv-fade-in"
          style={{ left: -size * 1.32, bottom: 0, width: size, height: size }}
        >
          <Animal phase={display.phase} size={size} />
        </div>
      )}
      <div className="fv-buddy-move" style={moveStyle}>
        <div className="fv-buddy-scale" style={{ transform: `scale(${size / BASE})` }}>
          <div className="fv-buddy-inner">
            <div
              key={display.fxKey}
              className={display.fx ? `fv-fx-${display.fx}` : undefined}
              style={{ transformOrigin: '50% 100%' }}
            >
              <div
                className={animated ? 'fv-breathe-html' : undefined}
                style={{ '--fv-delay': `${-delay}s` } as CSSProperties}
              >
                <VeggieCharacter
                  veggie={id}
                  mood={display.mood}
                  pose={display.pose}
                  phase={Math.max(1, display.phase)}
                  size={BASE}
                  animated={animated}
                  breathe={false}
                  delay={delay}
                />
              </div>
            </div>
          </div>
        </div>
        {showDrops && display.dropsNeeded > 0 && (
          <DropsRow
            filled={display.drops}
            total={display.dropsNeeded}
            newDrop={display.newDrop}
            size={size}
          />
        )}
        {display.regrowing && display.practicing && (
          <svg
            className="absolute"
            style={{ left: size * 0.22, bottom: size * 0.95 }}
            width={size * 0.2}
            height={size * 0.2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 1 L15 9 L23 9 L17 14 L19 22 L12 17 L5 22 L7 14 L1 9 L9 9 Z"
              fill="#f2c14e"
            />
          </svg>
        )}
        {display.fountainKey > 0 && (
          <svg
            key={display.fountainKey}
            className="absolute fv-fountain"
            style={{ left: -size * 0.25, bottom: size * 0.95 }}
            width={size * 0.5}
            height={size * 0.45}
            viewBox="0 0 100 90"
            aria-hidden="true"
          >
            <path
              d="M50 90 C 48 60 40 40 20 30"
              fill="none"
              stroke="#9cc7ee"
              strokeWidth={7}
              strokeLinecap="round"
            />
            <path
              d="M50 90 C 50 55 50 30 50 6"
              fill="none"
              stroke="#9cc7ee"
              strokeWidth={7}
              strokeLinecap="round"
            />
            <path
              d="M50 90 C 52 60 60 40 80 30"
              fill="none"
              stroke="#9cc7ee"
              strokeWidth={7}
              strokeLinecap="round"
            />
          </svg>
        )}
        <div
          className="fv-hit"
          data-tap="buddy"
          data-id={id}
          style={{ width: hitW, height: hitH }}
        />
      </div>
    </div>
  );
}
