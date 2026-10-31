/**
 * Momentenspeler (§7.4). Speelt de momenten één keer en in vaste volgorde af; elke tik slaat
 * het lopende moment over (eindstand wordt dan direct getoond). De snapshot wordt per moment
 * bijgewerkt zodra het is afgespeeld, zodat niets dubbel of helemaal niet te zien is.
 */
import type { SoundName } from '../../audio';
import { joinNames, lines, type LineList } from '../../content/lines';
import { phaseDef, powerText } from '../../content/phases';
import { VEGGIE_BY_ID } from '../../content/veggies';
import { toSeen, type Moment } from '../../domain/moments';
import type { Phase, SeenVeggie, VeggieId } from '../../domain/types';
import type { VeggieProgress } from '../../domain/growth';
import type { BuddyDisplay, Fx, GardenMode } from './types';
import type { VisitPlan } from './plan';
import { BED, placeBuddy, zoneIndexAt } from './world';

export class Skipped extends Error {}

export interface PlayerCtx {
  /** Signaal van het hele bezoek (afbreken bij verlaten van de tuin). */
  visit: AbortSignal;
  setMode(mode: GardenMode, ms?: number): void;
  patch(id: VeggieId, p: Partial<BuddyDisplay>): void;
  patchAll(p: Partial<BuddyDisplay>): void;
  fx(id: VeggieId, fx: Fx): void;
  say(lines: LineList, signal: AbortSignal): Promise<void>;
  sound(name: SoundName): void;
  wait(ms: number, signal: AbortSignal): Promise<void>;
  confetti(): void;
  dim(id: VeggieId | null): void;
  markSeen(id: VeggieId, seen: SeenVeggie): void;
  display(id: VeggieId): BuddyDisplay | undefined;
  /** Het lopende moment overslaan (tik). */
  setSkip(controller: AbortController | null): void;
  /** Onthouden dat de mentor vandaag sprak. */
  markMentor(): void;
  reducedMotion: boolean;
  childName: string;
  parentNames: readonly string[];
  progress: Partial<Record<VeggieId, VeggieProgress>>;
}

export function modeFor(id: VeggieId, d: Pick<BuddyDisplay, 'phase' | 'spot'>): GardenMode {
  const pl = placeBuddy(id, d.phase, d.spot);
  const size = d.spot === 'bed' ? 110 : pl.size;
  return { kind: 'closeup', id, zone: zoneIndexAt(pl.x), x: pl.x, y: pl.y, size };
}

/** Rechthoek om een paar vriendjes heen, met wat ruimte. */
function regionAround(boxes: { x0: number; x1: number; y0: number; y1: number }[]): GardenMode {
  let x0 = Math.min(...boxes.map((b) => b.x0));
  let x1 = Math.max(...boxes.map((b) => b.x1));
  let y0 = Math.min(...boxes.map((b) => b.y0));
  const y1 = Math.max(...boxes.map((b) => b.y1));
  if (x1 - x0 < 380) {
    const c = (x0 + x1) / 2;
    x0 = c - 190;
    x1 = c + 190;
  }
  if (y1 - y0 < 240) y0 = y1 - 240;
  return { kind: 'regio', zone: zoneIndexAt((x0 + x1) / 2), region: { x0, x1, y0, y1 } };
}

function groupMode(ids: VeggieId[], ctx: PlayerCtx): GardenMode {
  if (ids.length === 1) {
    const d = ctx.display(ids[0]!);
    if (d) return modeFor(ids[0]!, d);
  }
  const boxes = ids.map((id) => {
    const d = ctx.display(id);
    const pl = placeBuddy(id, d?.phase ?? 0, d?.spot);
    const size = d?.spot === 'bed' ? 70 : pl.size;
    return {
      x0: pl.x - size * 0.8,
      x1: pl.x + size * 0.8,
      y0: pl.y - size * 1.2,
      y1: pl.y + 40,
      zone: zoneIndexAt(pl.x),
    };
  });
  if (new Set(boxes.map((b) => b.zone)).size > 1) return { kind: 'overzicht' };
  return regionAround(boxes);
}

/** Het stukje moestuinbed waar de zaadjes openspringen. */
function bedRegion(ids: VeggieId[]): GardenMode {
  return regionAround(
    ids.map((id) => {
      const x = placeBuddy(id, 0, 'bed').x;
      return { x0: x - 90, x1: x + 90, y0: BED.top - 170, y1: BED.top + 60 };
    }),
  );
}

function buddyName(id: VeggieId) {
  return VEGGIE_BY_ID[id].buddyName;
}

function finalSeen(ctx: PlayerCtx, id: VeggieId): SeenVeggie | undefined {
  const p = ctx.progress[id];
  return p ? toSeen(p) : undefined;
}

function settle(ctx: PlayerCtx, plan: VisitPlan, ids: Iterable<VeggieId>) {
  for (const id of ids) {
    const f = plan.final[id];
    if (f) ctx.patch(id, { ...f, fx: undefined, newDrop: undefined });
    const seen = finalSeen(ctx, id);
    if (seen) ctx.markSeen(id, seen);
  }
}

async function reveal(
  ctx: PlayerCtx,
  m: Extract<Moment, { kind: 'onthulling' }>,
  signal: AbortSignal,
) {
  ctx.setMode(groupMode(m.veggieIds, ctx));
  for (const id of m.veggieIds) ctx.patch(id, { mood: 'verrast' });
  await ctx.wait(900, signal);
  const spoken = m.veggieIds.map((id) => VEGGIE_BY_ID[id].spoken);
  await ctx.say(lines.reveal(joinNames(spoken)), signal);
  for (const id of m.veggieIds) ctx.patch(id, { mood: 'blij' });
  await ctx.wait(300, signal);
}

async function discovery(
  ctx: PlayerCtx,
  plan: VisitPlan,
  m: Extract<Moment, { kind: 'ontdekking' }>,
  signal: AbortSignal,
) {
  ctx.setMode(bedRegion(m.veggieIds));
  await ctx.wait(1000, signal);
  for (const id of m.veggieIds) {
    ctx.fx(id, 'wiggle');
    ctx.sound('tik');
    await ctx.wait(650, signal);
    const f = plan.final[id];
    // Het vriendje springt uit de grond, zo klein als een mier (eventuele groei volgt apart).
    ctx.patch(id, {
      phase: 1,
      spot: 'moestuin',
      drops: f && f.phase === 1 ? f.drops : 0,
      dropsNeeded: f && f.phase === 1 ? f.dropsNeeded : 3,
      mood: 'juichend',
      pose: 'zwaaien',
    });
    ctx.fx(id, 'pop');
    ctx.sound('plop');
    await ctx.wait(m.veggieIds.length > 2 ? 300 : 550, signal);
  }
  await ctx.say(
    m.veggieIds.length === 1 ? lines.discovery(buddyName(m.veggieIds[0]!)) : lines.discoveryMany(),
    signal,
  );
  await ctx.wait(400, signal);
  for (const id of m.veggieIds) {
    ctx.patch(id, { mood: 'blij', pose: 'staan' });
    const f = plan.final[id];
    if (f && f.phase === 1) ctx.markSeen(id, finalSeen(ctx, id)!);
    else ctx.markSeen(id, { phase: 1, drops: 0, count: 1 });
  }
}

async function drops(ctx: PlayerCtx, m: Extract<Moment, { kind: 'druppel' }>, signal: AbortSignal) {
  ctx.setMode(
    groupMode(
      m.items.map((i) => i.veggieId),
      ctx,
    ),
  );
  await ctx.wait(1000, signal);
  for (const item of m.items) {
    ctx.patch(item.veggieId, { drops: item.to, newDrop: item.to - 1, mood: 'juichend' });
    ctx.fx(item.veggieId, 'jump');
    ctx.sound('druppel');
    await ctx.wait(380, signal);
  }
  await ctx.say(lines.drop(), signal);
  for (const item of m.items) {
    ctx.patch(item.veggieId, { mood: 'blij', newDrop: undefined });
    const seen = finalSeen(ctx, item.veggieId);
    if (seen) ctx.markSeen(item.veggieId, seen);
  }
}

async function growth(
  ctx: PlayerCtx,
  plan: VisitPlan,
  m: Extract<Moment, { kind: 'groei' }>,
  signal: AbortSignal,
  compact = false,
) {
  const id = m.veggieId;
  const before = ctx.display(id);
  if (!before) return;
  const startSpot = before.spot === 'bed' ? 'moestuin' : before.spot;
  ctx.dim(id);
  ctx.setMode(modeFor(id, { phase: m.from, spot: startSpot }));
  await ctx.wait(1100, signal);

  // De laatste druppel vult zich…
  ctx.patch(id, {
    mood: 'juichend',
    drops: before.dropsNeeded || 3,
    newDrop: (before.dropsNeeded || 3) - 1,
  });
  ctx.sound('druppel');
  await ctx.wait(600, signal);

  // …en het vriendje groeit, met een vreugdedansje, confetti en een deuntje.
  const final = plan.final[id];
  ctx.patch(id, {
    phase: m.to,
    drops: 0,
    newDrop: undefined,
    dropsNeeded: final?.dropsNeeded ?? 3,
    pose: ctx.reducedMotion ? 'zwaaien' : 'dansen',
    spot: startSpot,
  });
  ctx.fx(id, 'jump');
  ctx.sound('groei');
  if (!ctx.reducedMotion) ctx.confetti();
  ctx.setMode(modeFor(id, { phase: m.to, spot: startSpot }), 700);
  await ctx.wait(compact ? 1200 : 1600, signal);

  const to = Math.max(1, m.to) as Exclude<Phase, 0>;
  ctx.patch(id, { pose: 'staan', mood: 'blij', showAnimal: true });
  await ctx.say(lines.growth(buddyName(id), phaseDef(to).animalWithArticle), signal);
  ctx.patch(id, { pose: 'kracht', mood: 'trots' });
  // Bij een lang bezoek laten we de kracht zien zonder hem ook uit te spreken.
  if (compact) await ctx.wait(1500, signal);
  else await ctx.say(lines.power(buddyName(id), powerText(to, ctx.parentNames)), signal);
  await ctx.wait(compact ? 300 : 700, signal);
  ctx.patch(id, { pose: 'staan', mood: 'blij', showAnimal: false });

  // Van de moestuin naar de eigen plek in de tuin.
  if (startSpot === 'moestuin' && m.to >= 2) {
    const from = placeBuddy(id, m.to, 'moestuin');
    const home = placeBuddy(id, m.to, 'thuis');
    ctx.patch(id, {
      spot: 'thuis',
      travel: { dx: from.x - home.x, dy: from.y - home.y },
      pose: 'lopen',
    });
    await ctx.wait(50, signal);
    ctx.patch(id, { travel: { dx: 0, dy: 0 } });
    ctx.setMode(modeFor(id, { phase: m.to, spot: 'thuis' }), 2200);
    await ctx.wait(2300, signal);
    ctx.patch(id, { pose: 'zwaaien' });
    await ctx.wait(compact ? 300 : 800, signal);
  }
  ctx.dim(null);
  settle(ctx, plan, [id]);
}

async function fountain(
  ctx: PlayerCtx,
  plan: VisitPlan,
  m: Extract<Moment, { kind: 'fontein' }>,
  signal: AbortSignal,
) {
  const id = m.veggieIds[0]!;
  const d = ctx.display(id);
  if (!d) return;
  ctx.dim(id);
  ctx.setMode(modeFor(id, d));
  await ctx.wait(1100, signal);
  ctx.patch(id, { fountainKey: (d.fountainKey ?? 0) + 1, mood: 'juichend' });
  ctx.fx(id, 'jump');
  ctx.sound('fontein');
  await ctx.say(lines.fountain(), signal);
  ctx.dim(null);
  settle(ctx, plan, m.veggieIds);
}

async function mentor(ctx: PlayerCtx, m: Extract<Moment, { kind: 'mentor' }>, signal: AbortSignal) {
  const md = ctx.display(m.mentorId);
  const td = ctx.display(m.targetId);
  if (!md || !td) return;
  ctx.markMentor();
  ctx.dim(m.mentorId);
  ctx.setMode(modeFor(m.mentorId, md));
  await ctx.wait(1100, signal);
  ctx.patch(m.mentorId, { pose: 'zwaaien', mood: 'trots' });
  const target = VEGGIE_BY_ID[m.targetId];
  await ctx.say(
    m.reason === 'oefenen'
      ? lines.mentorPractice(target.buddyName, target.spoken)
      : td.phase === 0
        ? lines.mentorSeed(target.spoken)
        : lines.mentor(target.buddyName, target.spoken),
    signal,
  );
  ctx.patch(m.mentorId, { pose: 'staan', mood: 'blij' });
  ctx.dim(m.targetId);
  ctx.setMode(modeFor(m.targetId, td));
  await ctx.wait(1000, signal);
  if (td.phase === 0) ctx.fx(m.targetId, 'wiggle');
  else ctx.patch(m.targetId, { pose: 'zwaaien' });
  await ctx.wait(1500, signal);
  ctx.patch(m.targetId, { pose: 'staan' });
  ctx.dim(null);
}

function idsOf(m: Moment): VeggieId[] {
  switch (m.kind) {
    case 'onthulling':
    case 'ontdekking':
    case 'fontein':
      return m.veggieIds;
    case 'druppel':
      return m.items.map((i) => i.veggieId);
    case 'groei':
      return [m.veggieId];
    case 'mentor':
      return [m.mentorId, m.targetId];
  }
}

async function playMoment(
  ctx: PlayerCtx,
  plan: VisitPlan,
  m: Moment,
  signal: AbortSignal,
  compact: boolean,
) {
  switch (m.kind) {
    case 'onthulling':
      return reveal(ctx, m, signal);
    case 'ontdekking':
      return discovery(ctx, plan, m, signal);
    case 'druppel':
      return drops(ctx, m, signal);
    case 'groei':
      return growth(ctx, plan, m, signal, compact);
    case 'fontein':
      return fountain(ctx, plan, m, signal);
    case 'mentor':
      return mentor(ctx, m, signal);
  }
}

/** Groeten, daarna alle momenten. Geeft de zone terug waar het bezoek eindigt. */
export async function runVisit(ctx: PlayerCtx, plan: VisitPlan): Promise<GardenMode> {
  for (const [id, seen] of plan.silent) ctx.markSeen(id, seen);

  // Bij openen zwaaien de vriendjes en maken ze een geluidje.
  const greet = new AbortController();
  ctx.setSkip(greet);
  ctx.setMode({ kind: 'overzicht' }, 0);
  try {
    await ctx.wait(500, greet.signal);
    ctx.patchAll({ pose: 'zwaaien' });
    ctx.sound('pling');
    await ctx.say(lines.greet(ctx.childName), greet.signal);
    await ctx.wait(plan.moments.length > 0 ? 300 : 900, greet.signal);
  } catch (error) {
    if (ctx.visit.aborted) throw error;
  }
  ctx.patchAll({ pose: 'staan' });

  let last: GardenMode = { kind: 'zone', zone: plan.startZone };
  // Houd het geheel kort (richtlijn hooguit 45 s): na twee groeimomenten of 25 s compacter.
  const started = performance.now();
  let growths = 0;
  for (const m of plan.moments) {
    if (ctx.visit.aborted) throw new Skipped();
    const elapsed = performance.now() - started;
    if (m.kind === 'mentor' && elapsed > 38_000) continue;
    if (m.kind === 'groei') growths += 1;
    const compact = m.kind === 'groei' && (growths > 2 || elapsed > 25_000);
    const controller = new AbortController();
    const onVisitAbort = () => controller.abort();
    ctx.visit.addEventListener('abort', onVisitAbort, { once: true });
    ctx.setSkip(controller);
    try {
      await playMoment(ctx, plan, m, controller.signal, compact);
    } catch (error) {
      if (ctx.visit.aborted) throw error;
    } finally {
      ctx.visit.removeEventListener('abort', onVisitAbort);
    }
    // Eindstand altijd goed zetten, ook na overslaan.
    ctx.dim(null);
    if (m.kind !== 'mentor' && m.kind !== 'onthulling') settle(ctx, plan, idsOf(m));
    else for (const id of idsOf(m)) ctx.patch(id, { pose: 'staan', mood: 'blij', fx: undefined });
    const focusId = idsOf(m)[idsOf(m).length - 1]!;
    const d = ctx.display(focusId);
    if (d) last = { kind: 'zone', zone: zoneIndexAt(placeBuddy(focusId, d.phase, d.spot).x) };
  }
  ctx.setSkip(null);
  return last;
}

/** "Kijk wie er op je wacht": direct in close-up bij die groente (§8.3). */
export async function runFocus(ctx: PlayerCtx, id: VeggieId): Promise<GardenMode> {
  const d = ctx.display(id);
  if (!d) return { kind: 'zone', zone: 0 };
  const controller = new AbortController();
  ctx.setSkip(controller);
  ctx.setMode(modeFor(id, d), 0);
  try {
    await ctx.wait(700, controller.signal);
    ctx.sound('pling');
    if (d.phase === 0) {
      ctx.fx(id, 'wiggle');
      await ctx.say(lines.beforeDinnerSeed(VEGGIE_BY_ID[id].spoken), controller.signal);
    } else {
      ctx.patch(id, { pose: 'zwaaien', mood: 'blij' });
      await ctx.say(lines.beforeDinner(buddyName(id)), controller.signal);
    }
    await ctx.wait(1200, controller.signal);
  } catch (error) {
    if (ctx.visit.aborted) throw error;
  }
  ctx.patch(id, { pose: 'staan' });
  ctx.setSkip(null);
  return modeFor(id, ctx.display(id) ?? d);
}
