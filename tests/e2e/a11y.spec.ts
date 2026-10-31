import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

const PAGES = [
  '#/',
  '#/gegeten',
  '#/groenten/wortel',
  '#/recepten',
  '#/recepten/wortel-tomatensaus',
  '#/recepten/wortel-tomatensaus/koken',
  '#/boodschappen',
  '#/instellingen',
  '#/hulp',
  '#/over',
];

test('ouder-app zonder ernstige toegankelijkheidsproblemen (axe, WCAG 2.2 AA)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/welkom');
  const welcome = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    welcome.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toEqual([]);
  await onboard(page, [{ name: 'Noor', known: ['Wortel'] }, { name: 'Sem' }]);
  await page.goto('./#/recepten/wortel-tomatensaus');
  await page.getByRole('button', { name: 'Op boodschappenlijst' }).click();
  for (const path of PAGES) {
    await page.goto(`./${path}`);
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${path} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
    expect(serious).toEqual([]);
  }
});
