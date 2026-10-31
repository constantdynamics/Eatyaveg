/**
 * Screenshots op de maten uit §16: tuin 1180×820, 820×1180, 1024×768; ouder-app 390×844, 820×1180.
 * Draai met `npm run screenshots`; de bestanden komen in screenshots/.
 */
import { test, type Page } from '@playwright/test';
import { firstChildId, onboard, skipMoments } from './helpers';

async function shot(page: Page, file: string, fullPage = false) {
  await page.waitForTimeout(500);
  await page.screenshot({ path: `screenshots/${file}.png`, fullPage });
}

for (const size of [
  { name: 'telefoon', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1180 },
]) {
  test(`ouder-app ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto('./#/welkom');
    await shot(page, `${size.name}-01-welkom`);
    await onboard(page, [
      { name: 'Noor', known: ['Wortel', 'Tomaat', 'Komkommer'] },
      { name: 'Sem' },
    ]);
    await shot(page, `${size.name}-02-vandaag`, true);
    await page.getByRole('button', { name: /Broccoli gegeten of geproefd door Noor/ }).click();
    await shot(page, `${size.name}-03-vandaag-snackbar`);
    await page.goto('./#/gegeten');
    await page.getByRole('button', { name: 'Wortel', exact: true }).click();
    await page.getByRole('button', { name: 'Prei', exact: true }).click();
    await shot(page, `${size.name}-04-gegeten`);
    await page.getByRole('button', { name: /Opslaan/ }).click();
    await shot(page, `${size.name}-05-opgeslagen`);
    await page.goto('./#/groenten/wortel');
    await shot(page, `${size.name}-06-groente`, true);
    await page.goto('./#/recepten');
    await shot(page, `${size.name}-07-recepten`, true);
    await page.goto('./#/recepten/wortel-tomatensaus');
    await shot(page, `${size.name}-08-recept`, true);
    await page.getByRole('button', { name: 'Op boodschappenlijst' }).click();
    await page.goto('./#/recepten/broccoli-gehaktballetjes');
    await page.getByRole('button', { name: 'Op boodschappenlijst' }).click();
    await page.goto('./#/boodschappen');
    await shot(page, `${size.name}-09-boodschappen`, true);
    await page.goto('./#/recepten/broccoli-gehaktballetjes/koken');
    await page.getByRole('button', { name: 'Start' }).click();
    await shot(page, `${size.name}-10-koken`);
    await page.goto('./#/instellingen');
    await shot(page, `${size.name}-11-instellingen`, true);
    await page.goto('./#/hulp');
    await shot(page, `${size.name}-12-hulp`, true);
  });
}

for (const size of [
  { name: 'tuin-1180x820', width: 1180, height: 820 },
  { name: 'tuin-820x1180', width: 820, height: 1180 },
  { name: 'tuin-1024x768', width: 1024, height: 768 },
]) {
  test(`tuin ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await onboard(page, [{ name: 'Noor' }], '?dev=1');
    const id = await firstChildId(page);
    await page.evaluate((cid) => window.__fvDev!.showcase(cid), id);
    await page.goto(`./?dev=1#/tuin/${id}`);
    await skipMoments(page);
    await page.waitForTimeout(1400);
    await shot(page, `${size.name}-a-zone`);
    await page.getByRole('button', { name: 'Hele tuin bekijken' }).click();
    await page.waitForTimeout(1400);
    await shot(page, `${size.name}-b-overzicht`);
    // Naar de speeltuin en een vriendje in close-up.
    await page.mouse.click(size.width * 0.3, size.height * 0.5);
    await page.waitForTimeout(1400);
    await shot(page, `${size.name}-c-zone2`);
    const buddy = page.locator('[data-tap="buddy"]').first();
    const box = await buddy.boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1500);
    await shot(page, `${size.name}-d-closeup`);
    // Een groeimoment midden in de dans.
    await page.goto('./?dev=1#/');
    await page.evaluate((cid) => {
      window.__fvDev!.setPhase(cid, 'pompoen', 4);
    }, id);
    await page.goto(`./?dev=1#/tuin/${id}`);
    await skipMoments(page);
    await page.goto('./?dev=1#/');
    await page.evaluate((cid) => window.__fvDev!.addEvents(cid, 'pompoen', 3), id);
    await page.goto(`./?dev=1#/tuin/${id}`);
    await page.locator('.fv-confetti').waitFor({ state: 'attached', timeout: 30_000 });
    await page.waitForTimeout(500);
    await shot(page, `${size.name}-e-groei`);
  });
}
