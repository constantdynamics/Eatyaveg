import { computeChildProgress, computeProgress, phaseFromCount } from '../../src/domain/growth';
import { at, DAY, eat, eatsOnDays, practice, SETTINGS, T0 } from './helpers';

const later = (days: number) => new Date(T0 + days * DAY);

describe('groei zonder Weer oefenen (§7.1)', () => {
  it('een nooit gegeten groente is een zaadje (fase 0), geen mier', () => {
    const p = computeProgress([], [], SETTINGS, later(0));
    expect(p).toMatchObject({ phase: 0, drops: 0, dropsNeeded: 0, count: 0 });
  });

  it('de eerste registratie maakt er fase 1 (mier) van', () => {
    const p = computeProgress(eatsOnDays('wortel', 1), [], SETTINGS, later(1));
    expect(p).toMatchObject({ phase: 1, drops: 0, dropsNeeded: 3, record: 1 });
  });

  it('elke 3 registraties een fase verder, met druppels als tussenstap', () => {
    const expectations: [number, number, number][] = [
      // [aantal, fase, druppels]
      [2, 1, 1],
      [3, 1, 2],
      [4, 2, 0],
      [7, 3, 0],
      [9, 3, 2],
      [24, 8, 2],
      [25, 9, 0],
    ];
    for (const [count, phase, drops] of expectations) {
      const p = computeProgress(eatsOnDays('wortel', count), [], SETTINGS, later(40));
      expect({ count, phase: p.phase, drops: p.drops }).toEqual({ count, phase, drops });
    }
  });

  it('met 2 per fase gaat het sneller', () => {
    const settings = { ...SETTINGS, perPhase: 2 as const };
    expect(computeProgress(eatsOnDays('wortel', 3), [], settings, later(5)).phase).toBe(2);
    expect(computeProgress(eatsOnDays('wortel', 17), [], settings, later(20)).phase).toBe(9);
  });

  it('na de walvis telt alles nog mee, maar groeit er niets meer', () => {
    const p = computeProgress(eatsOnDays('wortel', 40), [], SETTINGS, later(50));
    expect(p).toMatchObject({ phase: 9, maxed: true, count: 40, drops: 0, dropsNeeded: 0 });
  });

  it('de simulatie komt overeen met de formule uit §7.1', () => {
    for (let count = 0; count <= 30; count++) {
      for (const perPhase of [2, 3] as const) {
        const p = computeProgress(
          eatsOnDays('prei', count),
          [],
          { ...SETTINGS, perPhase },
          later(60),
        );
        const f = phaseFromCount(count, perPhase);
        expect({ count, perPhase, phase: p.phase, drops: p.drops }).toEqual({
          count,
          perPhase,
          phase: f.phase,
          drops: f.drops,
        });
      }
    }
  });

  it('zonder Weer oefenen krimpt er nooit iets, ook niet na een jaar', () => {
    const p = computeProgress(eatsOnDays('broccoli', 10), [], SETTINGS, later(400));
    expect(p.phase).toBe(4);
    expect(p.regrowing).toBe(false);
  });

  it('verwijderen van een registratie herberekent de voortgang', () => {
    const events = eatsOnDays('tomaat', 4);
    expect(computeProgress(events, [], SETTINGS, later(5)).phase).toBe(2);
    expect(computeProgress(events.slice(0, 3), [], SETTINGS, later(5))).toMatchObject({
      phase: 1,
      drops: 2,
    });
  });

  it('volgorde van de invoer maakt niet uit', () => {
    const events = eatsOnDays('pompoen', 5);
    const a = computeProgress(events, [], SETTINGS, later(10));
    const b = computeProgress([...events].reverse(), [], SETTINGS, later(10));
    expect(a).toEqual(b);
  });

  it('per kind en per groente onafhankelijk', () => {
    const events = [...eatsOnDays('wortel', 4), eat('broccoli', at(1)), eat('wortel', at(2), 'k2')];
    const k1 = computeChildProgress(
      'k1',
      events,
      [],
      ['wortel', 'broccoli', 'prei'],
      SETTINGS,
      later(5),
    );
    const k2 = computeChildProgress(
      'k2',
      events,
      [],
      ['wortel', 'broccoli', 'prei'],
      SETTINGS,
      later(5),
    );
    expect([k1.wortel.phase, k1.broccoli.phase, k1.prei.phase]).toEqual([2, 1, 0]);
    expect([k2.wortel.phase, k2.broccoli.phase]).toEqual([1, 0]);
  });

  it('aanzetten en weer uitzetten van Weer oefenen zonder stilte verandert niets', () => {
    const events = eatsOnDays('wortel', 7);
    const p = computeProgress(
      events,
      [practice('wortel', at(7), true), practice('wortel', at(8), false)],
      SETTINGS,
      later(9),
    );
    expect(p).toMatchObject({ phase: 3, record: 3, practicing: false, regrowing: false });
  });
});
