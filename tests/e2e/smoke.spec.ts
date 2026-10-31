import { expect, test } from '@playwright/test';
import { firstChildId, onboard } from './helpers';

test('onboarding → aantikken → tuin → groeimoment → Ouder vasthouden → herladen → bewaard', async ({
  page,
}) => {
  await onboard(page, [{ name: 'Noor', known: ['Wortel'] }], '?dev=1');
  const id = await firstChildId(page);

  // Wortel staat op 1 registratie (bekend bij de start). Twee eerdere dagen erbij via het dev-paneel…
  await page.evaluate((cid) => window.__fvDev!.addEvents(cid, 'wortel', 2), id);
  // …en de derde via de plusknop: samen 4 = fase 2 (lieveheersbeestje).
  await page.getByRole('button', { name: 'Wortel gegeten of geproefd door Noor' }).click();
  await expect(page.getByRole('status')).toContainText('Wortel aangetikt voor Noor');
  await expect(
    page.getByText('Zo groot als een lieveheersbeestje · nog 3× tot egel'),
  ).toBeVisible();

  // Toon aan Noor → de tuin opent en speelt de momenten af.
  await page.getByRole('button', { name: 'Toon aan Noor' }).click();
  await expect(page).toHaveURL(new RegExp(`#/tuin/${id}`));
  const garden = page.locator('.fv-garden');
  await expect(garden).toHaveAttribute('data-playing', 'ja');
  // Het groeimoment: de camera gaat in close-up, het dier verschijnt en er is confetti.
  await expect(garden).toHaveAttribute('data-mode', 'closeup', { timeout: 30_000 });
  await expect(page.locator('.fv-confetti')).toBeAttached({ timeout: 30_000 });
  await expect(garden).toHaveAttribute('data-playing', 'nee', { timeout: 45_000 });

  // De Ouder-knop: kort tikken doet niets…
  const parent = page.getByTestId('ouder-knop');
  await parent.click();
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/#\/tuin\//);
  // …1,5 seconde vasthouden gaat terug naar de ouder-app.
  const box = (await parent.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1700);
  await page.mouse.up();
  await expect(page.getByRole('heading', { name: 'Vandaag', exact: true })).toBeVisible();

  // Herladen: alles is bewaard en de momenten worden niet opnieuw afgespeeld.
  await page.reload();
  await expect(
    page.getByText('Zo groot als een lieveheersbeestje · nog 3× tot egel'),
  ).toBeVisible();
  await page.goto(`./?dev=1#/tuin/${id}`);
  await expect(garden).toHaveAttribute('data-playing', 'nee', { timeout: 20_000 });
  await expect(page.locator('.fv-confetti')).toHaveCount(0);
});

test('vertrekken tijdens een moment: het moment blijft bewaard voor het volgende bezoek', async ({
  page,
}) => {
  await onboard(page, [{ name: 'Noor' }], '?dev=1');
  const id = await firstChildId(page);
  // Broccoli voor het eerst geproefd: een ontdekmoment staat klaar.
  await page.getByRole('button', { name: 'Broccoli gegeten of geproefd door Noor' }).click();
  await page.goto(`./?dev=1#/tuin/${id}`);
  const garden = page.locator('.fv-garden');
  await expect(garden).toHaveAttribute('data-playing', 'ja');
  await page.waitForTimeout(2500);
  // De ouder houdt de Ouder-knop vast terwijl het moment nog loopt.
  const box = (await page.getByTestId('ouder-knop').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1700);
  await page.mouse.up();
  await expect(page.getByRole('heading', { name: 'Vandaag', exact: true })).toBeVisible();
  const seen = await page.evaluate(
    (cid) =>
      new Promise<unknown>((resolve) => {
        const req = indexedDB.open('familie-vriendelijk');
        req.onsuccess = () => {
          const get = req.result.transaction('kv').objectStore('kv').get('fv:v1:snapshots');
          get.onsuccess = () => {
            const snaps = (get.result ?? {}) as Record<
              string,
              { veggies: Record<string, unknown> }
            >;
            resolve(snaps[cid]?.veggies?.broccoli ?? null);
          };
        };
      }),
    id,
  );
  expect(seen).toBeNull();
  // Volgend bezoek: het ontdekmoment wordt alsnog afgespeeld.
  await page.goto(`./?dev=1#/tuin/${id}`);
  await expect(garden).toHaveAttribute('data-playing', 'ja');
  await expect(garden).toHaveAttribute('data-mode', 'regio', { timeout: 15_000 });
});

test('deeplinks werken na herladen', async ({ page }) => {
  await onboard(page, [{ name: 'Sem' }]);
  await page.goto('./#/recepten/wortel-tomatensaus');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Wortel-tomatensaus' })).toBeVisible();
  await page.goto('./#/recepten/wortel-tomatensaus/koken');
  await expect(page.getByRole('heading', { name: 'Klaar om te koken?' })).toBeVisible();
});

test('daglimiet en ongedaan maken', async ({ page }) => {
  await onboard(page, [{ name: 'Noor' }]);
  const plus = page.getByRole('button', { name: 'Prei gegeten of geproefd door Noor' });
  await plus.click();
  await page.getByRole('button', { name: 'Ongedaan maken' }).click();
  await expect(page.getByText('Nog een zaadje').first()).toBeVisible();
  await plus.click();
  await plus.click();
  await plus.click();
  await expect(page.getByRole('status')).toContainText('telde vandaag al 2 keer mee');
});

test('Gegeten: meerdere groenten en kinderen, vanuit een recept voorgeselecteerd', async ({
  page,
}) => {
  await onboard(page, [{ name: 'Noor' }, { name: 'Sem' }]);
  await page.goto('./#/gegeten?recept=romige-tomatensoep&zicht=1');
  await expect(page.getByRole('button', { name: 'Tomaat', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Paprika', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: /Opslaan/ }).click();
  await expect(page.getByRole('button', { name: 'Toon aan Noor' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toon aan Sem' })).toBeVisible();
});

test('reduced motion: de tuin werkt zonder confetti', async ({ browser }) => {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1180, height: 820 },
  });
  const page = await context.newPage();
  await onboard(page, [{ name: 'Noor', known: ['Wortel'] }], '?dev=1');
  const id = await firstChildId(page);
  await page.evaluate((cid) => window.__fvDev!.addEvents(cid, 'wortel', 3), id);
  await page.goto(`./?dev=1#/tuin/${id}`);
  const garden = page.locator('.fv-garden');
  await expect(garden).toHaveAttribute('data-playing', 'nee', { timeout: 45_000 });
  await expect(page.locator('.fv-confetti')).toHaveCount(0);
  await context.close();
});
