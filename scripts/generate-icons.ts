/**
 * Genereert de PNG-iconen in public/icons met de voorgeïnstalleerde Chromium (Playwright).
 * Eenmalig draaien na een wijziging van het icoon: npm run icons
 */
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { iconSvg } from './icon-source';

const OUT = 'public/icons';

async function render(svg: string, size: number, file: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`,
  );
  await page.locator('svg').screenshot({ path: `${OUT}/${file}`, omitBackground: true });
  await browser.close();
}

const plain = iconSvg({ maskable: false });
const maskable = iconSvg({ maskable: true });
writeFileSync(`${OUT}/favicon.svg`, plain);
await render(plain, 192, 'icon-192.png');
await render(plain, 512, 'icon-512.png');
await render(maskable, 512, 'icon-maskable-512.png');
await render(maskable, 180, 'apple-touch-icon-180.png');
console.log('Iconen gegenereerd in', OUT);
