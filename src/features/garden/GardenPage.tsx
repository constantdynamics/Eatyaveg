/**
 * De tuin (kindscherm, §8): volledig scherm, geen leestekst, alles mag aangeraakt worden.
 * Alleen een kleine Ouder-knop (vasthouden) en een groot icoon om uit te zoomen.
 */
import { useEffect, useReducer, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { Map as MapIcon } from 'lucide-react';
import { cancelSpeech, playSound, speak, unlockAudio, type SoundName } from '../../audio';
import { lines, type LineList } from '../../content/lines';
import { powerText } from '../../content/phases';
import { VEGGIE_BY_ID } from '../../content/veggies';
import { computeChildProgress } from '../../domain/growth';
import {
  VEGGIE_IDS,
  type Child,
  type Phase,
  type SeenVeggie,
  type VeggieId,
} from '../../domain/types';
import { clock } from '../../lib/clock';
import { dayKey } from '../../lib/dates';
import { exitFullscreen } from '../../lib/fullscreen';
import { useAppStore } from '../../store/app-store';
import { useChild } from '../../store/selectors';
import { SkyLayer, FarHills, TreeLine, Ground } from './Backdrop';
import { BuddyView } from './BuddyView';
import { cameraFor, screenToWorld, worldTransform, type Camera, type Viewport } from './camera';
import { Confetti } from './Confetti';
import { FpsMeter } from './FpsMeter';
import { fpsEnabled } from './fps-flag';
import { ParentButton } from './ParentButton';
import { buildVisitPlan } from './plan';
import { modeFor, runFocus, runVisit, Skipped, type PlayerCtx } from './player';
import { initState, reducer } from './reducer';
import { SeedView } from './SeedView';
import type { BuddyDisplay, Fx, GardenMode } from './types';
import { useReducedMotion, useViewport } from './useViewport';
import { placeBuddy, WORLD, ZONES, zoneIndexAt } from './world';
import { ZoneObjects, type ObjectId } from './ZoneObjects';
import './garden.css';

const OBJECT_SOUND: Record<ObjectId, SoundName> = {
  gieter: 'druppel',
  schommel: 'woesj',
  glijbaan: 'woesj',
  bal: 'plop',
  'eend-1': 'kwaak',
  'eend-2': 'kwaak',
  lelie: 'pling',
  'bloemen-1': 'pling',
  'bloemen-2': 'pling',
  'bloemen-3': 'pling',
  vlinder: 'woesj',
  bankje: 'tik',
  boom: 'woesj',
};

const NO_NAMES: readonly string[] = [];

/** Wanneer sprak de mentor voor het laatst (per kind, alleen op dit apparaat)? */
function readMentorDay(childId: string): string | null {
  try {
    return localStorage.getItem(`fv:mentor:${childId}`);
  } catch {
    return null;
  }
}

function writeMentorDay(childId: string, day: string) {
  try {
    localStorage.setItem(`fv:mentor:${childId}`, day);
  } catch {
    // geen opslag: dan spreekt de mentor wat vaker
  }
}
const lastLine = new Map<string, string>();

/** Kies een variant, niet twee keer achter elkaar dezelfde. */
function pick(list: LineList): string {
  const key = list[0] ?? '';
  const options = list.length > 1 ? list.filter((l) => l !== lastLine.get(key)) : list;
  const line = options[Math.floor(Math.random() * options.length)] ?? '';
  lastLine.set(key, line);
  return line;
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new Skipped());
    const t = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(t);
        reject(new Skipped());
      },
      { once: true },
    );
  });
}

function enabledInOrder(enabled: readonly VeggieId[]): VeggieId[] {
  return VEGGIE_IDS.filter((id) => enabled.includes(id));
}

interface PointerInfo {
  x0: number;
  y0: number;
  x: number;
  y: number;
  t0: number;
  target: EventTarget | null;
}

function Garden({ child, focus }: { child: Child; focus?: VeggieId }) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const vp = useViewport(containerRef);
  const reduced = useReducedMotion();
  const markSeenStore = useAppStore((s) => s.markSeen);
  const parentNames = useAppStore((s) => s.settings.parentNames) ?? NO_NAMES;
  const [showFps] = useState(fpsEnabled);

  const [plan] = useState(() => {
    const s = useAppStore.getState();
    const ids = enabledInOrder(s.settings.enabledVeggies);
    const progress = computeChildProgress(
      child.id,
      s.eatEvents,
      s.practiceEvents,
      ids,
      s.settings,
      clock.now(),
    );
    return {
      ids,
      progress,
      visit: buildVisitPlan({
        childId: child.id,
        veggieIds: ids,
        progress,
        snapshot: s.snapshots[child.id],
        events: s.eatEvents,
        settings: s.settings,
        includeMentor: true,
        mentorShownToday: readMentorDay(child.id) === dayKey(clock.now()),
        playMoments: !focus,
        seed: `${child.id}:${dayKey(clock.now())}`,
      }),
    };
  });

  const [state, dispatch] = useReducer(reducer, plan.visit, initState);
  const displays = useRef<Partial<Record<VeggieId, BuddyDisplay>>>({ ...plan.visit.initial });
  const fxCounter = useRef(1);
  const skip = useRef<AbortController | null>(null);
  const visitRef = useRef<AbortController | null>(null);
  const playing = useRef(true);
  const timers = useRef<number[]>([]);
  const cameraRef = useRef<{ cam: Camera; vp: Viewport }>({ cam: { x: 0, y: 0, scale: 1 }, vp });
  const modeRef = useRef<GardenMode>(state.mode);

  /** Bovenkant van de hoogste vriendjes per zone, zodat de zone niet te veel lucht toont. */
  const contentTop = (zone: number) => {
    let top: number = WORLD.horizon;
    for (const id of plan.ids) {
      const d = state.buddies[id];
      if (!d || d.spot === 'bed') continue;
      const pl = placeBuddy(id, d.phase, d.spot);
      if (zoneIndexAt(pl.x) === zone) top = Math.min(top, pl.y - pl.size);
    }
    return top;
  };
  const camera = cameraFor(vp, state.mode, contentTop);
  useEffect(() => {
    cameraRef.current = { cam: camera, vp };
    modeRef.current = state.mode;
    playing.current = state.playing;
  });

  const patch = (id: VeggieId, p: Partial<BuddyDisplay>) => {
    const prev = displays.current[id];
    if (!prev) return;
    displays.current[id] = { ...prev, ...p };
    dispatch({ type: 'patch', id, patch: p });
  };
  const fx = (id: VeggieId, kind: Fx) => patch(id, { fx: kind, fxKey: fxCounter.current++ });
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const say = (list: LineList) => {
    if (!useAppStore.getState().settings.speech) return;
    void speak(pick(list));
  };
  const sound = (name: SoundName) => {
    if (useAppStore.getState().settings.sound) playSound(name);
  };

  // Het bezoek: groeten, momenten (of de close-up bij "Kijk wie er op je wacht").
  useEffect(() => {
    const visit = new AbortController();
    visitRef.current = visit;
    const ctx: PlayerCtx = {
      visit: visit.signal,
      setMode: (mode, ms) => dispatch({ type: 'mode', mode, ms }),
      patch,
      patchAll: (p) => {
        for (const id of Object.keys(displays.current) as VeggieId[]) {
          const prev = displays.current[id];
          if (prev && prev.phase > 0) displays.current[id] = { ...prev, ...p };
        }
        dispatch({ type: 'patchAll', patch: p });
      },
      fx,
      say: async (list, signal) => {
        const text = pick(list);
        if (!useAppStore.getState().settings.speech) {
          await sleep(Math.min(1800, 500 + text.length * 25), signal);
          return;
        }
        await speak(text, { signal });
        if (signal.aborted) throw new Skipped();
      },
      sound,
      wait: sleep,
      confetti: () => dispatch({ type: 'confetti' }),
      dim: (id) => dispatch({ type: 'dim', id }),
      markSeen: (id: VeggieId, seen: SeenVeggie) => markSeenStore(child.id, id, seen),
      display: (id) => displays.current[id],
      setSkip: (c) => {
        skip.current = c;
      },
      markMentor: () => writeMentorDay(child.id, dayKey(clock.now())),
      reducedMotion: reduced,
      childName: child.spokenName || child.name,
      parentNames,
      progress: plan.progress,
    };
    dispatch({ type: 'playing', value: true });
    const run = focus ? runFocus(ctx, focus) : runVisit(ctx, plan.visit);
    run
      .then((end) => {
        if (visit.signal.aborted) return;
        dispatch({ type: 'mode', mode: end });
        dispatch({ type: 'playing', value: false });
      })
      .catch(() => undefined);
    return () => {
      visit.abort();
      cancelSpeech();
    };
    // Eén keer per bezoek.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  // In rust: af en toe wandelt één vriendje, zwaait het of laat het zijn kracht zien.
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (playing.current) return;
      const mode = modeRef.current;
      const ids = (Object.keys(displays.current) as VeggieId[]).filter((id) => {
        const d = displays.current[id]!;
        if (d.phase === 0 || d.pose !== 'staan') return false;
        if (mode.kind === 'overzicht') return true;
        return zoneIndexAt(placeBuddy(id, d.phase, d.spot).x) === mode.zone;
      });
      const id = ids[Math.floor(Math.random() * ids.length)];
      if (!id) return;
      const roll = Math.random();
      if (roll < 0.45) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        patch(id, { pose: 'lopen', idleOffset: dir * 40 });
        later(2300, () => patch(id, { idleOffset: 0 }));
        later(4600, () => patch(id, { pose: 'staan' }));
      } else if (roll < 0.75) {
        patch(id, { pose: 'zwaaien' });
        later(2200, () => patch(id, { pose: 'staan' }));
      } else {
        patch(id, { pose: 'kracht', mood: 'trots' });
        later(2600, () => patch(id, { pose: 'staan', mood: 'blij' }));
      }
    }, 7500);
    return () => clearInterval(timer);
  }, [reduced]);

  const exit = () => {
    // Eerst het hele bezoek stoppen: een moment dat niet af is, blijft dan bewaard voor de
    // volgende keer (en wordt niet als gezien opgeslagen).
    visitRef.current?.abort();
    cancelSpeech();
    exitFullscreen();
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) void navigate(-1);
    else void navigate('/', { replace: true });
  };

  const setMode = (mode: GardenMode, ms?: number) => dispatch({ type: 'mode', mode, ms });

  const onBuddyTap = (id: VeggieId) => {
    const d = displays.current[id];
    if (!d || d.phase === 0) return;
    const v = VEGGIE_BY_ID[id];
    const mode = modeRef.current;
    if (mode.kind === 'closeup' && mode.id === id) {
      patch(id, { pose: 'kracht', mood: 'trots' });
      fx(id, 'jump');
      sound('giechel');
      say(
        lines.power(v.buddyName, powerText(Math.max(1, d.phase) as Exclude<Phase, 0>, parentNames)),
      );
      later(2800, () => patch(id, { pose: 'staan', mood: 'blij' }));
      return;
    }
    setMode(modeFor(id, d));
    patch(id, { pose: 'zwaaien' });
    fx(id, 'giggle');
    sound('giechel');
    say(d.practicing && d.regrowing ? lines.practice(v.buddyName) : lines.touch(v.buddyName));
    later(2400, () => patch(id, { pose: 'staan' }));
  };

  const onSeedTap = (id: VeggieId) => {
    fx(id, 'wiggle');
    sound('tik');
    say(lines.touchSeed());
  };

  const onObjectTap = (id: ObjectId) => {
    dispatch({ type: 'object', id });
    sound(OBJECT_SOUND[id]);
  };

  const onBackgroundTap = (sx: number, sy: number) => {
    const mode = modeRef.current;
    const { cam, vp: v } = cameraRef.current;
    if (mode.kind === 'overzicht') {
      const p = screenToWorld(cam, v, sx, sy);
      setMode({ kind: 'zone', zone: zoneIndexAt(p.x) });
    } else if (mode.kind === 'closeup' || mode.kind === 'regio') {
      setMode({ kind: 'zone', zone: mode.zone });
    }
  };

  const handleTap = (target: EventTarget | null, sx: number, sy: number) => {
    if (playing.current) {
      skip.current?.abort();
      cancelSpeech();
      return;
    }
    const el = target instanceof Element ? target.closest('[data-tap]') : null;
    const kind = el?.getAttribute('data-tap');
    if (kind === 'buddy') onBuddyTap(el!.getAttribute('data-id') as VeggieId);
    else if (kind === 'seed') onSeedTap(el!.getAttribute('data-id') as VeggieId);
    else if (kind === 'object') onObjectTap(el!.getAttribute('data-object') as ObjectId);
    else onBackgroundTap(sx, sy);
  };

  // Vegen naar de buurzone, knijpen om uit te zoomen, tikken.
  const pointers = useRef(new Map<number, PointerInfo>());
  const gesture = useRef<{ kind: 'tap' | 'drag' | 'pinch'; startDist: number; lastDist: number }>({
    kind: 'tap',
    startDist: 0,
    lastDist: 0,
  });

  const applyDrag = (dxPx: number) => {
    const { cam, vp: v } = cameraRef.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transitionDuration = '0ms';
    el.style.transform = worldTransform({ ...cam, x: cam.x - dxPx / cam.scale }, v);
  };

  const endDrag = (dxPx: number, velocity: number) => {
    const el = worldRef.current;
    if (el) el.style.transitionDuration = '';
    const mode = modeRef.current;
    const zone = mode.kind === 'overzicht' ? 0 : mode.zone;
    const swipe = Math.abs(dxPx) > 70 || Math.abs(velocity) > 0.45;
    const dir = dxPx < 0 ? 1 : -1;
    const next = swipe ? Math.max(0, Math.min(ZONES.length - 1, zone + dir)) : zone;
    setMode({ kind: 'zone', zone: next }, 700);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    unlockAudio();
    pointers.current.set(e.pointerId, {
      x0: e.clientX,
      y0: e.clientY,
      x: e.clientX,
      y: e.clientY,
      t0: e.timeStamp,
      target: e.target,
    });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      gesture.current = { kind: 'pinch', startDist: d, lastDist: d };
    } else if (pointers.current.size === 1) {
      gesture.current = { kind: 'tap', startDist: 0, lastDist: 0 };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    const g = gesture.current;
    if (g.kind === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      g.lastDist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      return;
    }
    if (playing.current || modeRef.current.kind === 'overzicht') return;
    const dx = p.x - p.x0;
    if (g.kind === 'tap' && Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(p.y - p.y0))
      g.kind = 'drag';
    if (g.kind === 'drag') applyDrag(dx);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const p = pointers.current.get(e.pointerId);
    pointers.current.delete(e.pointerId);
    if (!p) return;
    const g = gesture.current;
    if (g.kind === 'pinch') {
      if (pointers.current.size > 0) return;
      const ratio = g.startDist > 0 ? g.lastDist / g.startDist : 1;
      const mode = modeRef.current;
      if (ratio < 0.8 && mode.kind !== 'overzicht' && !playing.current)
        setMode({ kind: 'overzicht' });
      else if (ratio > 1.25 && mode.kind === 'overzicht' && !playing.current) {
        const { cam, vp: v } = cameraRef.current;
        setMode({ kind: 'zone', zone: zoneIndexAt(screenToWorld(cam, v, p.x, p.y).x) });
      }
      gesture.current = { kind: 'tap', startDist: 0, lastDist: 0 };
      return;
    }
    if (g.kind === 'drag') {
      const dt = Math.max(1, e.timeStamp - p.t0);
      endDrag(p.x - p.x0, (p.x - p.x0) / dt);
      gesture.current = { kind: 'tap', startDist: 0, lastDist: 0 };
      return;
    }
    handleTap(p.target, e.clientX, e.clientY);
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (gesture.current.kind === 'drag') endDrag(0, 0);
    gesture.current = { kind: 'tap', startDist: 0, lastDist: 0 };
  };

  const overview = state.mode.kind === 'overzicht';
  // Bij prefers-reduced-motion korte overgangen (§8.4).
  const camMs = reduced ? Math.min(state.camMs, 250) : state.camMs;
  const currentZone = state.mode.kind === 'overzicht' ? -1 : state.mode.zone;
  const hitMin = 88 / camera.scale;
  const minSize = overview ? 30 / camera.scale : 0;
  const parallax = (f: number) => ({
    transform: `translate3d(${(camera.x - WORLD.width / 2) * (1 - f)}px, 0, 0)`,
    transitionDuration: `${camMs}ms`,
  });
  const closeupId = state.mode.kind === 'closeup' ? state.mode.id : undefined;

  return (
    <div
      ref={containerRef}
      className={`fv-garden ${overview ? 'fv-garden--overview' : ''}`}
      role="application"
      aria-label={`Groentetuin van ${child.name}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      data-playing={state.playing ? 'ja' : 'nee'}
      data-mode={state.mode.kind}
    >
      <div
        ref={worldRef}
        className={`fv-world ${camMs > 0 ? 'fv-world--animate' : ''}`}
        style={{ transform: worldTransform(camera, vp), transitionDuration: `${camMs}ms` }}
      >
        <SkyLayer />
        <div className="fv-parallax absolute left-0 top-0" style={parallax(0.4)}>
          <FarHills />
        </div>
        <div className="fv-parallax absolute left-0 top-0" style={parallax(0.7)}>
          <TreeLine />
        </div>
        <Ground />
        <ZoneObjects active={state.objects} />
        {plan.ids.map((id, i) => {
          const d = state.buddies[id];
          if (!d) return null;
          const focusHere = state.dim === id || (state.dim === null && state.lastDim === id);
          if (d.spot === 'bed') {
            const pl = placeBuddy(id, 0, 'bed');
            return (
              <SeedView
                key={id}
                id={id}
                x={pl.x}
                y={pl.y}
                fx={d.fx}
                fxKey={d.fxKey}
                focus={focusHere}
                hitMin={hitMin}
              />
            );
          }
          const pl = placeBuddy(id, d.phase, d.spot);
          return (
            <BuddyView
              key={id}
              id={id}
              x={pl.x}
              y={pl.y}
              size={Math.max(pl.size, minSize)}
              display={d}
              showDrops={!overview && zoneIndexAt(pl.x) === currentZone}
              showAnimal={d.showAnimal || closeupId === id}
              focus={focusHere}
              hitMin={hitMin}
              delay={i * 0.53}
              animated
            />
          );
        })}
        <div className={`fv-dim ${state.dim ? 'fv-dim--on' : ''}`} />
      </div>
      <Confetti burst={state.confetti} />
      <ParentButton onExit={exit} />
      {!overview && !state.playing && (
        <button
          type="button"
          className="fv-zoomout"
          aria-label="Hele tuin bekijken"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={() => setMode({ kind: 'overzicht' })}
        >
          <MapIcon size={34} strokeWidth={2.2} color="#5f574c" aria-hidden="true" />
        </button>
      )}
      {showFps && <FpsMeter />}
    </div>
  );
}

export default function GardenPage() {
  const { kindId } = useParams();
  const [params] = useSearchParams();
  const child = useChild(kindId);
  const enabled = useAppStore((s) => s.settings.enabledVeggies);
  if (!child) return <Navigate to="/" replace />;
  const focusParam = params.get('focus');
  const focus =
    focusParam &&
    (VEGGIE_IDS as readonly string[]).includes(focusParam) &&
    enabled.includes(focusParam as VeggieId)
      ? (focusParam as VeggieId)
      : undefined;
  return <Garden key={`${child.id}:${focus ?? ''}`} child={child} focus={focus} />;
}
