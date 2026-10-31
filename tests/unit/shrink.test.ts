import { computeProgress } from '../../src/domain/growth';
import { at, DAY, eatsOnDays, eat, practice, SETTINGS, T0 } from './helpers';

const later = (days: number) => new Date(T0 + days * DAY);

// 16 registraties op dag 0..15 → fase 6 (jaguar), record 6.
const sixteen = () => eatsOnDays('broccoli', 16);

describe('Weer oefenen (§7.3, verschoven klok)', () => {
  it('aanzetten na een lange stilte geeft geen directe krimp', () => {
    const p = computeProgress(
      sixteen(),
      [practice('broccoli', at(200), true)],
      SETTINGS,
      later(200),
    );
    expect(p).toMatchObject({ phase: 6, record: 6, practicing: true, regrowing: false });
  });

  it('krimpt één fase per 7 dagen zonder registratie, geteld vanaf het aanzetten', () => {
    const events = sixteen();
    const prac = [practice('broccoli', at(100), true)];
    expect(computeProgress(events, prac, SETTINGS, later(106.9)).phase).toBe(6);
    expect(computeProgress(events, prac, SETTINGS, later(107)).phase).toBe(5);
    expect(computeProgress(events, prac, SETTINGS, later(114)).phase).toBe(4);
  });

  it('telt vanaf de laatste registratie als die later is dan het aanzetten', () => {
    const events = [...sixteen(), eat('broccoli', at(20))]; // 17e: druppel
    const prac = [practice('broccoli', at(16), true)];
    expect(computeProgress(events, prac, SETTINGS, later(26.9)).phase).toBe(6);
    expect(computeProgress(events, prac, SETTINGS, later(27)).phase).toBe(5);
  });

  it('nooit meer dan 3 fases onder het record', () => {
    const p = computeProgress(
      sixteen(),
      [practice('broccoli', at(16), true)],
      SETTINGS,
      later(365),
    );
    expect(p).toMatchObject({ phase: 3, record: 6, regrowing: true });
  });

  it('nooit lager dan fase 1', () => {
    const events = eatsOnDays('spinazie', 4); // fase 2
    const p = computeProgress(events, [practice('spinazie', at(4), true)], SETTINGS, later(365));
    expect(p.phase).toBe(1);
    expect(p.record).toBe(2);
  });

  it('terug groeien gaat sneller: 2 registraties per fase tot het record', () => {
    const events = sixteen();
    const prac = [practice('broccoli', at(16), true)];
    // Dag 16 + 21 dagen → 3 fases gekrompen (6 → 3).
    const shrunk = computeProgress(events, prac, SETTINGS, later(37));
    expect(shrunk.phase).toBe(3);
    expect(shrunk.dropsNeeded).toBe(2);
    const regrow = [...events, eat('broccoli', at(37)), eat('broccoli', at(38))];
    const p = computeProgress(regrow, prac, SETTINGS, later(38));
    expect(p).toMatchObject({ phase: 4, drops: 0, regrowing: true });
    const backToRecord = [
      ...regrow,
      eat('broccoli', at(39)),
      eat('broccoli', at(40)),
      eat('broccoli', at(41)),
      eat('broccoli', at(42)),
    ];
    const q = computeProgress(backToRecord, prac, SETTINGS, later(42));
    expect(q).toMatchObject({ phase: 6, regrowing: false, dropsNeeded: 3 });
  });

  it('uitzetten zet het vriendje weer op zijn record', () => {
    const prac = [practice('broccoli', at(16), true), practice('broccoli', at(60), false)];
    const p = computeProgress(sixteen(), prac, SETTINGS, later(61));
    expect(p).toMatchObject({ phase: 6, record: 6, practicing: false, regrowing: false });
    // En daarna krimpt het nooit meer.
    expect(computeProgress(sixteen(), prac, SETTINGS, later(400)).phase).toBe(6);
  });

  it('respecteert ingestelde shrinkDays en maxShrink', () => {
    const settings = { ...SETTINGS, shrinkDays: 3, maxShrink: 1 };
    const p = computeProgress(sixteen(), [practice('broccoli', at(16), true)], settings, later(40));
    expect(p.phase).toBe(5);
  });

  it('een zaadje krimpt niet', () => {
    const p = computeProgress([], [practice('prei', at(0), true)], SETTINGS, later(100));
    expect(p.phase).toBe(0);
  });
});
