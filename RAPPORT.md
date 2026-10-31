# Eindrapport — Familie Vriendelijk (fase 1)

*Opgeleverd op 31 oktober 2026 op branch `ccr-c0840aad-ptpv5e`.*

## Kort

De complete app uit de briefing staat: een installeerbare, offline werkende PWA met onboarding,
Vandaag, aantikken (plusknop, raster en vanuit een recept), groente-detail met Weer oefenen,
56 recepten met varianten en filters, boodschappenlijst, kookmodus zonder timer, instellingen met
Mijn data, en de groentetuin met 14 eigen SVG-vriendjes, 9 krachten, 9 dieren, momenten, geluid
en een Nederlandse stem. Alles blijft op het apparaat.

**URL:** nog niet live. De repo was leeg, dus er is nog geen `main`. Zodra `main` bestaat en
GitHub Pages op *GitHub Actions* staat (zie README), publiceert de workflow de app op
`https://constantdynamics.github.io/Eatyaveg/`. Tot die tijd: `npm ci && npm run dev`.

## Wat werkt (getoetst)

| Onderdeel | Hoe aangetoond |
|---|---|
| Groei, krimp (Weer oefenen), daglimiet, momenten, recept van de dag, porties, boodschappen, migraties, import | 108 unit-tests (Vitest), o.a. met verschoven klok |
| 56 recepten volgens §9 (10 smoothies, 4 weekend, per groente 2× verstopt + Volgende stap) | `npm run validate:content`: 0 fouten, 0 waarschuwingen; de validator vangt aantoonbaar pittig, ontbrekende allergenen, hele noten, honing zonder tip, te lange tijden, te veel stappen, onvolledige `veggies[]` |
| Smoke-flow §16: onboarding → aantikken → tuin → groeimoment → Ouder 1,5 s vasthouden → herladen → bewaard | Playwright `tests/e2e/smoke.spec.ts` |
| Deeplinks na herladen, daglimiet en ongedaan maken, Gegeten vanuit een recept, reduced motion | Playwright |
| Geen netwerkverzoeken buiten de eigen origin; offline na het eerste bezoek; manifest | Playwright `privacy-offline.spec.ts` |
| Exporteren, dubbel bevestigd wissen, importeren; recept van vandaag vast per dag | Playwright `data.spec.ts` |
| Toegankelijkheid ouder-app | axe (WCAG 2.2 AA) op alle schermen: geen ernstige problemen; Lighthouse mobiel 100 |
| Performance | Lighthouse mobiel 91 (FCP 1,9 s, TBT 120 ms, CLS 0); tuin 60 fps in headless Chromium |
| Mooi en rustig | screenshots op alle maten uit §16 gemaakt, bekeken en verbeterd; selectie in `docs/screenshots/` |
| Geen dynamische Tailwind-classnames, geen emoji, geen componenten in componenten | unit-test `code-quality.test.ts` en de lintregel `react-hooks/static-components` |

## Wat (nog) niet, en bekende beperkingen

- **Publiceren**: vraagt een `main`-branch en één handmatige instelling (Settings → Pages →
  Source: GitHub Actions). Een pull request kon ik niet openen: er is geen basisbranch.
- **Echte apparaten** konden hier niet getest worden: installeren op iPad/Android, de echte stemmen
  (kwaliteit verschilt per apparaat; headless Chromium heeft geen Nederlandse stem), 60 fps op een
  gemiddelde tablet. De app valt stil terug: zonder Nederlandse stem alleen geluid en beweging.
- **Voedingscentrum** was vanuit de bouwomgeving niet bereikbaar; de tips volgen de bekende
  adviezen, behoudend geformuleerd (D20). Laat ze nog één keer naast de actuele site leggen.
- **Portret op een telefoon**: de tuin is bruikbaar maar kleiner (landscape-first, zoals bedoeld).
- **Terugknop van Android/browser** wordt in de tuin niet onderschept (D15); de hulp-pagina legt
  Begeleide toegang en App vastzetten uit.
- `npm audit`: 0 kwetsbaarheden in wat naar de gebruiker gaat; alleen meldingen in bouwtools.

## Verbeteringen en afwijkingen

Alle keuzes staan met reden, alternatief en terugdraai-instructie in `DECISIONS.md` (D1–D22). De
belangrijkste:

- **Pas ontdekte vriendjes wonen bij het moestuinbed** en wandelen bij hun eerste groei naar hun
  eigen plek in de tuin (D8).
- **Zones worden ingekaderd op hun inhoud** en ontdekkingen krijgen een close-up van het bed, zodat
  mier-kleine vriendjes toch groot in beeld komen (D9).
- **"Kijk wie er op je wacht" speelt geen momenten af**: vóór het eten motiveren, na het eten vieren (D11).
- **De snapshot wordt per moment bijgewerkt**: halverwege weggaan geeft nooit dubbele of gemiste momenten (D12).
- **Stemmen via internet alleen op uitdrukkelijke keuze** van de ouder, vanwege privacy (D14).
- **Geluidjes zelf gemaakt** met Web Audio, zonder bestanden (D16).
- **`zod/mini`, `Intl` en luie schermen** voor een lichtere app (D18).
- **"Superheldendrankje" heet nu "Paarse bessensmoothie"**: geen kracht koppelen aan eten (D21).

## Onafhankelijke review (§19.3)

_Wordt ingevuld zodra de review klaar is._

## Naamvoorstellen

1. **Proeftuin** — een proeftuin is een plek om te proberen, en proeven is precies wat telt.
2. **Groentetuin** — de naam die het kind al kent; ook de korte naam op het beginscherm.
3. **Groeivriendjes** — zegt meteen wat er gebeurt.
4. **Hapjestuin** — één hapje telt.
5. **Moestuinmaatjes** — warm en speels.
6. **Smaakmaatjes** — voor kinderen die samen leren proeven.
7. **Eén Hapje** — de kernboodschap als naam.
8. **Verstopt & Gevonden** — van verstopte naar herkenbare groente.

## Vragen voor de PO

_Wordt ingevuld na de review._
