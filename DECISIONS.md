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

## D5 — Korte naam op het beginscherm (vervangen door D24)

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

## D8 — Pas ontdekte vriendjes wonen bij het moestuinbed

- **Wat:** fase 0 is een zaadje in het bed, fase 1 staat bij zijn eigen plekje in het bed, vanaf
  fase 2 woont een vriendje vast in een van de andere zones. Bij de groei van 1 naar 2 wandelt het
  vriendje (in beeld) naar zijn eigen plek.
- **Waarom:** volgt §8.2 letterlijk ("een bed met de zaadjes en pas ontdekte vriendjes"); mier-
  kleine vriendjes zijn zo makkelijk te vinden; de verhuizing is een feestelijk extra moment.
- **Alternatief:** vanaf de ontdekking meteen in de eigen zone.
- **Terugdraaien:** `spotForPhase` in `src/features/garden/world.ts`.

## D9 — Groottes in de tuin

- **Wat:** fase 1 tot 9 lopen van 44 tot 431 wereld-eenheden (factor 1,33 per fase). In de
  zoneweergave is dat ongeveer 45 px tot ruim de helft van een liggende tablet; de close-up toont
  elk vriendje op ongeveer 55% van de schermhoogte. Zones worden verticaal ingekaderd op hun
  inhoud, zodat er weinig lege lucht is.
- **Waarom:** 70% schermhoogte in de zoneweergave liet geen ruimte voor meerdere grote vriendjes.
- **Terugdraaien:** `PHASE_BASE` en `PHASE_GROWTH` in `world.ts`, `zoneCamera` in `camera.ts`.

## D10 — Eén groot icoon om uit te zoomen

- **Wat:** naast de Ouder-knop staat in de zone- en close-upweergave één rustig kaart-icoon om naar
  het overzicht te gaan (en knijpen werkt ook).
- **Waarom:** §8.3 vraagt om "uitzoomen met een groot icoon"; §14.2 wil verder geen interface. Het
  icoon is tekstloos, half doorzichtig en verdwijnt in het overzicht en tijdens momenten.
- **Terugdraaien:** de `fv-zoomout`-knop in `GardenPage.tsx`.

## D11 — "Kijk wie er op je wacht" speelt geen momenten af

- **Wat:** via `?focus=` gaat de tuin direct in close-up bij die groente; eventuele nieuwe momenten
  blijven bewaard voor het volgende bezoek (na het eten, via Toon aan).
- **Waarom:** vóór het eten gaat het om motiveren; het vieren hoort na het eten.
- **Terugdraaien:** `playMoments: !focus` in `GardenPage.tsx`.

## D12 — Snapshot per moment bijwerken

- **Wat:** elk moment markeert zijn groenten als gezien zodra het is afgespeeld (of overgeslagen).
- **Waarom:** verlaat de ouder de tuin halverwege, dan wordt niets dubbel en niets nooit getoond
  ("precies één keer").
- **Terugdraaien:** `settle`/`markSeen` in `src/features/garden/player.ts`.

## D13 — De mentor spreekt elk bezoek hoogstens één keer

- **Wat:** als er een walvis is, nodigt hij aan het eind van de momenten één keer uit, ook als er
  geen nieuwe momenten waren. Bij Weer oefenen kiest hij die groente.
- **Terugdraaien:** `includeMentor` in `GardenPage.tsx`.

## D14 — Stemmen via internet alleen op uitdrukkelijke keuze

- **Wat:** de app gebruikt automatisch alleen een Nederlandse stem die op het apparaat zelf werkt.
  Een stem via internet (bijvoorbeeld in desktop-Chrome) wordt alleen gebruikt als de ouder hem in
  Instellingen kiest; daar staat uitgelegd dat de tekst (ook de naam) dan naar de browsermaker gaat.
- **Waarom:** privacy by design (§2.7) en §8.5.
- **Terugdraaien:** `pickVoice` in `src/audio/voice.ts`.

## D15 — Geen blokkade van de terugknop van het systeem

- **Wat:** in de tuin wordt de terugknop van Android of de browser niet onderschept.
- **Waarom:** onderscheppen met extra geschiedenisregels botst met de router en verwart ouders
  later. De hulp-pagina legt Begeleide toegang (iPad) en App vastzetten (Android) uit; dat is
  betrouwbaarder.
- **Terugdraaien:** n.v.t. (toevoegen kan met een `popstate`-wacht in `GardenPage.tsx`).

## D16 — Geluidjes zelf gemaakt, zonder bestanden

- **Wat:** alle geluidjes zijn korte Web Audio-synthese (plop, pling, groeideuntje, kwaak, giechel,
  druppel, fontein, woesj, tik), zacht afgesteld (masterniveau 0,45).
- **Waarom:** geen licenties of downloads nodig, klein, en altijd offline.
- **Terugdraaien:** `src/audio/sounds.ts`.

## D17 — Actuele versies (oktober 2026)

- **Wat:** Vite 8, React 19.3, React Router 8 (`HashRouter` uit `react-router`), Zustand 5, Zod 4,
  Tailwind CSS 4.3, vite-plugin-pwa 2, Vitest 5, ESLint 10. `@playwright/test` staat op 1.63 zodat
  het de voorgeïnstalleerde Chromium van de bouwomgeving vindt (CI draait alleen de unit-tests).
- **Terugdraaien/bijwerken:** `package.json`; voor Playwright 1.64+ eerst `npx playwright install`.

## D18 — `zod/mini` in de app, `Intl` in plaats van date-fns, luie schermen

- **Wat:** het inladen en importeren van opgeslagen data gebruikt `zod/mini` (zelfde regels, veel
  kleiner); datums via `Intl.DateTimeFormat('nl-NL')`; recepten, boodschappen, instellingen,
  hulp, onboarding, groente-detail, kookmodus en tuin worden pas geladen als ze nodig zijn (en in
  rust alvast vooruit geladen).
- **Waarom:** opstart-JavaScript van ongeveer 600 naar 440 kB; Lighthouse mobiel performance 91
  (toegankelijkheid 100, best practices 100).
- **Alternatief:** date-fns met nl-locale (zoals de briefing voorstelt) en volledige Zod overal.
- **Terugdraaien:** `src/lib/dates.ts`, `src/store/schema.ts`, `src/app/App.tsx`.

## D19 — Groentenlijst in `veggies[]` volledig

- **Wat:** elke groente die in de ingrediënten zit, staat ook in `veggies[]` (dus ook tomaat in
  sauzen met passata). `validate:content` dwingt dat af.
- **Waarom:** bij "We hebben dit gegeten" tellen alle groenten mee (§9.3); eerlijk tellen helpt.
- **Terugdraaien:** de controle `VEGGIE_KEYWORDS` in `src/content/validate.ts`.

## D20 — Voedingsadviezen zonder directe bron in de bouwomgeving

- **Wat:** voedingscentrum.nl was vanuit de bouwomgeving niet bereikbaar. De tips volgen de bekende
  adviezen (geen hele noten onder 4 jaar, druiven en cherrytomaten in de lengte in vieren, weinig
  zout, geen honing onder 1 jaar, nitraatrijke groenten ook vaker per week en niet met vis,
  smoothies af en toe, hele groente en fruit blijft het fijnst), behoudend geformuleerd.
- **Besluit PO (31-10-2026):** een extra controle naast de actuele site is niet nodig.

## D21 — Smoothienamen en "Superheldendrankje"

- **Wat:** smoothies hebben Nederlandse, beschrijvende namen; het prototype-"Superheldendrankje"
  heet nu "Paarse bessensmoothie".
- **Waarom:** een naam die kracht aan eten koppelt, voelt als een gezondheidsclaim (§13.2); de
  kracht van de vriendjes hoort bij de spelfantasie in de tuin.

## D22 — Zelf toevoegen op de boodschappenlijst komt onder "Overig"

- **Wat:** zelf toegevoegde items krijgen afdeling "Overig" in plaats van een afdelingskeuze.
- **Waarom:** één invoerveld is rustiger; de lijst blijft overzichtelijk.
- **Terugdraaien:** `addManualItem(name, section)` ondersteunt al een afdeling.

## D23 — Verwerking van de onafhankelijke review (§19.3)

Een aparte reviewer zonder voorkennis toetste de app aan §16 en een steekproef van 17 recepten.
Verwerkt:

- **Vertrek tijdens een moment**: de Ouder-knop breekt nu het hele bezoek af; een moment dat niet
  af is, wordt niet als gezien opgeslagen en speelt het volgende bezoek alsnog (met e2e-test).
- **Mentor**: spreekt na nieuwe momenten, en zonder nieuwe momenten hoogstens één keer per dag
  (per kind, bijgehouden op het apparaat). Bij een zaadje een eigen zin ("Daar zit nog een
  zaadje…"). De zin met "slapen" is vervangen; `validate:content` weert dat woord nu.
- **Kortere bezoeken**: vanaf het derde groeimoment, of na 25 seconden, wordt de kracht getoond
  zonder hem uit te spreken; na 38 seconden vervalt de mentor (richtlijn 45 s).
- **Reduced motion**: cameraovergangen in de tuin duren dan hoogstens 250 ms.
- **Druppels** worden alleen getoond bij vriendjes in de zone die in beeld is.
- **Update-melding** verschijnt niet in de tuin en niet tijdens het koken.
- **Ongedaan maken** ook na opslaan via het raster.
- **Opslaan** start direct (niet meer achter elkaar wachtend), zodat een tik vlak voor herladen
  bewaard blijft.
- **Silhouetten**: Courgette (knots), Komkommer (knobbels) en Boontje (peulbulten) zijn ook zonder
  kleur duidelijker van elkaar te onderscheiden.
- **Recepten**: eerlijke tijden (aardappel-spruitjeskoekjes 45 min, weekend; ovenschotel 12 min
  bakken; wortelfrietjes eerst voorkoken; stamppotten met waterkoker; gehaktschotel met grill als
  optie), appel in de bietenstamppot meegestoofd, minder en meegekookte knoflook in pesto's en
  sauzen, geen zout meer in gehaktmengsels (kinderportie zonder zout), pasta pas koken als de saus
  pruttelt, twee paprika's in de quesadilla's, "licht zichtbaar" in de pompoensaus met kleine
  stukjes, lasagnetekst en een ei-tip bij lasagnebladen.
- **Varianttekst** bij recepten: "zo fijn mogelijk" in plaats van "alles glad gepureerd".

Niet overgenomen, met reden: de tuin in portret op een telefoon blijft kleiner (landscape-first,
§8.1); alle zones blijven volledig in beeld, zodat geen vriendje onvindbaar wordt.

## D24 — De app heet Proeftuin

- **Wat:** de PO koos de naam "Proeftuin" (werktitel was "Familie Vriendelijk"). Die naam staat in
  de titel, het manifest (ook de korte naam op het beginscherm), de onboarding ("Welkom in de
  Proeftuin"), Over en de naam van het back-upbestand. Omdat er nog geen gebruikers waren, heten
  ook de IndexedDB-database en de export-id nu `proeftuin`. Interne voorvoegsels (`fv:` in de
  opslag, `fv-` in CSS) zijn ongewijzigd gebleven.
- **Terugdraaien:** `src/config/app.ts`, `src/i18n/nl.ts`, `index.html`, `vite.config.ts`.
