import { computeProgress, type VeggieProgress } from '../../src/domain/growth';
import {
  computeMoments,
  pickMentor,
  revealableVeggies,
  toSeen,
  veggiesInMoments,
  type ProgressMap,
} from '../../src/domain/moments';
import type { GardenSnapshot, VeggieId } from '../../src/domain/types';
import { DAY, eat, eatsOnDays, SETTINGS, T0, at } from './helpers';

const now = new Date(T0 + 100 * DAY);
const order: VeggieId[] = ['wortel', 'broccoli', 'prei', 'tomaat', 'spinazie'];

function progress(count: number, id: VeggieId = 'wortel'): VeggieProgress {
  return computeProgress(eatsOnDays(id, count), [], SETTINGS, now);
}

function snapshot(map: ProgressMap): GardenSnapshot {
  const veggies: GardenSnapshot['veggies'] = {};
  for (const [id, p] of Object.entries(map) as [VeggieId, VeggieProgress][])
    veggies[id] = toSeen(p);
  return { childId: 'k1', seenAt: at(0), veggies };
}

const base = {
  order,
  reveal: true,
  includeMentor: true,
  seed: 'test',
};

describe('momenten (§7.4)', () => {
  it('ontdekking bij de eerste keer, met onthulling ervoor', () => {
    const current = { wortel: progress(1), broccoli: progress(0) };
    const moments = computeMoments({
      ...base,
      snapshot: undefined,
      current,
      revealable: new Set<VeggieId>(['wortel']),
    });
    expect(moments.map((m) => m.kind)).toEqual(['onthulling', 'ontdekking']);
    expect(moments[1]).toEqual({ kind: 'ontdekking', veggieIds: ['wortel'] });
  });

  it('druppel als er een registratie bij komt zonder groei; druppels samen', () => {
    const before = { wortel: progress(1), broccoli: progress(4) };
    const current = { wortel: progress(2), broccoli: progress(5) };
    const moments = computeMoments({
      ...base,
      snapshot: snapshot(before),
      current,
      revealable: new Set<VeggieId>(['wortel', 'broccoli']),
    });
    expect(moments.map((m) => m.kind)).toEqual(['onthulling', 'druppel']);
    expect(moments[1]).toEqual({
      kind: 'druppel',
      items: [
        { veggieId: 'wortel', from: 0, to: 1, needed: 3 },
        { veggieId: 'broccoli', from: 0, to: 1, needed: 3 },
      ],
    });
  });

  it('groei in de goede volgorde: onthulling → ontdekking → druppel → groei', () => {
    const before = { wortel: progress(3), broccoli: progress(1), prei: progress(0) };
    const current = { wortel: progress(4), broccoli: progress(2), prei: progress(1) };
    const moments = computeMoments({
      ...base,
      snapshot: snapshot(before),
      current,
      revealable: new Set<VeggieId>(['wortel', 'broccoli', 'prei']),
    });
    expect(moments.map((m) => m.kind)).toEqual(['onthulling', 'ontdekking', 'druppel', 'groei']);
    expect(moments[3]).toEqual({ kind: 'groei', veggieId: 'wortel', from: 1, to: 2 });
  });

  it('zonder onthulling als die uit staat', () => {
    const moments = computeMoments({
      ...base,
      reveal: false,
      snapshot: snapshot({ wortel: progress(3) }),
      current: { wortel: progress(4) },
      revealable: new Set<VeggieId>(['wortel']),
    });
    expect(moments.map((m) => m.kind)).toEqual(['groei']);
  });

  it('meerdere fases ineens worden één groeimoment naar de nieuwe fase', () => {
    const moments = computeMoments({
      ...base,
      snapshot: snapshot({ wortel: progress(1) }),
      current: { wortel: progress(10) },
      revealable: new Set(),
    });
    expect(moments).toEqual([{ kind: 'groei', veggieId: 'wortel', from: 1, to: 4 }]);
  });

  it('ontdekt en meteen gegroeid: eerst ontdekking, dan groei vanaf de mier', () => {
    const moments = computeMoments({
      ...base,
      snapshot: undefined,
      current: { wortel: progress(4) },
      revealable: new Set(),
    });
    expect(moments.map((m) => m.kind)).toEqual(['ontdekking', 'groei']);
    expect(moments[1]).toMatchObject({ from: 1, to: 2 });
  });

  it('niets afspelen als er niets veranderd is, of bij een daling', () => {
    const same = computeMoments({
      ...base,
      snapshot: snapshot({ wortel: progress(5) }),
      current: { wortel: progress(5) },
      revealable: new Set(),
    });
    expect(same).toEqual([]);
    const down = computeMoments({
      ...base,
      snapshot: snapshot({ wortel: progress(8) }),
      current: { wortel: progress(5) },
      revealable: new Set(),
    });
    expect(down).toEqual([]);
  });

  it('precies één keer: na het bijwerken van de snapshot zijn er geen momenten meer', () => {
    const current = { wortel: progress(4), broccoli: progress(1) };
    const first = computeMoments({ ...base, snapshot: undefined, current, revealable: new Set() });
    expect(first.length).toBeGreaterThan(0);
    const second = computeMoments({
      ...base,
      includeMentor: false,
      snapshot: snapshot(current),
      current,
      revealable: new Set(),
    });
    expect(second).toEqual([]);
  });

  it('de walvis bedankt met een fontein, en de mentor nodigt hoogstens één keer uit', () => {
    const before = { wortel: progress(25), broccoli: progress(0), prei: progress(7) };
    const current = { wortel: progress(26), broccoli: progress(0), prei: progress(7) };
    const moments = computeMoments({
      ...base,
      reveal: false,
      snapshot: snapshot(before),
      current,
      revealable: new Set(),
    });
    expect(moments.map((m) => m.kind)).toEqual(['fontein', 'mentor']);
    expect(moments.filter((m) => m.kind === 'mentor')).toHaveLength(1);
    expect(moments[1]).toMatchObject({ mentorId: 'wortel', targetId: 'broccoli', reason: 'klein' });

    const noMentor = computeMoments({
      ...base,
      includeMentor: false,
      reveal: false,
      snapshot: snapshot(before),
      current,
      revealable: new Set(),
    });
    expect(noMentor.map((m) => m.kind)).toEqual(['fontein']);
  });

  it('mentor kiest bij voorkeur een groente op Weer oefenen', () => {
    const current: ProgressMap = {
      wortel: progress(25),
      prei: { ...progress(1, 'prei') },
      broccoli: { ...progress(10, 'broccoli'), practicing: true, regrowing: true },
    };
    expect(pickMentor(current, order, 'x')).toMatchObject({
      targetId: 'broccoli',
      reason: 'oefenen',
    });
  });

  it('geen mentor zonder walvis', () => {
    expect(pickMentor({ wortel: progress(20) }, order, 'x')).toBeUndefined();
  });

  it('onthulling niet voor groenten uit de onboarding', () => {
    const events = [eat('wortel', at(1), 'k1', { source: 'start' }), eat('prei', at(1))];
    const current = { wortel: progress(1), prei: progress(1, 'prei') };
    const ids = revealableVeggies(events, 'k1', undefined, current);
    expect([...ids]).toEqual(['prei']);
  });

  it('weet welke vriendjes nog op hun oude stand moeten staan', () => {
    const moments = computeMoments({
      ...base,
      snapshot: snapshot({ wortel: progress(3), prei: progress(1, 'prei') }),
      current: {
        wortel: progress(4),
        prei: progress(2, 'prei'),
        broccoli: progress(1, 'broccoli'),
      },
      revealable: new Set(),
    });
    expect([...veggiesInMoments(moments)].sort()).toEqual(['broccoli', 'prei', 'wortel']);
  });
});
