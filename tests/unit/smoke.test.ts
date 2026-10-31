import { createRng, hashString } from '../../src/lib/seeded-rng';

describe('seeded rng', () => {
  it('is deterministisch per seed', () => {
    const a = createRng('2026-10-31');
    const b = createRng('2026-10-31');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(hashString('a')).not.toBe(hashString('b'));
  });
});
