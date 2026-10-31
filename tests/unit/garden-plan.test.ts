import { computeProgress } from '../../src/domain/growth';
import { toSeen } from '../../src/domain/moments';
import type { GardenSnapshot, VeggieId } from '../../src/domain/types';
import { buildVisitPlan } from '../../src/features/garden/plan';
import { DAY, eatsOnDays, SETTINGS, T0, at } from './helpers';

const now = new Date(T0 + 60 * DAY);
const ids: VeggieId[] = ['wortel', 'broccoli', 'prei'];
const settings = { reveal: true, perPhase: 3 as const, regrowPerPhase: 2 };

function progressOf(counts: Partial<Record<VeggieId, number>>) {
  return Object.fromEntries(
    ids.map((id) => [id, computeProgress(eatsOnDays(id, counts[id] ?? 0), [], SETTINGS, now)]),
  ) as Record<VeggieId, ReturnType<typeof computeProgress>>;
}

describe('bezoekplan', () => {
  it('toont eerst de oude stand voor vriendjes met een moment', () => {
    const before = progressOf({ wortel: 3, broccoli: 1 });
    const after = progressOf({ wortel: 4, broccoli: 1 });
    const snapshot: GardenSnapshot = {
      childId: 'k1',
      seenAt: at(1),
      veggies: {
        wortel: toSeen(before.wortel),
        broccoli: toSeen(before.broccoli),
        prei: toSeen(before.prei),
      },
    };
    const plan = buildVisitPlan({
      childId: 'k1',
      veggieIds: ids,
      progress: after,
      snapshot,
      events: eatsOnDays('wortel', 4),
      settings,
      includeMentor: true,
      playMoments: true,
      seed: 's',
    });
    expect(plan.moments.map((m) => m.kind)).toEqual(['onthulling', 'groei']);
    expect(plan.initial.wortel).toMatchObject({ phase: 1, drops: 2, spot: 'moestuin' });
    expect(plan.final.wortel).toMatchObject({ phase: 2, drops: 0, spot: 'thuis' });
    expect(plan.initial.broccoli).toMatchObject({ phase: 1 });
    expect(plan.silent).toEqual([]);
  });

  it('een daling speelt geen moment af maar wordt stil bijgewerkt', () => {
    const after = progressOf({ wortel: 5 });
    const snapshot: GardenSnapshot = {
      childId: 'k1',
      seenAt: at(1),
      veggies: { wortel: { phase: 3, drops: 0, count: 7 } },
    };
    const plan = buildVisitPlan({
      childId: 'k1',
      veggieIds: ['wortel'],
      progress: after,
      snapshot,
      events: [],
      settings,
      includeMentor: false,
      playMoments: true,
      seed: 's',
    });
    expect(plan.moments).toEqual([]);
    expect(plan.initial.wortel).toMatchObject({ phase: 2 });
    expect(plan.silent).toEqual([['wortel', toSeen(after.wortel)]]);
  });

  it('bij "Kijk wie er op je wacht" geen momenten en geen stille updates', () => {
    const plan = buildVisitPlan({
      childId: 'k1',
      veggieIds: ids,
      progress: progressOf({ wortel: 4 }),
      snapshot: undefined,
      events: [],
      settings,
      includeMentor: true,
      playMoments: false,
      seed: 's',
    });
    expect(plan.moments).toEqual([]);
    expect(plan.silent).toEqual([]);
    expect(plan.initial.wortel).toMatchObject({ phase: 2 });
  });

  it('de mentor spreekt na nieuwe momenten; zonder nieuwe momenten hoogstens één keer per dag', () => {
    const progress = progressOf({ wortel: 25, broccoli: 1 });
    const snapshot: GardenSnapshot = {
      childId: 'k1',
      seenAt: at(1),
      veggies: {
        wortel: toSeen(progress.wortel),
        broccoli: toSeen(progress.broccoli),
        prei: toSeen(progress.prei),
      },
    };
    const base = {
      childId: 'k1',
      veggieIds: ids,
      progress,
      snapshot,
      events: [],
      settings,
      includeMentor: true,
      playMoments: true,
      seed: 's',
    };
    expect(buildVisitPlan({ ...base, mentorShownToday: false }).moments.map((m) => m.kind)).toEqual(
      ['mentor'],
    );
    expect(buildVisitPlan({ ...base, mentorShownToday: true }).moments).toEqual([]);
    const more = progressOf({ wortel: 25, broccoli: 2 });
    expect(
      buildVisitPlan({ ...base, progress: more, mentorShownToday: true }).moments.map(
        (m) => m.kind,
      ),
    ).toEqual(['druppel', 'mentor']);
  });
});
