# Beslissingen

Per beslissing: wat, waarom, welk alternatief, en hoe terug te draaien.

## D1 — TypeScript 6.0 in plaats van 7.0

- **Wat:** TypeScript 6.0.3 (laatste 6.x).
- **Waarom:** de lint-tooling (`typescript-eslint` 8.72) ondersteunt TypeScript `<6.1`. Versie 7
  (de native port) zou lint breken.
- **Alternatief:** TypeScript 7 zonder type-aware lint.
- **Terugdraaien:** `typescript` ophogen zodra `typescript-eslint` 7 ondersteunt.

## D2 — Repositories achter de Zustand-persist-middleware

- **Wat:** één Zustand-store met `persist`; de opslag-adapter splitst de staat over
  repositories (`ChildRepo`, `EventRepo`, `SettingsRepo`, `ShoppingRepo`, `SnapshotRepo`, plus
  `MetaRepo`) onder de namespace `fv:v1:` in IndexedDB, en schrijft alleen gewijzigde delen.
- **Waarom:** persist levert hydratie, schemaversie en migraties; de repositories maken een
  sync-adapter in fase 2 een kwestie van één implementatie vervangen.
- **Alternatief:** losse stores per domein, of repositories zonder persist.
- **Terugdraaien:** `src/store/persist-storage.ts` vervangen door `createJSONStorage`.

## D3 — Ongeldige opgeslagen data gaat in quarantaine

- **Wat:** bij inladen valideert Zod elk onderdeel; ongeldige items worden niet gebruikt maar
  bewaard onder `fv:v1:quarantine`. Instellingen vallen per veld terug op de standaard.
- **Waarom:** "nooit een walvis kwijt": één kapotte registratie mag de rest niet meenemen.
- **Terugdraaien:** `merge` in `src/store/app-store.ts`.

## D4 — Bron "start" voor groenten uit de onboarding

- **Wat:** groenten die het kind al eet (onboarding stap 3) worden een registratie met bron
  `start`. Zo starten ze op fase 1 en ziet het kind bij het eerste tuinbezoek ontdekmomenten.
- **Waarom:** past in de pure groeifunctie zonder aparte uitzonderingen.
- **Terugdraaien:** die registraties zijn per groente te verwijderen in de geschiedenis.

## D5 — Korte naam op het beginscherm: "Groentetuin"

- **Wat:** `short_name` in het manifest is "Groentetuin"; de volledige naam blijft "Familie
  Vriendelijk".
- **Waarom:** past onder een app-icoon (iOS kapt rond 12 tekens af) en is de naam die het kind kent.
- **Terugdraaien:** `short_name` in `vite.config.ts`.

## D6 — Strikte CSP alleen in de productiebuild

- **Wat:** de CSP-meta wordt bij `vite build` in `index.html` gezet; `assetsInlineLimit: 0`.
- **Waarom:** de dev-server injecteert inline styles; zonder inline assets kan `font-src 'self'`.
- **Terugdraaien:** `cspPlugin` in `vite.config.ts`.

## D7 — CI ook op pull requests

- **Wat:** dezelfde workflow bouwt en test ook bij pull requests; deployen gebeurt alleen bij een
  push naar `main`.
- **Waarom:** fouten zie je vóór het mergen.
- **Terugdraaien:** `pull_request` uit `on:` halen.
