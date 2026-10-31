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
| Groei, krimp (Weer oefenen), daglimiet, momenten, recept van de dag, porties, boodschappen, migraties, import | 109 unit-tests (Vitest), o.a. met verschoven klok |
| 56 recepten volgens §9 (10 smoothies, 5 weekend, per groente 2× verstopt + Volgende stap) | `npm run validate:content`: 0 fouten, 0 waarschuwingen; de validator vangt aantoonbaar pittig, ontbrekende allergenen, hele noten, honing zonder tip, te lange tijden, te veel stappen, onvolledige `veggies[]` |
| Smoke-flow §16: onboarding → aantikken → tuin → groeimoment → Ouder 1,5 s vasthouden → herladen → bewaard | Playwright `tests/e2e/smoke.spec.ts` (12 e2e-tests in totaal, alle groen) |
| Vertrekken tijdens een moment: het moment blijft bewaard voor het volgende bezoek | Playwright |
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

Alle keuzes staan met reden, alternatief en terugdraai-instructie in `DECISIONS.md` (D1–D23). De
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

Een aparte reviewer zonder voorkennis heeft de app getoetst aan §16 (met eigen Playwright-scripts,
een nagemaakte stem en Lighthouse) en 17 recepten nagelopen. Oordeel: de ouder-app, groei, PWA,
privacy, recepten en kookmodus zijn gehaald; deels gehaald waren de momenten bij vertrekken
halverwege, reduced motion in de tuin, ongedaan maken na het raster en de rust in portret.

Verwerkt (details in `DECISIONS.md` D23):

- vertrekken tijdens een moment bewaart het moment voor de volgende keer (nieuwe e2e-test);
- de mentor spreekt na nieuwe momenten, anders hoogstens één keer per dag, met een eigen zin bij
  een zaadje; geen "slapende" zin meer;
- lange bezoeken worden compacter (richtlijn 45 s); reduced motion geeft korte cameraovergangen;
- druppels alleen bij vriendjes in beeld; geen update-melding in de tuin of tijdens het koken;
- ongedaan maken na opslaan via het raster; opslaan start direct;
- duidelijker silhouetten voor Courgette, Komkommer en Boontje;
- recepten: eerlijke tijden, gestoofde appel, mildere knoflook, geen zout in gehaktmengsels,
  logische pasta-timing, twee paprika's, juiste "licht zichtbaar"-variant, lasagne-tip over ei;
  en een correcte varianttekst.

Bewust niet overgenomen: de tuin in portret op een telefoon blijft kleiner (landscape-first), omdat
inzoomen ten koste zou gaan van het altijd vindbaar zijn van elk vriendje.

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

1. Mag ik een `main`-branch aanmaken vanaf deze branch, zodat GitHub Pages de app kan publiceren en ik een pull request kan openen?

   a. Ja, maak `main` aan, zet hem als standaardbranch en open een pull request

   b. Ja, maar maak alleen `main` aan; Pages aanzetten doe ik zelf

   c. Nee, ik maak `main` zelf aan en laat het je weten

   d. Publiceer liever eerst een testversie op Netlify

   e. Publiceer liever eerst een testversie op Vercel

   f. Nog niet publiceren; ik wil eerst zelf lokaal kijken

2. Welke naam krijgt de app?

   a. Familie Vriendelijk houden

   b. Proeftuin

   c. Groentetuin

   d. Groeivriendjes

   e. Hapjestuin

   f. Moestuinmaatjes

   g. Een eigen naam, die ik doorgeef

3. Wie legt de voedingstips nog één keer naast de actuele adviezen van het Voedingscentrum (die site was vanuit de bouwomgeving niet bereikbaar)?

   a. Ik doe dat zelf en geef wijzigingen door

   b. Een diëtist of jeugdverpleegkundige uit ons netwerk

   c. Jij, in een volgende sessie waarin voedingscentrum.nl wel bereikbaar is

   d. Niet nodig, de huidige formulering is goed genoeg

   e. Eerst alleen de veiligheidstips (verslikken, honing, zout) laten checken

