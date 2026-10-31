import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test('Mijn data: exporteren, alles wissen (dubbel bevestigd) en weer importeren', async ({
  page,
}) => {
  await onboard(page, [{ name: 'Noor', known: ['Wortel'] }]);
  await page.getByRole('button', { name: 'Broccoli gegeten of geproefd door Noor' }).click();
  await page.goto('./#/instellingen');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Back-up maken (exporteren)' }).click(),
  ]);
  const file = await download.path();
  const backup = JSON.parse(readFileSync(file, 'utf8'));
  expect(backup.app).toBe('proeftuin');
  expect(backup.data.children[0].name).toBe('Noor');
  expect(backup.data.eatEvents).toHaveLength(2);

  await page.getByRole('button', { name: 'Alles wissen' }).click();
  await page.getByRole('button', { name: 'Ja, wissen' }).click();
  await page.getByRole('button', { name: 'Definitief wissen' }).click();
  await expect(page.getByRole('heading', { name: 'Welkom in de Proeftuin' })).toBeVisible();

  // Na wissen: opnieuw beginnen en de back-up terugzetten.
  await onboard(page, [{ name: 'Tijdelijk' }]);
  await page.goto('./#/instellingen');
  await page.locator('#import-file').setInputFiles(file);
  await expect(page.getByRole('dialog')).toContainText('Noor');
  await page.getByRole('button', { name: 'Terugzetten', exact: true }).click();
  await page.goto('./#/');
  await expect(page.getByRole('heading', { name: 'Groenten van Noor' })).toBeVisible();
  await expect(page.getByText('Vandaag geproefd door Noor: broccoli.')).toBeVisible();
});

test('Recept van vandaag: vast per dag, Ander recept blijft na herladen', async ({ page }) => {
  await onboard(page, [{ name: 'Noor' }]);
  const title = page.locator('#daily-title');
  const first = await title.textContent();
  await page.reload();
  await expect(title).toHaveText(first!);
  await page.getByRole('button', { name: 'Ander recept' }).click();
  await expect(title).not.toHaveText(first!);
  const second = await title.textContent();
  await page.reload();
  await expect(title).toHaveText(second!);
});
