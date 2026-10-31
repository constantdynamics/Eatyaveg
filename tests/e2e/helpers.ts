import { expect, type Page } from '@playwright/test';

/** Doorloopt de onboarding met één of meer kinderen en eventueel al bekende groenten. */
export async function onboard(
  page: Page,
  children: { name: string; known?: string[] }[] = [{ name: 'Noor', known: ['Wortel', 'Tomaat'] }],
) {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Welkom bij Familie Vriendelijk' })).toBeVisible();
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
    await expect(page.getByRole('heading', { name: `Welke groenten eet ${child.name} al?` })).toBeVisible();
    for (const veg of child.known ?? []) {
      await page.getByRole('button', { name: veg, exact: true }).click();
    }
    await page.getByRole('button', { name: /^(Volgende|Overslaan)$/ }).click();
  }
  await page.getByRole('button', { name: 'Aan de slag' }).click();
  await expect(page.getByRole('heading', { name: 'Vandaag', exact: true })).toBeVisible();
}
