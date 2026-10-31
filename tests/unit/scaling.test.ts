import { formatAmount, formatQty, roundForUnit, scaleQty } from '../../src/domain/scaling';

describe('porties omrekenen', () => {
  it('rekent lineair om en rondt keukenlogisch af', () => {
    expect(scaleQty(300, 4, 2, 'g')).toBe(150);
    expect(scaleQty(300, 4, 6, 'g')).toBe(450);
    expect(scaleQty(1, 4, 6, 'stuks')).toBe(1.5);
    expect(scaleQty(1, 4, 2, 'blik')).toBe(0.5);
    expect(scaleQty(2, 4, 1, 'teentje')).toBe(0.5);
    expect(scaleQty(1, 4, 8, 'snufje')).toBe(1);
    expect(scaleQty(250, 4, 3, 'ml')).toBe(190);
    expect(scaleQty(400, 4, 4, 'g')).toBe(400);
  });

  it('rondt kleine grammen precies af', () => {
    expect(roundForUnit(7.4, 'g')).toBe(7);
    expect(roundForUnit(33, 'g')).toBe(35);
    expect(roundForUnit(333, 'g')).toBe(330);
  });

  it('toont breuken in het Nederlands', () => {
    expect(formatQty(0.5)).toBe('½');
    expect(formatQty(1.5)).toBe('1½');
    expect(formatQty(2.25)).toBe('2¼');
    expect(formatQty(0.75)).toBe('¾');
    expect(formatQty(1.2)).toBe('1,2');
    expect(formatQty(250)).toBe('250');
  });

  it('formatteert ingrediënten met eenheden en meervoud', () => {
    expect(formatAmount({ name: 'ui', plural: 'uien' }, 2, 'stuks')).toBe('2 uien');
    expect(formatAmount({ name: 'ui', plural: 'uien' }, 1, 'stuks')).toBe('1 ui');
    expect(formatAmount({ name: 'wortel' }, 300, 'g')).toBe('300 g wortel');
    expect(formatAmount({ name: 'knoflook' }, 2, 'teentje')).toBe('2 teentjes knoflook');
    expect(formatAmount({ name: 'tomatenblokjes', note: '400 g' }, 0.5, 'blik')).toBe(
      '½ blik tomatenblokjes (400 g)',
    );
    expect(formatAmount({ name: 'zout' }, 1, 'snufje')).toBe('1 snufje zout');
  });
});
