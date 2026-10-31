import { SCHEMA_VERSION } from '../../src/config/app';
import { migrate, MigrationError, type Migration } from '../../src/store/migrations';
import { createExport, parseImport } from '../../src/store/data-transfer';
import { sanitizeState } from '../../src/store/sanitize';
import { initialPersistedState } from '../../src/store/state';

const NOW = '2026-10-31T12:00:00.000Z';

function sampleState() {
  const s = initialPersistedState(NOW);
  return {
    ...s,
    meta: { ...s.meta, onboarded: true, selectedChildId: 'k1' },
    children: [{ id: 'k1', name: 'Noor', color: 'child-1' as const, createdAt: NOW }],
    eatEvents: [
      { id: 'e1', childId: 'k1', veggieId: 'wortel' as const, at: NOW, source: 'plus' as const },
    ],
  };
}

describe('migraties', () => {
  it('laat de huidige versie ongemoeid', () => {
    const data = sampleState();
    expect(migrate(data, SCHEMA_VERSION)).toEqual(data);
  });

  it('voert migraties op volgorde uit', () => {
    const calls: number[] = [];
    const migrations: Record<number, Migration> = {
      1: (d) => (calls.push(1), { ...d, a: 1 }),
      2: (d) => (calls.push(2), { ...d, b: (d.a as number) + 1 }),
    };
    const out = migrate({ x: true }, 1, 3, migrations);
    expect(calls).toEqual([1, 2]);
    expect(out).toEqual({ x: true, a: 1, b: 2 });
  });

  it('weigert data uit een nieuwere versie en ontbrekende migraties', () => {
    expect(() => migrate({}, SCHEMA_VERSION + 1)).toThrow(MigrationError);
    expect(() => migrate({}, 1, 3, {})).toThrow(/ontbreekt/);
  });
});

describe('sanitize', () => {
  it('zet ongeldige onderdelen apart en behoudt de rest', () => {
    const raw = {
      ...sampleState(),
      eatEvents: [
        { id: 'e1', childId: 'k1', veggieId: 'wortel', at: NOW, source: 'plus' },
        { id: 'e2', childId: 'k1', veggieId: 'banaan', at: NOW, source: 'plus' },
      ],
      settings: { perPhase: 7, sound: false },
    };
    const { state, rejected } = sanitizeState(raw, NOW);
    expect(state.eatEvents.map((e) => e.id)).toEqual(['e1']);
    expect(rejected).toHaveLength(1);
    expect(state.settings.perPhase).toBe(3); // ongeldig → standaard
    expect(state.settings.sound).toBe(false); // geldig veld blijft
  });

  it('vult ontbrekende instellingen aan met de standaard', () => {
    const { state } = sanitizeState({ ...sampleState(), settings: { speech: false } }, NOW);
    expect(state.settings.speech).toBe(false);
    expect(state.settings.dailyCap).toBe(2);
    expect(state.settings.enabledVeggies).toHaveLength(14);
  });
});

describe('export en import', () => {
  it('importeert een eigen export ongewijzigd', () => {
    const state = sampleState();
    const text = JSON.stringify(createExport(state, NOW));
    const result = parseImport(text, NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.children).toEqual(state.children);
    expect(result.state.eatEvents).toEqual(state.eatEvents);
    expect(result.summary).toMatchObject({ children: ['Noor'], registrations: 1 });
  });

  it('weigert onleesbare bestanden, vreemde bestanden en nieuwere versies', () => {
    expect(parseImport('niet-json', NOW)).toMatchObject({ ok: false });
    expect(parseImport(JSON.stringify({ app: 'iets-anders' }), NOW)).toMatchObject({ ok: false });
    const future = { ...createExport(sampleState(), NOW), schemaVersion: SCHEMA_VERSION + 1 };
    const result = parseImport(JSON.stringify(future), NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/nieuwere versie/);
  });
});
