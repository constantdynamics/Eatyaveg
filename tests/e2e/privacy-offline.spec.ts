import { expect, test } from '@playwright/test';
import { firstChildId, onboard, skipMoments } from './helpers';

test('tijdens gebruik geen netwerkverzoeken buiten de eigen origin', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const foreign: string[] = [];
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith(origin) && !url.startsWith('data:') && !url.startsWith('blob:')) foreign.push(url);
  });
  await onboard(page, [{ name: 'Noor', known: ['Wortel', 'Broccoli'] }]);
  const id = await firstChildId(page);
  for (const path of ['#/recepten', '#/recepten/pasta-broccoli-kaassaus', '#/boodschappen', '#/instellingen', '#/hulp', '#/over', '#/groenten/broccoli']) {
    await page.goto(`./${path}`);
    await page.waitForLoadState('networkidle');
  }
  await page.goto(`./#/tuin/${id}`);
  await skipMoments(page);
  expect(foreign).toEqual([]);
});

test('werkt offline na het eerste bezoek', async ({ page, context }) => {
  await onboard(page, [{ name: 'Noor' }]);
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return Boolean(reg.active);
  });
  // Wacht tot de service worker de pagina beheert.
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 15_000 }).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Vandaag', exact: true })).toBeVisible();
  await page.goto('./#/recepten/oranje-soep');
  await expect(page.getByRole('heading', { name: 'Oranje soep van pompoen en wortel' })).toBeVisible();
  await context.setOffline(false);
});

test('installeerbaar: manifest met iconen en relatieve start_url', async ({ request }) => {
  const res = await request.get('./manifest.webmanifest');
  expect(res.ok()).toBe(true);
  const manifest = await res.json();
  expect(manifest.start_url).toBe('./');
  expect(manifest.scope).toBe('./');
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
});
