import {
  basilicum,
  defineRecipe,
  ei,
  gehakt,
  griekseYoghurt,
  bieslook,
  knoflook,
  olie,
  oregano,
  paneermeel,
  paprikapoeder,
  passata,
  pasta,
  peper,
  ui,
  wortel,
  zout,
  ZOUT_STAP,
} from './_helpers';

export const wortelRecipes = [
  defineRecipe({
    id: 'wortel-tomatensaus',
    name: 'Wortel-tomatensaus',
    description: 'Zachte tomatensaus voor bij pasta, met wortel die niemand ziet.',
    category: 'saus-dip',
    mainVeggie: 'wortel',
    veggies: ['wortel', 'tomaat'],
    visibility: 1,
    timeMinutes: 30,
    ingredients: [
      pasta(350, 'pasta', 'bijvoorbeeld penne'),
      olie(1),
      ui(1),
      knoflook(1),
      wortel(300),
      passata(500),
      basilicum(1),
      zout(),
      peper(),
    ],
    steps: [
      {
        verstopt: 'Schil de wortel, snijd hem in plakjes en kook hem in 12 minuten zacht.',
        zichtbaar: 'Schil de wortel en rasp hem fijn.',
      },
      'Snipper de ui en de knoflook en bak ze in de olijfolie in 3 minuten zacht.',
      {
        verstopt: 'Pureer de wortel met een scheutje kookvocht en roer hem door de ui.',
        zichtbaar: 'Bak de geraspte wortel ongeveer 5 minuten mee tot hij zacht is.',
      },
      `Voeg de passata en de basilicum toe en laat 10 minuten zachtjes pruttelen. Kook ondertussen de pasta en meng hem met de saus. ${ZOUT_STAP}`,
    ],
    tips: {
      verstoppen:
        'Pureer de hele saus aan het eind nog even met de staafmixer: dan zie je niets meer van de wortel.',
      weerstand: 'Zet de saus in een schaaltje naast de pasta, zodat je kind zelf kan dippen.',
      bewaren:
        'De saus blijft 3 dagen goed in de koelkast en 3 maanden in de vriezer. Vries hem in kleine porties in.',
    },
    allergens: ['gluten'],
  }),
  defineRecipe({
    id: 'wortel-gehaktballetjes',
    name: 'Wortel-gehaktballetjes',
    description:
      'Sappige balletjes van half gehakt, half wortel; lekker met aardappeltjes of in tomatensaus.',
    category: 'hoofdgerecht',
    mainVeggie: 'wortel',
    visibility: 1,
    timeMinutes: 30,
    ingredients: [
      wortel(300),
      gehakt(300),
      ui(1),
      ei(1),
      paneermeel(50),
      oregano(1),
      peper(),
      olie(2),
    ],
    steps: [
      {
        verstopt:
          'Schil de wortel en rasp hem op de fijnste kant van de rasp. Knijp het vocht eruit in een schone theedoek.',
        zichtbaar:
          'Schil de wortel, rasp hem grof en knijp het vocht eruit in een schone theedoek.',
      },
      'Snipper de ui heel fijn. Meng het gehakt met de wortel, de ui, het ei, het paneermeel, de oregano en wat peper.',
      'Draai er met natte handen ongeveer 20 balletjes van.',
      'Bak de balletjes in de olijfolie in 12 tot 15 minuten rondom bruin en gaar. Ze zijn gaar als ze vanbinnen niet meer roze zijn.',
    ],
    tips: {
      verstoppen:
        'Serveer de balletjes in tomatensaus: dan vallen de oranje spikkeltjes helemaal weg.',
      weerstand:
        'Maak een paar mini-balletjes voor kleine handjes; prikken met een vorkje is extra leuk.',
      bewaren: 'Rauwe balletjes kun je invriezen. Laat ze in de koelkast ontdooien en bak ze dan.',
      veiligheid:
        'Geen zout in het gehakt: dan kan de kinderportie zonder. Zout eventueel aan tafel, alleen bij de volwassenen.',
    },
    allergens: ['ei', 'gluten'],
  }),
  defineRecipe({
    id: 'wortelfrietjes',
    name: 'Wortelfrietjes uit de oven',
    description: 'Zoete, zachte frietjes van wortel met een frisse yoghurtdip.',
    category: 'snack',
    mainVeggie: 'wortel',
    visibility: 4,
    nextStep: true,
    timeMinutes: 30,
    ingredients: [wortel(500), olie(1), paprikapoeder(0.5), griekseYoghurt(150), bieslook(1)],
    steps: [
      'Verwarm de oven voor op 220 °C en breng water aan de kook. Schil de wortels en snijd ze in frietjes van een halve centimeter dik.',
      'Kook de frietjes 4 minuten voor, laat ze goed uitlekken en hussel ze met de olijfolie en het paprikapoeder.',
      'Bak ze op een bakplaat met bakpapier in 15 minuten zacht en goudbruin; keer ze halverwege.',
      'Roer de bieslook door de yoghurt voor de dip.',
    ],
    tips: {
      weerstand: 'Leg ook een paar frietjes op je eigen bord en dip ze samen.',
      veiligheid:
        'Geef jonge kinderen alleen goed zachte frietjes: harde rauwe wortel is een verslikrisico.',
    },
    allergens: ['melk'],
  }),
];
