# Eindrapport — Proeftuin (fase 1)

*Werktitel was Familie Vriendelijk; de PO koos de naam Proeftuin (D24).*

*Opgeleverd op 31 oktober 2026 op branch `ccr-c0840aad-ptpv5e`.*

## Kort

De complete app uit de briefing staat: een installeerbare, offline werkende PWA met onboarding,
Vandaag, aantikken (plusknop, raster en vanuit een recept), groente-detail met Weer oefenen,
56 recepten met varianten en filters, boodschappenlijst, kookmodus zonder timer, instellingen met
Mijn data, en de groentetuin met 14 eigen SVG-vriendjes, 9 krachten, 9 dieren, momenten, geluid
en een Nederlandse stem. Alles blijft op het apparaat.

**URL:** https://constantdynamics.github.io/Eatyaveg/ (live sinds 1 november 2026, gepubliceerd
vanaf `main` via GitHub Actions; zie README).

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

- **Echte apparaten** konden hier niet getest worden: installeren op iPad/Android, de echte stemmen
  (kwaliteit verschilt per apparaat; headless Chromium heeft geen Nederlandse stem), 60 fps op een
  gemiddelde tablet. De app valt stil terug: zonder Nederlandse stem alleen geluid en beweging.
- **Voedingscentrum** was vanuit de bouwomgeving niet bereikbaar; de tips volgen de bekende
  adviezen, behoudend geformuleerd (D20). De PO vindt een extra controle niet nodig.
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

## Naam

Gekozen door de PO: **Proeftuin**: een plek om te proberen, en proeven is precies wat telt. De
andere voorstellen waren Groentetuin, Groeivriendjes, Hapjestuin, Moestuinmaatjes, Smaakmaatjes,
Eén Hapje en Verstopt & Gevonden.

## Besluiten van de PO (31-10-2026)

1. `main` aanmaken, standaardbranch maken, een pull request openen en de app online zetten.
2. De naam wordt Proeftuin.
3. Een extra controle van de voedingstips bij het Voedingscentrum is niet nodig.
