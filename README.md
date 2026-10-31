# Proeftuin

*Groenten verstoppen, aantikken en zien groeien: een app voor ouders van peuters.*

Een installeerbare webapp (PWA) voor ouders en verzorgers van kinderen van 2 tot 5 jaar
(werktitel was Familie Vriendelijk):

- **Recepten** (56): per groente een saus of dip en een hoofdgerecht met de varianten
  *extra verstopt* en *licht zichtbaar*, een *Volgende stap*-recept richting herkenbare groente,
  10 smoothies en 4 weekendrecepten. Porties om te rekenen, allergenen, tips.
- **Aantikken**: na het eten met één of twee tikken vastleggen wat er geproefd is. Eén hapje telt.
- **De tuin** (kindscherm, zonder leestekst): 14 groentevriendjes groeien van zo klein als een
  mier tot zo groot als een walvis, met druppels als tussenstap, een dansje, confetti, een
  geluidje en een stem, en bij elke fase een nieuwe kracht.
- **Praktisch**: boodschappenlijst uit gekozen recepten en een kookmodus zonder timer.

Alles blijft op het apparaat (IndexedDB). Geen account, geen analytics, geen externe verzoeken.

## Ontwikkelen

Vereist Node 20 of nieuwer (CI gebruikt de actuele LTS).

```bash
npm ci
npm run dev               # http://localhost:5173
npm run lint              # eslint + prettier --check
npm test                  # unit-tests (Vitest)
npm run validate:content  # contentregels voor recepten, zinnen en groenten
npm run build             # typecheck + productiebuild in dist/
npm run preview           # productiebuild lokaal bekijken
npm run e2e               # Playwright: smoke, privacy, offline, toegankelijkheid
npm run screenshots       # screenshots in screenshots/ (tuin en ouder-app op vaste maten)
```

Met `?dev=1` in de URL (vóór de `#`) verschijnt een dev-paneel: tijd verschuiven, registraties
toevoegen, een fase direct zetten, momenten opnieuw afspelen, zinnen en geluidjes testen, een
fps-meter en data wissen. In `npm run dev` staat het paneel altijd aan.

## Publiceren op GitHub Pages

De workflow `.github/workflows/deploy.yml` bouwt en test bij elke pull request en publiceert bij
een push naar `main`.

Eenmalig handmatig:

1. Zorg dat er een branch `main` is (en maak die de standaardbranch).
2. Ga in GitHub naar **Settings → Pages → Build and deployment → Source** en kies
   **GitHub Actions**.
3. Push naar `main`. De app staat daarna op `https://<eigenaar>.github.io/<repo>/`.

Omdat de app relatieve paden en een `HashRouter` gebruikt, werkt hij onder elke reponaam en ook op
Netlify of Vercel zonder aanpassingen (publiceer de map `dist/`).

## Opbouw

| Map | Inhoud |
|---|---|
| `src/domain` | pure, geteste logica: groei en krimp, momenten, daglimiet, recept van de dag, porties, boodschappen, kookstappen |
| `src/content` | groenten, fases, recepten, tips, gesproken zinnen en de contentvalidatie |
| `src/store` | Zustand-store met persist naar IndexedDB via repositories, migraties, import en export |
| `src/features` | schermen: vandaag, gegeten, groente, recepten, kookmodus, boodschappen, tuin, onboarding, instellingen, hulp, dev |
| `src/characters` | het SVG-systeem van de vriendjes, rekwisieten en dieren |
| `src/audio` | geluidjes (Web Audio) en stem (Web Speech) |
| `tests/unit`, `tests/e2e` | Vitest en Playwright |

Zie ook `CLAUDE.md` (projectregels), `DECISIONS.md` (keuzes en afwijkingen), `CREDITS.md` en
`BRIEFING.md` (de oorspronkelijke opdracht).

## Privacy

De app slaat alleen een voornaam of bijnaam van het kind op, en wat er geproefd is, op het
apparaat zelf. Een back-up maak je zelf als bestand (Instellingen → Mijn data). De stem gebruikt
standaard alleen een stem die op het apparaat werkt. Vóór een eventuele fase 2 met accounts en
synchronisatie is een nieuwe privacytoets nodig.
