import { expect, type Page } from '@playwright/test';

/** Doorloopt de onboarding met één of meer kinderen en eventueel al bekende groenten. */
export async function onboard(
  page: Page,
  children: { name: string; known?: string[] }[] = [{ name: 'Noor', known: ['Wortel', 'Tomaat'] }],
  query = '',
) {
  await page.goto(`./${query}#/welkom`);
  await expect(page.getByRole('heading', { name: 'Welkom in de Proeftuin' })).toBeVisible();
  await page.getByRole('button', { name: 'Beginnen' }).click();
  for (let i = 1; i < children.length; i++) {
    await page.getByRole('button', { name: 'Nog een kind toevoegen' }).click();
  }
  for (let i = 0; i < children.length; i++) {
    const label = children.length > 1 ? `Naam kind ${i + 1}` : 'Naam of bijnaam';
    await page.getByLabel(label).fill(children[i]!.name);
  }
  await page.getByRole('button', { name: 'Volgende' }).click();
  for (const child of children) {
    await expect(
      page.getByRole('heading', { name: `Welke groenten eet ${child.name} al?` }),
    ).toBeVisible();
    for (const veg of child.known ?? []) {
      await page.getByRole('button', { name: veg, exact: true }).click();
    }
    await page.getByRole('button', { name: /^(Volgende|Overslaan)$/ }).click();
  }
  await page.getByRole('button', { name: 'Aan de slag' }).click();
  await expect(page.getByRole('heading', { name: 'Vandaag', exact: true })).toBeVisible();
}

/** Id van het eerste kind, rechtstreeks uit IndexedDB. */
export async function firstChildId(page: Page): Promise<string> {
  return page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const req = indexedDB.open('proeftuin');
        req.onsuccess = () => {
          const get = req.result.transaction('kv').objectStore('kv').get('fv:v1:children');
          get.onsuccess = () => resolve((get.result as { id: string }[])[0]!.id);
        };
      }),
  );
}

/** Tikt door de momenten heen tot de tuin vrij speelt. */
export async function skipMoments(page: Page) {
  const garden = page.locator('.fv-garden');
  for (let i = 0; i < 80; i++) {
    if ((await garden.getAttribute('data-playing')) === 'nee') return;
    await page.mouse.click(page.viewportSize()!.width / 2, page.viewportSize()!.height / 2);
    await page.waitForTimeout(200);
  }
  throw new Error('De momenten bleven spelen');
}
