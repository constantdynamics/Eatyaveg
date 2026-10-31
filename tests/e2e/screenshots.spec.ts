import { test, type Page } from '@playwright/test';
import { onboard } from './helpers';

const PARENT_SIZES = [
  { name: 'telefoon', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1180 },
];

async function shot(page: Page, file: string, fullPage = true) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `screenshots/${file}.png`, fullPage });
}

for (const size of PARENT_SIZES) {
  test(`ouder-app ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto('./');
    await shot(page, `${size.name}-01-welkom`, false);
    await onboard(page, [
      { name: 'Noor', known: ['Wortel', 'Tomaat', 'Komkommer'] },
      { name: 'Sem' },
    ]);
    await shot(page, `${size.name}-02-vandaag`);
    await page.getByRole('button', { name: /Broccoli gegeten of geproefd door Noor/ }).click();
    await shot(page, `${size.name}-03-vandaag-snackbar`, false);
    await page.goto('./#/gegeten');
    await page.getByRole('button', { name: 'Wortel', exact: true }).click();
    await page.getByRole('button', { name: 'Prei', exact: true }).click();
    await shot(page, `${size.name}-04-gegeten`, false);
    await page.getByRole('button', { name: /Opslaan/ }).click();
    await shot(page, `${size.name}-05-opgeslagen`, false);
    await page.goto('./#/groenten/wortel');
    await shot(page, `${size.name}-06-groente`);
    await page.goto('./#/recepten');
    await shot(page, `${size.name}-07-recepten`);
    await page.goto('./#/recepten/wortel-tomatensaus');
    await shot(page, `${size.name}-08-recept`);
    await page.goto('./#/instellingen');
    await shot(page, `${size.name}-09-instellingen`);
    await page.goto('./#/hulp');
    await shot(page, `${size.name}-10-hulp`);
  });
}
