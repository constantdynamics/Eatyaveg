# Familie Vriendelijk — projectregels

PWA voor ouders van peuters: groenten verstoppen in recepten, aantikken wat het kind proefde, en
een groentetuin waarin vriendjes groeien. Volledige briefing: `BRIEFING.md`. Beslissingen en
afwijkingen: `DECISIONS.md`.

## Stack en commando's

Vite + React + TypeScript (strict) · Tailwind CSS v4 (tokens in `src/styles/tokens.css`) ·
React Router (`HashRouter`) · Zustand + persist naar IndexedDB (`idb-keyval`) · Zod ·
vite-plugin-pwa · lucide-react · Vitest + Testing Library · Playwright.

```bash
npm run dev               # ontwikkelserver
npm run lint              # eslint + prettier --check
npm test                  # vitest (unit)
npm run validate:content  # contentregels §9.6 (ook in CI)
npm run build             # tsc -b && vite build
npm run e2e               # Playwright-smoke (bouwt en serveert zelf)
npm run screenshots       # screenshots op de maten uit §16
```

Na elke wijziging: lint, test, validate:content en build groen.

## Niet onderhandelbaar (§2)

1. Nederlandstalig (UI, recepten, stem); metrisch; gewone supermarkt.
2. Mooi en niet druk. Bij twijfel: weglaten.
3. De ouder is de gebruiker; het kind ziet alleen de tuin, zonder leestekst.
4. Alleen positieve bekrachtiging. Geen straf, verdriet, leeg-bord-druk of eten als beloning. Eén hapje telt.
5. Eenvoud boven features: geen punten, streaks, ranglijsten, outfits of evenementen (§4.3).
6. Peuterveilige recepten (§13.3): verslikgevaar, zout, honing, niet pittig.
7. Privacy by design: alles lokaal, geen accounts/analytics/externe verzoeken; alles self-hosted.
8. Offline installeerbare PWA; tuin tablet-first.
9. Origineel beeld: eigen SVG's, geen bestaande figuren, merken of stockfoto's.
10. Geen AI in de app; alle content statisch in de repo.
11. Geen medische claims; verwijs bij zorgen naar consultatiebureau of huisarts.
12. WCAG 2.2 AA in de ouder-app; `prefers-reduced-motion` ook in de tuin.
13. Statische hosting (GitHub Pages), geen server, geen geheimen.

## Rust-regels (§14.1)

Eén focuspunt per scherm · royale witruimte, max. één primaire knop per schermdeel · crème/zand
basis met één groen accent; groentekleuren alleen in illustraties · geen emoji · max. twee
fontfamilies en 3–4 tekstgroottes per scherm · één afrondingsmaat (`rounded-card`) en één
schaduw (`shadow-card`/`.fv-card`) · beweging alleen functioneel (200–300 ms, ease-out), niets
pulserends of stuiterends · recepten krijgen de illustratie van hun hoofdgroente op een zandtegel.

## Valkuilen (§15) — niet herhalen

- Geen dynamische Tailwind-classnames (`bg-${x}`): gebruik vaste maps of CSS-variabelen.
- Geen componenten binnen componenten; altijd op moduleniveau.
- Geen `Date.now()`/`Math.random()` in domeinlogica of render: `clock.now()` en `createRng()`.
- Recept van vandaag ligt vast per dag (opgeslagen keuze), niet per render.
- Alles persistent (IndexedDB), met export/import als back-up.
- Fase 0 = zaadje; een nooit gegeten groente is geen mier.
- Recepten met `veggies[]`, volledige hoeveelheden, eerlijke tijden (voorkoken telt mee).
- Kindscherm zonder tekst; Ouder-knop pas na 1,5 s vasthouden.
- Icoonknoppen altijd met toegankelijke naam (`IconButton` vereist `label`).
- Taal telt: "Recept van vandaag", geen anglicismen.

## Structuur

`src/domain` pure, geteste logica (groei, krimp, momenten, limieten, recept van de dag,
porties, boodschappen) · `src/content` groenten, fases, recepten, tips, zinnen ·
`src/store` stores, repositories, migraties · `src/features/*` schermen ·
`src/characters` SVG-vriendjes · `src/audio` geluid (Web Audio) en stem (Web Speech).
