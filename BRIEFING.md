# Briefing: Familie Vriendelijk (werktitel)

*Groenten verstoppen, aantikken en zien groeien: een app voor ouders van peuters.*

**Voor:** Claude Code (Claude Opus 5.5)
**Opdrachtgever:** de product owner (Nederlandstalig)
**Datum:** 30 oktober 2026 · **Versie:** 1.0
**Doel:** bouw in één run een installeerbare webapp (PWA) waarmee ouders van peuters groenten verstoppen in familievriendelijke recepten en bijhouden welke groenten hun kind heeft gegeten, en waarin het kind zijn groente-vriendjes ziet groeien in een eigen tuin.

> **Startinstructie (one-shot)**
> 1. Lees deze briefing volledig, ook de valkuilen (§15) en de acceptatiecriteria (§16).
> 2. Stel vooraf geen vragen. Kies bij open punten de standaard uit §17 of je eigen beste oordeel binnen §2 en §3, en leg elke betekenisvolle keuze vast in `DECISIONS.md`.
> 3. Je hebt mandaat om betere ideeën door te voeren (§3). Eenvoud en rust blijven daarbij leidend.
> 4. Leg de vaste projectregels vast in een beknopte `CLAUDE.md` (stack, commando's, §2, §14.1 en §15).
> 5. Werk de mijlpalen uit §19 af tot alle acceptatiecriteria aantoonbaar gehaald zijn (lint, tests, build, screenshots) en sluit af met het eindrapport (§19.4).

Deze briefing bundelt een ontwerpsessie tussen de PO en Claude en het klikbare React-prototype uit die sessie. De beslissingen van de PO staan in §4.1; wat deze briefing daaraan toevoegt staat apart in §4.4, zodat altijd te zien is wat van wie komt.

---

## Inhoud

1. Productvisie
2. Uitgangspunten (niet onderhandelbaar)
3. Mandaat: ruimte voor betere ideeën
4. Productbeslissingen
5. Scope en fasering
6. Informatiearchitectuur en ouder-app
7. Groeisysteem
8. De tuin (kindscherm)
9. Groenten, recepten en content
10. Boodschappenlijst en kookmodus
11. Technische architectuur
12. Datamodel
13. Privacy, voedselveiligheid en verantwoord belonen
14. Design: mooi en rustig
15. Valkuilen uit het prototype
16. Oplevering: acceptatiecriteria
17. Open beslispunten
18. Roadmap
19. Werkafspraken en oplevering

Bijlage A: Recepten uit het prototype · Bijlage B: Voorbeeldzinnen voor de stem

---

## 1. Productvisie

Veel peuters weigeren groenten. Deze app helpt op twee manieren tegelijk:

- **De ouder** krijgt familievriendelijke recepten waarin groenten verstopt zitten, met een route naar steeds zichtbaardere groente. Na het eten tikt de ouder aan welke groente(n) het kind heeft gegeten.
- **Het kind** heeft een eigen tuin vol groente-vriendjes. Elke keer dat het een groente eet, groeit dat vriendje: van zo klein als een mier tot zo groot als een walvis. Bij elke fase kan het iets sterkers en behulpzaams, zoals een schooltas dragen of de tafel dekken.

**Pijlers**

| Pijler | Kern |
|---|---|
| Recepten | Niet pittig, meestal binnen 30 minuten. Per recept een variant *extra verstopt* en *licht zichtbaar*; een aparte categorie *Volgende stap* richting herkenbare groente; ook smoothies. |
| Aantikken | De ouder registreert achteraf met één of twee tikken wat het kind heeft gegeten. |
| Groentetuin | Het kind ziet zijn vriendjes groeien en nieuwe krachten tonen. Zonder tekst: met beeld, beweging, geluid en stem. |
| Praktisch | Een boodschappenlijst uit gekozen recepten en een stap-voor-stap kookmodus (zonder timer). |

**Doelgroep:** ouders en verzorgers (ook grootouders en gastouders) van kinderen van 2 tot 5 jaar. Het kind gebruikt alleen de tuin.

**Kernmoment:** de ouder tikt aan dat er broccoli in de pasta zat, geeft de tablet aan het kind ("Kijk eens wat er gebeurd is!") en Broccoli groeit, maakt een dansje en tilt trots een tuinstoel op.

**Uitstraling:** mooi, warm en rustig. Een app die een ouder graag opent en die een peuter niet overprikkelt.

**Toon:** licht en bemoedigend. Naar ouders begripvol en nooit belerend ("Weigeren hoort erbij"); naar het kind speels.

---

## 2. Uitgangspunten (niet onderhandelbaar)

1. **Nederlandstalig:** UI, recepten en gesproken zinnen. Metrische eenheden en ingrediënten uit een gewone Nederlandse supermarkt.
2. **Mooi en niet druk.** Expliciete wens van de PO, in de ouder-app én in de tuin. Bij twijfel: weglaten. De rust-regels staan in §14.
3. **De ouder is de gebruiker; het kind ziet alleen de tuin.** Het kindscherm vraagt geen leesvaardigheid: niets hoeft gelezen te worden om het te begrijpen.
4. **Alleen positieve bekrachtiging.** Geen straf, geen verdrietige of zieke karakters, geen druk om het bord leeg te eten, geen eten als beloning. Eén hapje telt.
5. **Eenvoud boven features.** De PO heeft extra spelmechanismen bewust afgewezen (§4.3). Geen punten, streaks, ranglijsten, outfits of evenementen.
6. **Peuterveilige recepten** volgens §13.3: verslikgevaar, zout, honing, niet pittig.
7. **Privacy by design (AVG):** alle data blijft op het apparaat; geen accounts, geen analytics, geen externe verzoeken; fonts en assets self-hosted. Van het kind alleen een voornaam of bijnaam.
8. **Werkt offline als installeerbare PWA.** Tablet-first voor de tuin; telefoon en tablet voor de ouder.
9. **Origineel beeld:** zelf ontworpen SVG-karakters en -illustraties. Geen bestaande figuren of merken (dus ook geen Popeye), geen stockfoto's.
10. **Geen AI in de app.** Alle content is statisch en staat in de repo; er zijn geen API-keys nodig.
11. **Geen medische claims.** Tips sluiten aan bij de adviezen van het Voedingscentrum; bij zorgen verwijst de app naar het consultatiebureau of de huisarts.
12. **Toegankelijk:** WCAG 2.2 AA voor de ouder-app; `prefers-reduced-motion` ook in de tuin.
13. **Statische hosting** (GitHub Pages): geen server, geen geheimen.

---

## 3. Mandaat: ruimte voor betere ideeën

De PO: *waar je betere ideeën hebt dan wat wij hebben bedacht, mag je die gewoon doorvoeren.* De spelregels:

- **Direct doen:** alles wat de app eenvoudiger, mooier, rustiger, duidelijker, veiliger, sneller of robuuster maakt: interactie, layout, animatie, teksten, recepten, architectuur, bibliotheken.
- **Doen, met motivatie in `DECISIONS.md`:** afwijken van een productbeslissing uit §4.1 als je ervan overtuigd bent dat het voor kind én ouder beter werkt. Maak de oorspronkelijke keuze dan waar redelijk instelbaar of eenvoudig terug te zetten.
- **Niet doen:** uitgangspunten uit §2 loslaten, afgewezen ideeën uit §4.3 terugbrengen, of functies toevoegen die de app voller maken zonder het kernprobleem beter op te lossen.
- **De toets:** wordt een moe ouder om half zes hier blijer van, en een peuter van drie? En blijft het mooi en rustig? Zo niet, laat het weg.
- **Formaat `DECISIONS.md`:** per beslissing wat, waarom, welk alternatief, en hoe het terug te draaien is.

---

## 4. Productbeslissingen

### 4.1 Besloten door de PO (vast, tenzij §3)

**Concept**

| Onderwerp | Beslissing |
|---|---|
| Uitstraling | Mooi en vooral niet te druk |
| Doelgroep | Ouders van peuters (2–5 jaar) |
| Verstoppen | Volledig onzichtbaar (gepureerd in sauzen, dips en smoothies) én visueel getransformeerd (fijn geraspt); per recept beide varianten waar zinvol |
| Naar zichtbaar | Aparte receptcategorie *Volgende stap* met geleidelijk zichtbaardere groente |
| Rollen | De ouder is hoofdgebruiker; het kind ziet alleen het "badgescherm": de tuin |
| Registratie | De ouder tikt achteraf aan dat het kind de groente heeft gegeten |
| Beloning | Per groente een karakter dat groeit naarmate die groente vaker is gegeten; elke groente groeit onafhankelijk |

**Groei en karakters**

| Onderwerp | Beslissing |
|---|---|
| Groeifases | 9: mier → lieveheersbeestje → egel → konijn → poes → jaguar → beer → dinosaurus → walvis |
| Kracht | Per fase een krachtactiviteit die laat zien hoe sterk het vriendje is; realistisch, veilig en niet gevaarlijk om na te doen (§7.2) |
| Tempo | Elke fase 2–3 keer eten, gelijk voor alle fases |
| Karakters | Herkenbare groentevorm met cartoonoogjes, armpjes en beentjes; expressief (gezichtsuitdrukkingen, zwaaiende handjes, vrolijk); geen eigen persoonlijkheid per groente nodig |
| Aantal | 12 of meer groenten in de eerste versie; een mix van makkelijke en moeilijke groenten |
| Groeimoment | Het vriendje wordt groter, maakt een vreugdedansje met confetti en geluidjes en laat direct zijn nieuwe kracht zien |
| Tuin openen | De vriendjes zwaaien en maken geluidjes |
| Walvis | Wordt mentor: moedigt het kind gesproken (geen tekst) aan om ook andere groenten te eten, zodat die vriendjes ook groeien |
| Krimpen | Standaard nooit. Alleen als de ouder voor een specifieke groente instelt dat daar weer aan gewerkt moet worden |
| Terugval | Geen negatieve gevolgen; alleen positieve bekrachtiging |

**Tuin**

| Onderwerp | Beslissing |
|---|---|
| Wereld | Eén tuin met paden en zones (speeltuin, vijver, bloementuin) waarin de vriendjes rondlopen en hun kracht laten zien; zorgvuldig uitgewerkt, maar rustig (§14.2) |
| Zones | Herkenbaar aan objecten (speeltuin: schommel; vijver: eendjes) |
| Navigatie | Scrollbaar, met een overzichtsmodus en een detailmodus waarin je inzoomt op een deel van de tuin |
| Apparaat | Tablet |
| Wanneer | Na het aantikken via de knop "Toon aan [naam]", en vóór het eten om te motiveren ("Kijk wie er op je wacht!") |
| Overgang | Direct: een volledig nieuw scherm |
| Terug | Een kleine, zichtbare "Ouder"-knop in een hoek |

**Ouder-app**

| Onderwerp | Beslissing |
|---|---|
| Home | Boven (de helft van het scherm): recept van vandaag. Onder: groente-overzicht met per groente icoon, naam, voortgangsbalk en plusknop; alfabetisch en scrollbaar |
| Navigatie | Hoofdmenu met grote knoppen: Recepten · Groente gegeten · Tuin · Boodschappen |
| Groente gegeten | Een raster met groente-iconen om aan te tikken |
| Extra's | Boodschappenlijst op basis van gekozen recepten; stap-voor-stap kookbegeleiding **zonder** timer |

**Recepten**

| Onderwerp | Beslissing |
|---|---|
| Familievriendelijk | Niet pittig en niet te lang: tot 30 minuten; meer ingrediënten mag. Plus een paar langere recepten |
| Soorten | Sauzen en dips; hoofdgerechten met gehakt (ballen, burgers, bolognese), pasta en rijst, en ovenschotels; smoothies |
| Per groente | Minstens een saus of dip en een hoofdgerecht, afgestemd op wat bij de groente past |
| Vorm | Kort en bondig: ingrediënten en 3–4 stappen |
| Info | Bereidingstijd, porties, welke groente(n), moeilijkheid |
| Varianten | In één recept: "voor kritische eters: volledig pureren" en "voor avontuurlijkere eters: fijn raspen" |
| Tips | Hoe je de groente verstopt en wat je doet bij weerstand |
| Basis | De 8 recepten en 10 smoothies uit het prototype (bijlage A) |

### 4.2 Volgorde

In de sessies is een kleinere MVP genoemd (aantikken, groeien, tuin bekijken), met daarna gesproken aanmoediging, geluidjes, boodschappenlijst en recepten. Deze briefing bundelt alles in Fase 1. Bouw wel in die volgorde (§19.2), zodat er na elke mijlpaal een werkende app staat.

### 4.3 Afgewezen of niet gekozen (niet toevoegen)

Streaks of dagreeksen, seizoensbonussen, familie-uitdagingen, outfits en accessoires, vriendjes die met elkaar spelen, tuinfeestjes en andere evenementen, verdrietige of slapende karakters, geschreven tekst voor het kind, een eigen persoonlijkheid per groente, weekplanner, kooktimer, voedingswaarden per recept, foto's uploaden en sociale functies.

### 4.4 Aanvullingen in deze briefing

Nieuw ten opzichte van de sessies. Bouw ze in; je mag ze verbeteren of, met motivatie, schrappen.

1. **Proeven telt.** Eén hapje is genoeg voor een stap. Een kind moet een nieuwe groente vaak tien keer of vaker proeven voordat het eraan gewend is, dus de app beloont kennismaken, niet het lege bord. Label: "Gegeten of geproefd".
2. **Ontdekmoment.** Een groente die nog nooit is gegeten ligt als zaadje in de moestuin (fase 0). De eerste keer springt het vriendje uit de grond, zo klein als een mier.
3. **Druppels als tussenstap.** Een voortgangsbalk zegt een peuter niets. Naast elk vriendje staan drie waterdruppels; elke keer eten vult er één, bij de derde groeit het vriendje. Zo is er na elke maaltijd iets te zien.
4. **Onthulmoment.** In de tuin zegt de stem "Er zat wortel in je eten!" voordat Wortel groeit. Dat verbindt de verstopte groente met de echte (standaard aan, uit te zetten).
5. **Meerdere kinderen.** Elk kind een eigen tuin en eigen voortgang. Met één kind blijft de app net zo eenvoudig.
6. **Van recept naar aantikken.** Vanuit een recept staan de groenten al klaar ("We hebben dit gegeten"). Een recept kan meerdere groenten bevatten; die tellen allemaal.
7. **Ongedaan maken en daglimiet.** Na elke tik kun je het ongedaan maken; per groente per kind tellen maximaal 2 registraties per dag, zodat een peuter niet via het plusje zijn tuin kan opblazen.
8. **"Ouder"-knop met vasthouden.** Zichtbaar zoals besloten, maar pas actief na 1,5 seconde vasthouden, zodat het kind er niet per ongeluk uit tikt. Plus uitleg over Begeleide toegang (iPad) en App vastzetten (Android).
9. **Zacht krimpen.** Alleen via *Weer oefenen* per groente: langzaam, begrensd, het record blijft zichtbaar en terug groeien gaat sneller. In de tuin nooit verdrietig (§7.3).
10. **Inclusieve krachten.** Niet elk gezin heeft een papa en een mama. Standaard "de grote koffer dragen" en "een grote mens optillen"; optioneel vult de ouder in hoe het kind de ouders noemt.
11. **Kookmodus houdt het scherm aan** (Wake Lock) en porties zijn om te rekenen.
12. **Nooit een walvis kwijt.** Opslag in IndexedDB, persistente opslag aanvragen, export en import als back-up.
13. **Allergenen** per recept en een filter op allergieën in het gezin. Stond eerder in een niet-gekozen optie; toegevoegd omdat voedselallergie bij jonge kinderen relatief vaak voorkomt.
14. **Harde contentregels** voor peuterveilige recepten en taal zonder druk (§13).
15. **Hulp-pagina** met korte, nuchtere tips en wanneer je hulp zoekt.

---

## 5. Scope en fasering

| Fase | Wat | Hosting |
|---|---|---|
| **1 — deze opdracht** | De complete app op één apparaat (tablet of telefoon), met meerdere kinderen, volledig lokaal en offline. Alle content in de repo. | GitHub Pages |
| **2 — gezin synchroon** | Gezinsaccount; synchronisatie tussen de telefoon van de ouder(s) en de tablet van het kind; back-up in de cloud. Standaard Supabase (Auth, Postgres met RLS). | Frontend op GitHub Pages, backend op Supabase |
| **3 — uitbreiding** | Eigen groenten toevoegen, ingesproken zinnen (bijvoorbeeld door de ouder zelf), meer recepten, Engelstalige versie. | idem |

**Eén apparaat in Fase 1:** de ouder tikt aan en geeft daarna het apparaat aan het kind. Ontwerp de ouder-app dus net zo goed voor tablet als voor telefoon.

**Ontwerpregel:** bouw Fase 1 zo dat Fase 2 een kwestie is van een opslag-adapter vervangen, niet van herbouwen (§11.3).

---

## 6. Informatiearchitectuur en ouder-app

**Routes (HashRouter)**

| Route | Inhoud |
|---|---|
| `#/welkom` | Eerste keer: onboarding (§6.6) |
| `#/` | **Vandaag:** kindkiezer (alleen bij meer kinderen), recept van vandaag, groente-overzicht |
| `#/gegeten` | Raster: wat is er gegeten of geproefd? |
| `#/groenten/:id` | Groente-detail voor de ouder |
| `#/recepten` · `#/recepten/:id` · `#/recepten/:id/koken` | Overzicht met filters · recept · kookmodus |
| `#/boodschappen` | Boodschappenlijst |
| `#/tuin/:kindId` | Kindscherm (volledig scherm); `?focus=<groente-id>` voor "Kijk wie er op je wacht!" |
| `#/instellingen` | Kinderen, groenten, groei, geluid en stem, allergieën, mijn data |
| `#/hulp` | Tips, wanneer hulp zoeken, het kind in de app houden |
| `#/over` | Over, privacy, disclaimer, bronnen en credits |

**Navigatie:** een rustige onderbalk met grote knoppen (icoon plus label, minstens 56 px hoog): **Vandaag · Recepten · Gegeten · Boodschappen · Tuin**. *Gegeten* is de hoofdactie en valt subtiel op. *Tuin* vraagt bij meer kinderen eerst welk kind. Instellingen via een tandwiel rechtsboven. Op tablet mag de balk een zijbalk worden.

### 6.1 Vandaag

- **Boven (ongeveer de helft): recept van vandaag.** Kaart met de illustratie van de hoofdgroente, naam, tijd en knoppen *Bekijk recept*, *Kijk wie er op je wacht* (opent de tuin met focus op die groente) en *Ander recept*.
  - De keuze ligt per dag vast (seed = datum) en blijft gelijk na herladen; *Ander recept* kiest een volgende.
  - Voorkeur voor groenten met *Weer oefenen* en nog niet ontdekte groenten, met afwisseling ten opzichte van de vorige dagen; recepten met allergenen uit de instellingen vallen af.
- **Na het eten:** is er vandaag in de kookmodus gekookt, dan staat hier een kaart: "Hebben jullie [recept] gegeten? Tik aan wat er geproefd is."
- **Onder: groente-overzicht.** Alfabetisch en scrollbaar. Per groente: klein vriendje, naam, dunne voortgangsbalk (stap x van 3 in deze fase), status ("Zo groot als een konijn · nog 2× tot poes") en een plusknop.
  - Plus = één registratie voor het geselecteerde kind; daarna een snackbar met *Ongedaan maken* en *Toon aan [naam]*.
  - Nog niet ontdekt: "Nog een zaadje".
- **Kindkiezer** bovenaan (avatar en naam) als er meer dan één kind is.

### 6.2 Groente gegeten

- Raster met grote groente-iconen (tikvlak minstens 72 px), meerdere tegelijk te kiezen; gekozen iconen zijn rustig maar duidelijk gemarkeerd.
- Kinderen als chips, standaard allemaal geselecteerd; bij één kind verborgen.
- *Opslaan* → bevestiging met per kind de knop **Toon aan [naam]**.
- Vanuit een recept (*We hebben dit gegeten*) zijn de groenten van dat recept voorgeselecteerd en wordt het zichtbaarheidsniveau meegeregistreerd.
- Boven de daglimiet: een vriendelijke melding en geen extra registratie.

### 6.3 Groente-detail

- Per kind: fase (dier en kracht), aantal keer, record en druppels.
- Geschiedenis (datum, bron, recept) met verwijderen.
- Schakelaar *Weer oefenen* met korte uitleg (§7.3).
- Tips: verstoppen, bij weerstand, volgende stap.
- Recepten met deze groente, per zichtbaarheid: Onzichtbaar → Licht zichtbaar → Zichtbaar → Puur.

### 6.4 Recepten

- **Overzicht:** zoeken en filters op groente, soort, tijd (≤ 15 min, ≤ 30 min, weekend), zichtbaarheid (waaronder *Volgende stap*), allergieën en favorieten. Een rustige lijst, geen muur van gekleurde kaarten.
- **Recept:** naam, tijd, porties (om te rekenen), moeilijkheid, groenten en allergenen; schakelaar *Extra verstopt / Licht zichtbaar* die ingrediënten en stappen aanpast; ingrediënten; stappen; tips. Acties: *Start koken*, *Op boodschappenlijst*, *We hebben dit gegeten*, *Kijk wie er op je wacht* en favoriet.

### 6.5 Instellingen

Kinderen (naam, uitspraak voor de stem, kleur) · groenten aan/uit · groeitempo (3 of 2 per fase) · daglimiet · *Weer oefenen*-standaarden · geluid en stem (aan/uit, stem kiezen en testen) · onthulmoment aan/uit · hoe het kind de ouders noemt (optioneel) · allergieën · **Mijn data:** exporteren, importeren, alles wissen, status van de opslag · app installeren.

### 6.6 Onboarding (maximaal 4 schermen, daarna nooit meer)

1. Welkom: wat de app doet, in twee zinnen.
2. Kind toevoegen: naam of bijnaam en een kleur; "nog een kind toevoegen".
3. Optioneel: "Welke groenten eet [naam] al?" Die starten als ontdekt (fase 1), zodat de tuin bij het eerste bezoek al vriendjes heeft en het kind meteen ontdekmomenten ziet.
4. Zo werkt het: drie kaarten (verstop · tik aan · laat zien) en een tip om de app op het beginscherm te zetten (§11.3).

---

## 7. Groeisysteem

### 7.1 Regels

- Per kind per groente telt de app de registraties ("gegeten of geproefd").
- **Fase 0:** nog niet ontdekt (zaadje). De eerste registratie maakt er **fase 1** van (mier).
- Daarna elke `perPhase` registraties (standaard 3, instelbaar 2) een fase verder, tot en met **fase 9** (walvis).
- Zonder krimp: `fase = 0` als `aantal = 0`, anders `min(9, 1 + floor((aantal − 1) / perPhase))`; druppels = `(aantal − 1) mod perPhase`. Met 3 per fase is de walvis na 25 keer bereikt.
- Na fase 9 tellen registraties nog mee in de statistiek; de walvis bedankt met een kleine fontein, verder verandert er niets.
- Daglimiet: standaard 2 registraties per groente per kind per kalenderdag (lokale tijd).
- Registraties zijn te verwijderen; de voortgang wordt dan opnieuw berekend. In de tuin wordt niets teruggespoeld: het vriendje staat bij het volgende bezoek gewoon op de juiste fase.
- Implementeer de voortgang als **pure functie** van de registraties, de *Weer oefenen*-gebeurtenissen, de instellingen en `clock.now()`, volledig unit-getest.

### 7.2 Fases en krachten

| Fase | Zo groot als | Kracht | Rekwisiet |
|---|---|---|---|
| 0 | — | (zaadje in de moestuin) | zaadje met blaadje |
| 1 | mier | een speelgoedblokje optillen | blokje |
| 2 | lieveheersbeestje | een stapel boeken dragen | boeken |
| 3 | egel | een schooltas dragen | schooltas |
| 4 | konijn | helpen met de boodschappen | boodschappentas |
| 5 | poes | een tuinstoel verplaatsen | tuinstoel |
| 6 | jaguar | de tafel dekken voor het hele gezin | stapel borden |
| 7 | beer | de grote koffer dragen | koffer |
| 8 | dinosaurus | een grote mens optillen (voor de grap) | volwassene |
| 9 | walvis | de hele familie een groepsknuffel geven | familie |

- De PO koos "papa's koffer dragen" en "mama optillen". Standaard neutraal; vult de ouder in hoe het kind de ouders noemt, dan wordt het persoonlijk ("Wortel kan mama optillen!").
- Het dier is een **maatvergelijking**: tijdens het groeimoment en in de close-up staat het naast het vriendje. Teken alle dieren vriendelijk (geen tanden, geen enge jaguar of dino).

### 7.3 Weer oefenen (krimpen, alleen op verzoek)

- Per kind per groente aan te zetten door de ouder; standaard uit. Uit betekent: dit vriendje krimpt nooit.
- Aan: is de groente `shrinkDays` dagen (standaard 7) niet geregistreerd, dan zakt het vriendje één fase, en zo elke volgende `shrinkDays` dagen. Tel vanaf het aanzetten of de laatste registratie, wat het laatst was. Aanzetten na een lange stilte geeft dus geen directe krimp.
- Grenzen: nooit lager dan fase 1 en nooit meer dan `maxShrink` (standaard 3) fases onder het record.
- Terug naar het record gaat sneller: standaard 2 registraties per fase. Het vriendje weet nog hoe groeien moet.
- Zet de ouder *Weer oefenen* uit, dan staat het vriendje weer op zijn record.
- In de tuin staat een gekrompen vriendje in een zachte zonnestraal en draagt het zijn record als klein sterretje. Geen verdrietig gezicht, geen krimpanimatie, geen verwijt. Hoogstens zegt de mentor: "Broccoli wil weer groeien!"
- Unit-tests met een verschoven klok: aanzetten na lange stilte, krimp per periode, grenzen, sneller terug groeien, uitzetten.

### 7.4 Momenten in de tuin

Per kind bewaart de app wat het kind het laatst heeft gezien (fase en druppels per groente). Bij het openen van de tuin speelt de app het verschil af:

1. **Onthulling** (als aan): "Er zat wortel in je eten!"
2. **Ontdekking:** het zaadje wiebelt, springt open en het vriendje verschijnt, zo klein als een mier, en zwaait. "Hoera, een nieuw vriendje: Pompoen!"
3. **Druppel:** het vriendje springt blij en een druppel vult zich. "Mmm, lekker! Ik word al sterker!"
4. **Groei:** groter worden, vreugdedansje, confetti en een geluidje; het dier verschijnt ernaast ("Wortel is nu zo groot als een konijn!") en het vriendje laat meteen zijn nieuwe kracht zien ("Kijk, Wortel helpt met de boodschappen!").
5. **Mentor** (als er een walvis is): hoogstens één keer per bezoek, na de andere momenten, een uitnodiging voor een groente die nog klein is of op *Weer oefenen* staat.

- Bij meerdere momenten gaat de camera rustig van vriendje naar vriendje; druppels van verschillende groenten mogen samen. Houd het geheel kort (richtlijn: hooguit 45 seconden); tikken versnelt of slaat over.
- Daarna vrij spelen. De snapshot wordt pas bijgewerkt als de momenten zijn afgespeeld.

---

## 8. De tuin (kindscherm)

### 8.1 Algemeen

- Volledig scherm (Fullscreen API waar mogelijk; als PWA standalone). Landscape-first, ook bruikbaar in portrait en op een telefoon.
- **Geen leestekst.** Niets wat het kind moet lezen.
- **Alles mag aangeraakt worden.** Vriendjes giechelen, springen en zeggen hun naam; de eend kwaakt, de schommel schommelt, een bloem gaat open, een vlinder fladdert weg. Geen menu's, geen instellingen.
- **Bij openen** zwaaien de vriendjes en maken ze een geluidje; eventueel "Hoi [naam]!".
- **"Ouder"-knop:** klein en zichtbaar in een hoek, met een slotje. Pas na 1,5 seconde vasthouden (met voortgangsring) terug naar de ouder-app; kort tikken geeft alleen een wiebel als hint.

### 8.2 Wereld en zones

- Eén horizontale wereld van ongeveer 3–4 schermbreedtes, bijvoorbeeld van links naar rechts:
  - **Moestuin** (ingang): een bed met de zaadjes en pas ontdekte vriendjes, een gieter
  - **Speeltuin:** schommel en glijbaan
  - **Vijver:** eendjes en waterlelies
  - **Bloementuin:** bloemen en een bankje
  - eventueel een **weide** met een heuvel voor de allergrootsten
- Zones zijn herkenbaar aan twee à drie objecten (§14.2), niet aan tekst. Achtergrond in een paar lagen (lucht, heuvels, bomen) met lichte parallax.
- **Plaatsing:** vast per groente (elk bezoek dezelfde plek), verdeeld over de zones; grote vriendjes achteraan en hoger in beeld, kleine vooraan; nooit zo dat een vriendje onvindbaar is. Vriendjes wandelen af en toe rustig rond hun plekje en laten soms hun kracht zien.
- **Schaal:** elke fase zichtbaar groter, binnen een speelbaar bereik (niet-lineair, bijvoorbeeld van ongeveer 32 px tot ongeveer 70% van de schermhoogte in de detailweergave). Het dier naast het vriendje maakt de "echte" maat duidelijk.

### 8.3 Overzicht en inzoomen

- **Overzicht:** de hele tuin in één beeld, met minder detail.
- **Zone:** tik op een zone → vloeiend inzoomen; swipen naar de buurzone; uitzoomen met een groot icoon (en pinch waar dat soepel werkt).
- **Close-up:** tik op een vriendje → groot in beeld met zijn druppels en zijn dier; het laat zijn kracht zien en zegt iets.
- **Kijk wie er op je wacht** (`?focus=`): direct in close-up bij die groente. Het vriendje zwaait: "Hoi! Ik ben Pompoen. Als jij een hapje proeft, groei ik!"
- Grote, vergevingsgezinde tikvlakken: een peuter tikt met de hele hand.

### 8.4 Karakters en animatie

- Originele SVG's, per groente direct herkenbaar, ook zonder kleur (§9.1).
- **Een systeem in plaats van losse tekeningen:** gedeelde onderdelen (ogen die knipperen, wenkbrauwen, mond, wangetjes, armpjes, beentjes) plus per groente een lichaamsvorm en een palet. Bijvoorbeeld `<VeggieCharacter veggie="wortel" mood="blij" pose="zwaaien" phase={4} />`.
- Stemmingen: blij (standaard), verrast, juichend, trots. Poses: staan, lopen, zwaaien, dansen, tillen of dragen. Geen verdrietige of boze varianten.
- Rekwisieten per fase (§7.2) als aparte SVG's die het vriendje vasthoudt; dieren als eenvoudige, vriendelijke SVG's in dezelfde stijl.
- Animaties met CSS of de Web Animations API; een lichte animatiebibliotheek mag als die aantoonbaar helpt. Doel 60 fps op een gemiddelde tablet: animeer transform en opacity, gebruik weinig dure filters. Bij `prefers-reduced-motion`: geen confetti en geen rondlopen, wel korte overgangen.

### 8.5 Geluid en stem

- **Geluidjes:** zelf gemaakt met de Web Audio API (plop, pling, een vrolijk deuntje bij groei, een kwaakje, een giechel) of CC0-bestanden met bron in `CREDITS.md`. Kort, zacht, nooit schel.
- **Stem:** Web Speech API (`speechSynthesis`) met een Nederlandse stem (nl-NL, anders nl-BE), iets langzamer (±0,9) en iets hoger. De ouder kiest en test de stem in Instellingen. Wacht op `voiceschanged`.
  - Kies bij voorkeur een stem met `localService: true`: sommige stemmen lopen via een server, en dan zou bijvoorbeeld de naam van het kind het apparaat verlaten.
  - Geen Nederlandse stem beschikbaar: geen spraak, wel geluid en animatie. Nooit een anderstalige stem.
  - Ontgrendel geluid en spraak in de tik-handler van *Toon aan [naam]* (AudioContext hervatten, korte lege uiting), want browsers blokkeren autoplay. Test op iOS Safari en Android Chrome.
- **Zinnen** centraal in `src/content/lines.ts`: kort (maximaal ongeveer 10 woorden), met varianten tegen herhaling (bijlage B). Altijd uitnodigend ("Zullen we … proeven?"), nooit druk ("Je moet …"), geen "gezond/ongezond", geen eten als beloning.
- Optioneel per kind: hoe de naam wordt uitgesproken.
- Geluid en stem staan standaard aan en zijn uit te zetten in Instellingen.

---

## 9. Groenten, recepten en content

### 9.1 Groenten (standaard 14)

| id | Groente | Vriendje | Smaak voor peuters |
|---|---|---|---|
| `wortel` | Wortel | Wortel | makkelijk |
| `courgette` | Courgette | Courgette | makkelijk |
| `pompoen` | Pompoen | Pompoen | makkelijk |
| `komkommer` | Komkommer | Komkommer | makkelijk |
| `tomaat` | Tomaat | Tomaat | makkelijk |
| `doperwten` | Doperwten | Erwtje | makkelijk |
| `bloemkool` | Bloemkool | Bloemkool | gemiddeld |
| `sperziebonen` | Sperziebonen | Boontje | gemiddeld |
| `prei` | Prei | Prei | gemiddeld |
| `paprika` | Paprika | Paprika | uitdagend |
| `broccoli` | Broccoli | Broccoli | uitdagend |
| `spinazie` | Spinazie | Spinazie | uitdagend |
| `rode-biet` | Rode biet | Bietje | uitdagend |
| `spruitjes` | Spruitjes | Spruitje | uitdagend |

De lijst mag anders (gangbaar in Nederland, mix van makkelijk en uitdagend, minimaal 12). Elk vriendje moet ook zonder kleur aan zijn vorm te herkennen zijn.

### 9.2 Zichtbaarheidsladder

Elk recept heeft een niveau: **1 Onzichtbaar** (gepureerd) · **2 Licht zichtbaar** (fijn geraspt of gehakt) · **3 Zichtbaar** (herkenbare stukjes in een vertrouwd gerecht) · **4 Puur** (de groente zelf, bijvoorbeeld broccoliboompjes met een dip). Recepten met varianten combineren niveau 1 en 2. *Volgende stap* = niveau 3 en 4.

### 9.3 Receptregels

- **Per groente (als hoofdgroente):** minstens twee recepten op niveau 1–2, bij voorkeur een saus of dip en een hoofdgerecht (past dat niet bij de groente, kies dan wat wel past: soep, ovenschotel, pannenkoek), met de varianten *extra verstopt* en *licht zichtbaar* waar zinvol; plus één *Volgende stap*-recept. Smoothies tellen hier niet mee.
- **Daarnaast:** de 10 smoothies (herzien, §9.4) en ongeveer 4 langere weekendrecepten (gemarkeerd), bijvoorbeeld een groentelasagne.
- **Totaal minstens 50 recepten.** Kwaliteit gaat voor aantal: liever 50 goede dan 70 matige.
- **Elk recept:** naam, één zin beschrijving, totale tijd (inclusief voorbereiden, dus ook het voorkoken van wortel of broccoli), porties (standaard 4: 2 volwassenen en 2 kinderen), moeilijkheid (makkelijk of gemiddeld), groenten, zichtbaarheid, ingrediënten met hoeveelheid en eenheid, 3–4 stappen (hooguit 5), varianten, tips (verstoppen, bij weerstand, eventueel bewaren of invriezen) en allergenen.
- **Realistisch:** hoeveelheden die kloppen voor 4 personen, gangbare verpakkingen (blik, pak), ingrediënten uit een gewone supermarkt. Als ijkpunt voor de kinderporties: het Voedingscentrum adviseert 50–100 gram groente per dag voor kinderen van 1–3 jaar en 100–150 gram voor 4–8 jaar.
- **Schrijfstijl:** kort, actief, je-vorm: "Rasp de wortel fijn."
- **Niet pittig:** geen chili, sambal, cayennepeper, wasabi of sriracha; peper spaarzaam; kerrie mild en optioneel.
- **Peuterveilig:** zie §13.3.
- Een recept kan meerdere groenten bevatten (`veggies[]`); bij aantikken tellen ze allemaal. Voor de minimumeisen telt alleen `mainVeggie`.

**Vastgelegd in de sessie:**

- *Wortel-tomatensaus:* ui en knoflook bakken → wortel → tomatensaus → kruiden (basilicum, zout, peper). Extra verstopt: wortel eerst zacht koken en pureren. Licht zichtbaar: fijn raspen en ongeveer 5 minuten meebakken.
- *Wortel-gehaktballen:* half wortel, half gehakt; de wortel rauw en fijn geraspt; binden met ei en paneermeel.

### 9.4 Smoothies (herzien)

- Hele groente en fruit (geen sap). Rijp fruit is meestal zoet genoeg: honing en dadels optioneel en zuinig.
- Eerlijke tijd: wortel en broccoli moeten gaar en afgekoeld zijn. Reken het koken mee of gebruik restjes of diepvriesgroente ("met voorgekookte wortel: 5 min").
- Zet `veggies[]` goed (Superheldendrankje: spinazie én broccoli; Regenboog Verrassing: spinazie én wortel; Groene Power: broccoli én spinazie).
- Rauwe courgette: "Proef een stukje; is hij bitter, gebruik hem dan niet."
- Presenteer smoothies als tussendoortje of bij het ontbijt, in een beker aan tafel. Controleer hoe het Voedingscentrum over smoothies voor kinderen schrijft en formuleer de tips daarnaar.
- Namen mogen Nederlandser (bijvoorbeeld "Perzik-wortelsmoothie" in plaats van "Peachy Wortel Smoothie").

### 9.5 Overige content

- **Per groente:** 2–3 tips om te verstoppen, 2–3 tips bij weerstand en 1–2 tips voor de volgende stap.
- **Hulp-pagina:** blijf aanbieden (een nieuwe smaak vraagt vaak tien keer proeven of meer), eet samen en doe het zelf voor, leg een klein beetje naast iets vertrouwds, laat kinderen helpen (wassen, roeren, strooien), geen druk en geen omkoping met een toetje, weigeren hoort erbij. De ouder bepaalt wat, wanneer en waar er gegeten wordt; het kind bepaalt of en hoeveel.
- **Wanneer hulp zoeken:** als je kind afvalt of niet goed groeit, maar heel weinig verschillende dingen eet, vaak kokhalst of zich verslikt, of als eten veel spanning geeft: bespreek het met het consultatiebureau of de huisarts.
- **Disclaimer** (op *Over*): geen medisch advies; recepten en tips zijn algemeen.

### 9.6 Contentvalidatie (`npm run validate:content`, ook in CI)

- **Faalt bij:** ontbrekende hoeveelheden, eenheden of stappen; meer dan 5 stappen; tijd boven 30 minuten zonder `weekend: true`; onbekende groente-id; een groente zonder twee recepten op niveau 1–2 of zonder *Volgende stap* (als hoofdgroente); dubbele id's; pittige ingrediënten (chili, sambal, cayenne, wasabi, sriracha); bekende allergenen zonder label (melk, ei, gluten, noten, pinda, soja, sesam of tahini, selderij, mosterd, vis); hele noten; honing zonder veiligheidstip.
- **Waarschuwt bij:** meer dan 10 ingrediënten; smoothies met meer dan 1 eetlepel toegevoegd zoetmiddel.

---

## 10. Boodschappenlijst en kookmodus

### 10.1 Boodschappenlijst

- Recept toevoegen met de gekozen porties en variant; meerdere recepten komen samen in één lijst.
- Gelijke ingrediënten met omrekenbare eenheden worden opgeteld (g/kg, ml/l, stuks); anders apart, met het recept erbij.
- Gegroepeerd per afdeling: Groente & fruit · Vlees & vis · Zuivel & eieren · Brood & granen · Houdbaar · Diepvries · Kruiden · Overig. Basisvoorraad (zout, peper, olie) ingeklapt onder "Heb je dit in huis?".
- Per item afvinken (gekocht) en "heb ik al in huis"; zelf items toevoegen; een recept van de lijst halen haalt zijn items weg.
- Delen als platte tekst via de Web Share API (anders kopiëren), bijvoorbeeld naar je partner.
- "Afgevinkte weghalen" en "lijst leegmaken".

### 10.2 Kookmodus (zonder timer)

- Vóór de start kies je de variant (extra verstopt of licht zichtbaar) en het aantal porties.
- Eén stap per scherm, grote letters (minstens 22 px), grote knoppen *vorige* en *volgende* en swipen. De ingrediënten van die stap staan erbij; de volledige lijst in een uitklapper.
- Het scherm blijft aan via de Screen Wake Lock API (netjes vrijgeven; stil terugvallen waar het niet werkt).
- Laatste scherm: "Eet smakelijk!" Na het eten staat op *Vandaag* de kaart om aan te tikken (§6.1).

---

## 11. Technische architectuur

### 11.1 Stack (standaardkeuze)

- Vite + React + TypeScript (strict)
- Tailwind CSS + CSS custom properties als design tokens
- React Router met `HashRouter`
- Zustand met persist (opslag in IndexedDB, bijvoorbeeld via `idb-keyval`), schemaversie en migraties
- Zod voor content, opgeslagen data en import
- `vite-plugin-pwa` (Workbox): manifest, iconen, offline precache, update-melding
- lucide-react (iconen ouder-app), `@fontsource/*` (self-hosted fonts), date-fns met `nl`-locale
- Vitest + Testing Library; Playwright voor smoke-tests en screenshots
- ESLint + Prettier; actuele Node LTS (minimaal 20)

Gebruik actuele stabiele versies (geen pre-releases) en controleer API's bij installatie. Een beter alternatief mag (§3), met een regel in `DECISIONS.md`.

### 11.2 Hosting en deploy

- `vite.config.ts`: `base: './'`. Relatieve paden met HashRouter werken onder elke reponaam.
- PWA onder een subpad: `start_url` en `scope` relatief (`./`); test installatie en offline onder de GitHub Pages-URL.
- Workflow `.github/workflows/deploy.yml`: bij een push naar `main` → `npm ci` → lint → test → `validate:content` → build → upload als Pages-artifact → deploy. Gebruik de officiële actions (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`, actuele majors) met `permissions: pages: write, id-token: write`.
- README: beschrijf de handmatige stap *Settings → Pages → Build and deployment → Source: GitHub Actions*.
- Content-Security-Policy via `<meta http-equiv>`: alleen `'self'`, geen externe bronnen, `connect-src 'self'`. Zo strikt als praktisch haalbaar.
- Werkt zonder aanpassingen ook op Netlify of Vercel.

### 11.3 Opslag

- Repository-interfaces (`ChildRepo`, `EventRepo`, `SettingsRepo`, `ShoppingRepo`, `SnapshotRepo`) achter de stores, zodat Fase 2 een sync-adapter kan inpluggen.
- Eén namespace (`fv:v1:`) met schemaversie en migraties.
- Render pas als de stores zijn ingeladen (IndexedDB is asynchroon); anders flitst de onboarding voorbij bij een bestaande gebruiker.
- Vraag na de onboarding persistente opslag aan (`navigator.storage.persist()`) en toon de status in Instellingen.
- **Installeren helpt:** Safari kan gegevens wissen van websites die een tijd niet zijn gebruikt; voor apps op het beginscherm geldt dat niet. Op iOS kan de app op het beginscherm bovendien een eigen opslag hebben, los van Safari. Stimuleer daarom installeren tijdens de onboarding en vang een overstap op met export en import. Controleer het actuele gedrag.
- **Mijn data:** exporteren als JSON-bestand (met de melding dat de naam van het kind erin staat), importeren met Zod-validatie en bevestiging, alles wissen met dubbele bevestiging.
- Klok-abstractie `clock.now()` in alle domeinlogica (nooit direct `Date.now()`), zodat tijd in tests en in het dev-paneel te verschuiven is.
- Domeinlogica als pure, geteste functies in `src/domain/`: groei, krimp, momenten, daglimiet, recept van de dag, porties en boodschappen.

### 11.4 Mappenstructuur (voorstel)

```
.
├─ .github/workflows/deploy.yml
├─ public/                        # app-iconen, manifest-assets
├─ scripts/validate-content.ts
├─ src/
│  ├─ app/                        # router, layout, providers, PWA-update
│  ├─ config/                     # growth.ts, app.ts
│  ├─ i18n/nl.ts                  # UI-teksten ouder-app
│  ├─ content/
│  │  ├─ veggies.ts · phases.ts · lines.ts · tips.ts
│  │  └─ recipes/                 # één bestand per groente
│  ├─ domain/                     # growth, shrink, moments, limits, daily-recipe, scaling, shopping
│  ├─ features/
│  │  ├─ today/ · logging/ · veggie/ · recipes/ · cook/ · shopping/
│  │  ├─ garden/                  # wereld, zones, plaatsing, camera, momentenspeler
│  │  └─ onboarding/ · settings/ · help/
│  ├─ characters/                 # VeggieCharacter, onderdelen, rekwisieten, dieren
│  ├─ audio/                      # geluidjes (Web Audio), stem (Web Speech)
│  ├─ store/                      # stores, persist, migraties, repos
│  ├─ components/                 # Button, Sheet, Snackbar, ProgressBar, …
│  ├─ styles/                     # tokens.css
│  └─ lib/                        # clock, seeded-rng, share, wake-lock, storage, fullscreen
├─ tests/                         # unit en e2e
└─ BRIEFING.md · CLAUDE.md · DECISIONS.md · README.md · CREDITS.md
```

### 11.5 Dev-paneel

Alleen in dev of met `?dev=1`: tijd verschuiven (dagen vooruit, voor krimp en het recept van de dag), registraties toevoegen per kind en groente, een fase direct zetten, momenten opnieuw afspelen, alle zinnen en stemmen testen, data resetten en een fps-meter in de tuin.

---

## 12. Datamodel (kern)

```ts
type VeggieId =
  | 'wortel' | 'courgette' | 'pompoen' | 'komkommer' | 'tomaat' | 'doperwten' | 'bloemkool'
  | 'sperziebonen' | 'prei' | 'paprika' | 'broccoli' | 'spinazie' | 'rode-biet' | 'spruitjes';

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;   // 0 = nog niet ontdekt
type Visibility = 1 | 2 | 3 | 4;                       // onzichtbaar · licht zichtbaar · zichtbaar · puur
type Allergen = 'gluten' | 'ei' | 'melk' | 'noten' | 'pinda' | 'soja' | 'sesam'
  | 'selderij' | 'mosterd' | 'vis' | 'schaaldieren' | 'weekdieren' | 'lupine' | 'sulfiet';
type Section = 'groente-fruit' | 'vlees-vis' | 'zuivel-eieren' | 'brood-granen'
  | 'houdbaar' | 'diepvries' | 'kruiden' | 'overig';
type Unit = 'g' | 'kg' | 'ml' | 'l' | 'el' | 'tl' | 'stuks' | 'teentje' | 'blik' | 'pak' | 'snufje';

interface Veggie {
  id: VeggieId;
  name: string;                 // 'Doperwten'
  buddyName: string;            // 'Erwtje'
  taste: 'makkelijk' | 'gemiddeld' | 'uitdagend';
  palette: { body: string; shade: string; accent: string; leaf?: string };
  tips: { verstoppen: string[]; weerstand: string[]; volgendeStap: string[] };
}

interface PhaseDef {
  phase: Exclude<Phase, 0>;
  animal: string;               // 'konijn'
  power: string;                // 'helpen met de boodschappen'
  prop: string;                 // 'boodschappentas'
}

interface Child {
  id: string;
  name: string;                 // voornaam of bijnaam
  spokenName?: string;          // uitspraak voor de stem
  color: string;                // token
  createdAt: string;
}

interface EatEvent {
  id: string;
  childId: string;
  veggieId: VeggieId;
  at: string;                   // ISO
  source: 'plus' | 'raster' | 'recept';
  recipeId?: string;
  visibility?: Visibility;
}

interface PracticeEvent {      // Weer oefenen aan of uit
  id: string;
  childId: string;
  veggieId: VeggieId;
  at: string;
  enabled: boolean;
}

interface GardenSnapshot {     // wat het kind het laatst heeft gezien
  childId: string;
  seenAt: string;
  veggies: Partial<Record<VeggieId, { phase: Phase; drops: number }>>;
}

interface Ingredient {
  name: string;
  qty?: number;
  unit?: Unit;
  section: Section;
  basic?: boolean;              // basisvoorraad: zout, peper, olie
  optional?: boolean;
  variant?: 'verstopt' | 'zichtbaar';
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'hoofdgerecht' | 'saus-dip' | 'soep' | 'smoothie' | 'ontbijt-bakken' | 'snack';
  mainVeggie: VeggieId;
  veggies: VeggieId[];          // alle groenten die erin zitten
  visibility: Visibility;
  hasVariants: boolean;         // extra verstopt / licht zichtbaar
  nextStep: boolean;            // categorie Volgende stap
  weekend?: boolean;            // langer dan 30 minuten
  timeMinutes: number;          // totaal, inclusief voorbereiden
  servings: number;             // standaard 4 (2 volwassenen + 2 kinderen)
  difficulty: 'makkelijk' | 'gemiddeld';
  ingredients: Ingredient[];
  steps: (string | { verstopt: string; zichtbaar: string })[];   // 3–4, max. 5
  tips: { verstoppen?: string; weerstand?: string; bewaren?: string; veiligheid?: string };
  allergens: Allergen[];
}

interface ShoppingItem {
  id: string;
  name: string;
  qty?: number;
  unit?: Unit;
  section: Section;
  bought: boolean;
  atHome: boolean;
  recipeIds: string[];
  manual?: boolean;
}

interface Settings {
  perPhase: 2 | 3;              // standaard 3
  dailyCap: number;             // standaard 2
  regrowPerPhase: number;       // standaard 2
  shrinkDays: number;           // standaard 7
  maxShrink: number;            // standaard 3
  sound: boolean;               // standaard aan
  speech: boolean;              // standaard aan
  voiceURI?: string;
  reveal: boolean;              // onthulmoment, standaard aan
  enabledVeggies: VeggieId[];
  allergies: Allergen[];
  parentNames?: string[];       // bijv. ['mama', 'papa'], optioneel
  favoriteRecipeIds: string[];
}
```

---

## 13. Privacy, voedselveiligheid en verantwoord belonen

### 13.1 Privacy

- Alles lokaal; tijdens gebruik geen netwerkverzoeken buiten de eigen origin (te controleren in een Playwright-test).
- Van het kind alleen naam of bijnaam (en optioneel de uitspraak); geen geboortedatum, geen foto's.
- Korte privacyverklaring op *Over*. Geen analytics, geen cookies.
- Vóór Fase 2 (accounts, sync) is een nieuwe privacytoets nodig: het gaat om gegevens van kinderen.

### 13.2 Verantwoord belonen (geldt voor alle teksten, zinnen en mechanismen)

- Beloon proeven en kennismaken, nooit een leeg bord.
- Geen eten als beloning of ruilmiddel (geen toetje).
- Vriendjes zijn altijd blij, verrast of trots; nooit verdrietig, ziek, hongerig of boos.
- Krimpen alleen via *Weer oefenen*, en dan zacht (§7.3). Het kind krijgt nooit de boodschap dat het iets fout deed.
- Verstoppen is een hulpmiddel, geen einddoel: de app helpt richting herkenbare groente (*Volgende stap*, onthulmoment).
- In de ouder-app geen gezondheidsclaims; de kracht van de vriendjes is spelfantasie in de tuin.

### 13.3 Voedselveiligheid voor peuters (contentregels)

Controleer de actuele adviezen van het Voedingscentrum en verwerk ze in recepten en tips. In ieder geval:

- **Verslikgevaar:** geen hele noten of pinda's voor kinderen onder de 4 jaar; gebruik notenpasta zonder toegevoegd suiker en zout, of fijngemalen noten. Druiven, cherrytomaten en grote bessen in de lengte halveren of in vieren; harde rauwe groente raspen, dun snijden of zacht koken. Ook oudere kinderen eten rustig aan tafel.
- **Zout:** weinig; geen extra zout voor de kinderportie; let op bouillonblokjes en kant-en-klare sauzen (kies zoutarm).
- **Honing:** niet voor kinderen onder 1 jaar; zet dat als tip bij elk recept met honing.
- **Nitraatrijke groenten** (spinazie, rode biet): voor peuters gewoon te eten, ook vaker per week. Het oude advies van maximaal twee keer per week is vervallen; de beperking geldt alleen voor baby's jonger dan 6 maanden. Restjes snel afkoelen en in de koelkast bewaren. Combineer ze in recepten niet met vis.
- **Niet pittig** (§9.3).
- **Allergenen:** label per recept; het filter in Instellingen verbergt recepten met de gekozen allergenen.

### 13.4 Het kind in de app houden

De hulp-pagina legt kort uit hoe **Begeleide toegang** (iPad) en **App vastzetten** (Android) werken, zodat het kind de tuin niet per ongeluk verlaat. De tuin is bedoeld voor korte momenten rond het eten.

---

## 14. Design: mooi en rustig

De PO wil vooral dat de app er mooi en niet te druk uitziet. Dat is geen afwerking achteraf maar een ontwerpeis vanaf de eerste mijlpaal.

### 14.1 Rust-regels (overal)

- **Eén focuspunt** per scherm en per moment. Wat niet nodig is, staat er niet.
- **Ruimte:** royale marges en witruimte; maximaal één primaire knop per schermdeel.
- **Kleur:** een warme, neutrale basis (crème, zacht zand) met één accentkleur, bijvoorbeeld een diep, zacht groen. Groentekleuren alleen in de illustraties en kleine accenten. Geen gekleurde kaders, badges of achtergrondverlopen per groente.
- **Geen emoji** in de interface: illustraties en één iconenset (lucide, overal dezelfde lijndikte).
- **Typografie:** maximaal twee families en drie à vier tekstgroottes per scherm; korte zinnen.
- **Vorm:** één afrondingsmaat en één schaduwniveau voor kaarten, consequent toegepast.
- **Beweging in de ouder-app:** alleen functioneel (200–300 ms, ease-out). Geen pulserende, stuiterende of bij hover opschalende elementen.
- **Beeld:** er zijn geen foto's; elk recept krijgt de illustratie van zijn hoofdgroente op een zachte tegel.

### 14.2 De tuin: levendig maar rustig

- Achtergrond zacht en wat gedempt (lichte tinten, lage verzadiging), zodat de vriendjes de kleur dragen.
- Per zone twee à drie herkenbare objecten; veel lucht en gras.
- In rust ademen en knipperen de vriendjes; ze wandelen af en toe, nooit allemaal tegelijk. Hooguit twee à drie kleine bewegende details tegelijk in beeld (een eend, een vlinder).
- De zaadjes van nog niet ontdekte groenten liggen netjes op een rij in één moestuinbed.
- Tijdens een moment wordt de rest van de tuin iets gedimd en richt de camera zich op één vriendje.
- Confetti kort (ongeveer 1,5 seconde) en zuinig; geluid zacht.
- Het overzicht toont minder detail dan de zone-weergave.
- Geen interface in de tuin behalve de kleine *Ouder*-knop.
- Stijl: vlakke vormen met subtiele schaduw en zachte texturen, als een rustig prentenboek met veel lucht.

### 14.3 Verder

- **Sfeer:** een zonnige moestuin; zacht, warm en rond.
- **Kleuren** via CSS custom properties, ook per groente (bijvoorbeeld `--veg-wortel-body`). **Geen** dynamisch samengestelde Tailwind-classnames (§15).
- **Typografie:** self-hosted met open licentie, bijvoorbeeld Nunito voor koppen en Atkinson Hyperlegible voor lopende tekst.
- **Tikvlakken:** minstens 48 px, primaire acties 56 px.
- **Microcopy:** warm en kort. "Elke hap telt." · "Weigeren hoort erbij. Morgen weer een kans." · "Kijk wie er op je wacht!" · lege staat: "Vandaag nog niks aangetikt. Geen zorgen."
- **Toegankelijkheid ouder-app (WCAG 2.2 AA):** contrast, zichtbare focus, volledig met toetsenbord te bedienen, toegankelijke namen op icoonknoppen, schaalbare tekst, voortgang niet alleen via kleur.
- **Tuin:** `prefers-reduced-motion`, geen flitsen, geluid nooit hard.
- **Responsief:** ouder-app van 360 px tot tablet (op tablet twee kolommen waar zinvol); tuin landscape-first, ook portrait.
- **Leeg-, laad- en foutstaten** overal ontworpen, in de toon van de app.

---

## 15. Valkuilen uit het prototype (niet herhalen)

Het prototype uit de sessie (één React-bestand) liet het idee zien, maar had deze problemen:

1. **Te druk:** verlopen op bijna elke kaart en knop, emoji als iconen, gekleurde kaders per groente, pulserende wolken en stuiterende decoraties. → de rust-regels uit §14.
2. **Dynamische Tailwind-classnames** (`` `bg-${veggie.color}-500` ``): Tailwind genereert die niet, dus plusknoppen en voortgangsbalken hadden geen kleur. → CSS-variabelen en tokens.
3. **Recept van vandaag via `Math.random()` bij elke render:** het recept wisselde bij elke tik. → vast per dag.
4. **Geen persistentie:** alle voortgang weg na herladen; fataal voor een app over groeien. → persist, persistente opslag, back-up.
5. **Emoji als karakters** (🥕 geschaald via tekstgrootte, dieren-emoji als label): verschilt per apparaat en is niet te animeren. → eigen SVG-karakters.
6. **Kindscherm vol tekst** ("Jouw Prestaties", activiteitzinnen): peuters lezen niet. → beeld, beweging en stem.
7. **Zones hard-coded** met `slice(0, 2)` en `slice(2, 4)`: schaalt niet naar 14 groenten. → plaatsingsalgoritme.
8. **Eén tik op de terugknop** en het kind zat in de ouder-app. → vasthouden.
9. **Een nooit gegeten groente** werd al als "Mier" getoond. → fase 0 (zaadje).
10. **Eén `veggie` per recept**, terwijl smoothies er meerdere bevatten. → `veggies[]`.
11. **Recepten zonder hoeveelheden, stappen, porties en varianten;** smoothies met "5 min" terwijl de wortel eerst gekookt moet worden. → volledige recepten met eerlijke tijden.
12. **De knop Boodschappen deed niets**, en er was geen ongedaan maken.
13. **"Vandaag's recept"** (anglicisme). → "Recept van vandaag". Taal telt.
14. **Uit het eerdere lunch-prototype:** componenten binnen componenten gedefinieerd (focusverlies, state kwijt) en `saveData()` direct na `setState` (bewaart de oude state). → componenten op moduleniveau; persist-middleware.
15. **Icoonknoppen zonder toegankelijke naam.**

---

## 16. Oplevering: acceptatiecriteria

**Platform**

- [ ] Draait op GitHub Pages via GitHub Actions; deeplinks werken na herladen.
- [ ] Installeerbaar als PWA (Android Chrome, en iOS Safari via "Zet op beginscherm"); werkt offline na het eerste bezoek; melding bij een nieuwe versie.
- [ ] Data blijft bewaard na herladen en herstarten; persistente opslag wordt aangevraagd; exporteren, importeren en wissen werken.
- [ ] Tijdens gebruik geen netwerkverzoeken buiten de eigen origin.

**Ouder-app**

- [ ] Onboarding met één of meer kinderen en optioneel al bekende groenten; verschijnt daarna niet meer.
- [ ] *Vandaag:* recept van de dag (vast per dag, *Ander recept* werkt) en groente-overzicht (alfabetisch; icoon, naam, voortgangsbalk, plusknop).
- [ ] Aantikken via de plusknop, via het raster (meerdere groenten en kinderen) en vanuit een recept (voorgeselecteerd); ongedaan maken en daglimiet werken.
- [ ] *Toon aan [naam]* opent direct de tuin van dat kind en speelt de nieuwe momenten af.
- [ ] Groente-detail met voortgang per kind, geschiedenis met verwijderen, *Weer oefenen*, tips en recepten per zichtbaarheid.

**Groei**

- [ ] Fase 0 → 1 bij de eerste keer; elke 3 (of ingesteld 2) registraties een fase verder; maximaal fase 9; correct per kind en per groente.
- [ ] Zonder *Weer oefenen* krimpt nooit iets; met *Weer oefenen* volgens §7.3 (unit-tests met verschoven klok).
- [ ] Momenten (onthulling, ontdekking, druppel, groei, mentor) worden precies één keer en in de goede volgorde afgespeeld.

**Tuin**

- [ ] Volledig scherm, zonder leestekst; zones herkenbaar aan objecten; overzicht, inzoomen op een zone, close-up van een vriendje, horizontaal swipen.
- [ ] Minimaal 12 (standaard 14) originele SVG-vriendjes met ogen, armpjes en beentjes die zwaaien, lopen en dansen; 9 rekwisieten; 9 dieren.
- [ ] Bij openen zwaaien en een geluidje; vriendjes en objecten reageren op aanraking.
- [ ] Groeimoment: groter, dansje, confetti, geluid, dier ernaast, nieuwe kracht.
- [ ] De walvis-mentor spreekt hoogstens één uitnodiging per bezoek uit (geen tekst).
- [ ] De *Ouder*-knop reageert alleen op 1,5 seconde vasthouden.
- [ ] Vloeiend op een gemiddelde tablet (doel 60 fps); reduced motion gerespecteerd.
- [ ] Spraak in het Nederlands of geen spraak; geluid en stem zijn uit te zetten.

**Recepten en praktisch**

- [ ] Minstens 50 recepten volgens §9 (waaronder 10 smoothies, per groente een *Volgende stap* en ongeveer 4 weekendrecepten); `validate:content` slaagt.
- [ ] Recept: varianten wisselen, porties omrekenen, allergenen en tips; filters (groente, soort, tijd, zichtbaarheid, allergieën, favorieten) en zoeken.
- [ ] Boodschappenlijst: optellen, groeperen, afvinken, "heb ik al", zelf toevoegen, delen als tekst.
- [ ] Kookmodus: stap voor stap, grote tekst, scherm blijft aan, geen timer.

**Mooi en rustig**

- [ ] Screenshots voldoen aantoonbaar aan de rust-regels (§14.1): één focuspunt, geen emoji, geen verlopen op kaarten en knoppen, beperkt kleurgebruik, consistente vormen.
- [ ] De tuin oogt levendig maar niet druk (§14.2), zowel in rust als tijdens een groeimoment.

**Kwaliteit**

- [ ] Unit-tests voor groei, krimp, momenten, daglimiet, recept van de dag, porties, boodschappen, migraties en import.
- [ ] Playwright-smoke: onboarding → aantikken → tuin → groeimoment → *Ouder* vasthouden → herladen → voortgang bewaard.
- [ ] Screenshots van de tuin (1180×820, 820×1180, 1024×768) en de ouder-app (390×844, 820×1180) gemaakt, bekeken en verbeterd.
- [ ] Geen dynamische Tailwind-classnames, geen componenten binnen componenten.
- [ ] Lighthouse mobiel: Accessibility ≥ 95, Performance ≥ 90 (streefwaarden).
- [ ] `README.md`, `CLAUDE.md`, `DECISIONS.md` en `CREDITS.md` aanwezig.

---

## 17. Open beslispunten (met standaardkeuze)

| # | Beslispunt | Standaard, tot de PO anders beslist |
|---|---|---|
| 1 | Naam | Werktitel "Familie Vriendelijk"; de tuin heet "Groentetuin". Doe in het eindrapport 5–10 naamvoorstellen |
| 2 | Registraties per fase | 3 (instelbaar 2) |
| 3 | Daglimiet | 2 per groente per kind per dag |
| 4 | Weer oefenen | 1 fase per 7 dagen, maximaal 3 onder het record, terug groeien met 2 per fase |
| 5 | Groentelijst | 14 (§9.1) |
| 6 | Onthulmoment | Aan |
| 7 | Stem | Web Speech (nl-NL); ingesproken zinnen in Fase 3 |
| 8 | Ouders in de krachten | Neutraal; namen optioneel |
| 9 | Tuin automatisch sluiten na een paar minuten | Nee; de ouder bepaalt |
| 10 | Hosting | GitHub Pages (Netlify of Vercel kan ook) |
| 11 | Backend Fase 2 | Supabase |

---

## 18. Roadmap

- **Fase 2:** gezinsaccount, synchronisatie tussen ouder-telefoon en kind-tablet, back-up in de cloud, meerdere ouders en verzorgers.
- **Fase 3:** eigen groenten toevoegen, ingesproken zinnen (bijvoorbeeld door de ouder zelf), meer recepten, Engelstalige versie.

---

## 19. Werkafspraken en oplevering

### 19.1 Algemeen

- **Taal:** alle content en communicatie met de PO in het Nederlands. Code in het Engels; Nederlandse domeintermen mogen waar dat duidelijker is (`verstopt`, `zichtbaar`), consequent toegepast.
- **Autonoom:** dit is een one-shot. Vraag niets vooraf; kies, noteer en ga door.
- **Feiten:** bij twijfel over een voedingsadvies: opzoeken bij het Voedingscentrum, of weglaten.

### 19.2 Mijlpalen (in deze volgorde, commit per mijlpaal)

1. **Fundament:** Vite, TypeScript, Tailwind, router, design tokens volgens §14, PWA-basis, deploy-workflow, stores met persist en migraties, klok, dev-paneel. Deploy meteen.
2. **Domeinlogica en tests:** groei, krimp, momenten, daglimiet, recept van de dag, porties, boodschappen.
3. **Content:** groenten, fases, recepten (minstens 50), tips, zinnen, `validate:content`.
4. **Ouder-app:** onboarding, Vandaag, Gegeten, groente-detail, recepten met filters, instellingen.
5. **Karakters:** SVG-systeem, alle vriendjes, stemmingen en poses, rekwisieten, dieren.
6. **Tuin:** wereld, zones, plaatsing, overzicht, zoom en close-up, momentenspeler, interacties, *Ouder*-knop.
7. **Geluid en stem.**
8. **Boodschappenlijst en kookmodus.**
9. **Afwerking:** toegankelijkheid, performance, offline- en installatietest, Lighthouse, documentatie.

### 19.3 Zelfcontrole

- Na elke mijlpaal: lint, tests en build groen.
- Na elke UI-mijlpaal: Playwright-screenshots op de maten uit §16, en die kritisch bekijken. Is het mooi en rustig? Leg ze naast de rust-regels uit §14 en haal weg wat niet nodig is. Begrijpt een peuter de tuin zonder uitleg?
- Controleer de recepten steekproefsgewijs op logica: kloppen hoeveelheden, tijd en volgorde?
- Laat aan het eind een aparte subagent zonder voorkennis de app toetsen aan §16 en een steekproef van de recepten nalopen, en verwerk de bevindingen.

### 19.4 Eindrapport (in de chat en als `RAPPORT.md`)

- Wat werkt, met de URL; wat (nog) niet.
- Verbeteringen en afwijkingen ten opzichte van deze briefing, met verwijzing naar `DECISIONS.md`.
- Bekende beperkingen (bijvoorbeeld stemkwaliteit per apparaat) en handmatige stappen (Pages aanzetten).
- 5–10 naamvoorstellen.
- Eventuele vragen voor de PO, in het vraagformat van de PO:
  - genummerd (1, 2, 3 …), maximaal 10 per keer, met een witregel vóór elke vraag;
  - per vraag minstens 5 en maximaal 10 antwoordsuggesties als a, b, c …, elk voorafgegaan door een witregel, en een witregel na de laatste suggestie;
  - is er een duidelijke standaardkeuze, vraag dan niet maar meld wat je kiest.

---

## Bijlage A — Recepten uit het prototype (startmateriaal)

Herschrijf ze volledig volgens §9.3 en §9.4; de namen mogen beter. In een deel van de smoothies zat honing of dadels; maak dat optioneel en zuinig.

**Hoofdgerechten, sauzen en dips**

| Recept | Groente | Uit het prototype |
|---|---|---|
| Wortel-tomatensaus | wortel | ui, knoflook, wortel, tomatensaus, basilicum; 25 min |
| Wortel-gehaktballen | wortel | half wortel, half gehakt; ei, paneermeel, zout, peper; 30 min |
| Courgette-witte saus | courgette | geraspte courgette in een romige witte saus (boter, bloem, melk, kaas, nootmuskaat) voor pasta; 20 min |
| Courgette-ovenschotel | courgette | pasta, geraspte courgette, room, kaas, ei, kruiden; 35 min (weekend, of korter maken) |
| Groene hummus | spinazie | kikkererwten, tahini, spinazie, citroen, knoflook; 15 min |
| Spinazie-gehaktburgers | spinazie | gehakt, fijngesneden spinazie, ui, ei, paneermeel; 25 min |
| Broccoli-kaassaus | broccoli | gepureerde broccoli in kaassaus voor pasta of aardappels; 20 min |
| Verborgen-broccoliballen | broccoli | gehaktballen met fijngehakte broccoli, ei, paneermeel, ui; 30 min |

**Smoothies**

| Smoothie | Groente(n) | Uit het prototype |
|---|---|---|
| Oranje Droom Smoothie | wortel (gekookt) | mango, banaan, vanilleyoghurt, honing |
| Groene Monster Smoothie | spinazie | banaan, appel, ananas, kokoswater |
| Tropische Verborgen Smoothie | courgette (rauw) | mango, ananas, kokosmelk, banaan |
| Groene Power Smoothie | broccoli (gekookt), spinazie | groene appel, peer, limoen |
| Worteltaart Smoothie | wortel (gekookt) | banaan, havermout, kaneel, amandelmelk |
| Regenboog Verrassing | spinazie, wortel (gekookt) | banaan, aardbeien, yoghurt |
| Vanille Groene Smoothie | courgette (rauw) | banaan, vanilleyoghurt, honing, ijs |
| Superheldendrankje | spinazie, broccoli (gekookt) | blauwe bessen, banaan, melk |
| Chocolade Groente Shake | courgette (rauw) | banaan, cacao, melk, dadels |
| Peachy Wortel Smoothie | wortel (gekookt) | perzik, banaan, vanille, amandelmelk |

---

## Bijlage B — Voorbeeldzinnen voor de stem

Kort, warm en uitnodigend. Maak per moment 3–5 varianten.

| Moment | Voorbeeld |
|---|---|
| Tuin openen | "Hoi Noor!" · "Daar ben je weer!" |
| Aanraken | "Hihi, dat kriebelt!" · "Ik ben Broccoli!" |
| Onthulling | "Er zat wortel in je eten!" |
| Ontdekking | "Hoera, een nieuw vriendje: Pompoen!" |
| Druppel | "Mmm, lekker! Ik word al sterker!" |
| Groei | "Kijk! Wortel is zo groot als een konijn!" · "Wortel kan nu helpen met de boodschappen!" |
| Mentor | "Broccoli wil ook groot worden. Zullen we broccoli eens proeven?" |
| Vóór het eten | "Hoi! Ik ben Pompoen. Als jij een hapje proeft, groei ik!" |
| Weer oefenen | "Broccoli wil weer groeien!" |
| **Nooit** | "Je moet …" · "Als je niet eet, …" · "Eet je bord leeg" · "gezond" of "ongezond" |
