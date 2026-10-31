import { canRegister, countOnDay } from '../../src/domain/limits';
import { eat } from './helpers';

describe('daglimiet', () => {
  const day = new Date('2026-03-10T18:00:00');
  const events = [
    eat('wortel', new Date('2026-03-10T08:00:00').toISOString()),
    eat('wortel', new Date('2026-03-10T17:00:00').toISOString()),
    eat('wortel', new Date('2026-03-09T23:30:00').toISOString()),
    eat('broccoli', new Date('2026-03-10T17:00:00').toISOString()),
    eat('wortel', new Date('2026-03-10T17:00:00').toISOString(), 'k2'),
  ];

  it('telt per kind, per groente, per kalenderdag in lokale tijd', () => {
    expect(countOnDay(events, 'k1', 'wortel', day)).toBe(2);
    expect(countOnDay(events, 'k1', 'broccoli', day)).toBe(1);
    expect(countOnDay(events, 'k2', 'wortel', day)).toBe(1);
  });

  it('staat maximaal 2 registraties per dag toe', () => {
    expect(canRegister(events, 'k1', 'wortel', day, 2)).toBe(false);
    expect(canRegister(events, 'k1', 'broccoli', day, 2)).toBe(true);
    expect(canRegister(events, 'k1', 'wortel', new Date('2026-03-11T07:00:00'), 2)).toBe(true);
  });
});
