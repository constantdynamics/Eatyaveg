import {
  bieslook,
  citroen,
  defineRecipe,
  griekseYoghurt,
  ing,
  kipfilet,
  knoflook,
  komkommer,
  olie,
  paprikapoeder,
  roomkaas,
  wraps,
  zout,
} from './_helpers';

export const komkommerRecipes = [
  defineRecipe({
    id: 'komkommerdip',
    name: 'Frisse komkommerdip',
    description: 'Koele yoghurtdip met komkommer, lekker bij wraps, kip of aardappeltjes.',
    category: 'saus-dip',
    mainVeggie: 'komkommer',
    visibility: 1,
    timeMinutes: 10,
    ingredients: [
      komkommer(0.5),
      griekseYoghurt(250),
      knoflook(0.5),
      ing('verse dille', 1, 'el', 'kruiden', { note: 'of 1 tl gedroogd' }),
      citroen(0.5),
      zout(),
    ],
    steps: [
      {
        verstopt:
          'Schil de komkommer, haal de zaadjes eruit en pureer hem fijn. Laat het vocht uitlekken in een zeef.',
        zichtbaar: 'Rasp de komkommer met schil en knijp het vocht eruit.',
      },
      'Pers de knoflook en meng hem met de yoghurt, de dille en een paar druppels citroensap.',
      'Roer de komkommer erdoor. Doe pas na het opscheppen van de kinderportie een snufje zout bij de rest.',
    ],
    tips: {
      verstoppen: 'Geschilde, gepureerde komkommer zie je bijna niet in de witte dip.',
      weerstand:
        'Geef je kind iets vertrouwds om te dippen, zoals een stukje brood. Laat de knoflook weg als je kind van mild houdt.',
      bewaren: '2 dagen in de koelkast.',
    },
    allergens: ['melk'],
  }),
  defineRecipe({
    id: 'kipwraps-komkommersaus',
    name: 'Kipwraps met komkommersaus',
    description: 'Wraps met kip en een frisse saus waarin de komkommer verdwijnt.',
    category: 'hoofdgerecht',
    mainVeggie: 'komkommer',
    visibility: 1,
    timeMinutes: 25,
    ingredients: [
      kipfilet(400),
      paprikapoeder(1),
      olie(1),
      komkommer(1),
      griekseYoghurt(200),
      wraps(8),
    ],
    steps: [
      'Snijd de kipfilet in reepjes, bestrooi ze met paprikapoeder en bak ze in de olijfolie in 6 tot 8 minuten gaar.',
      {
        verstopt: 'Schil een halve komkommer, pureer hem en meng hem door de yoghurt.',
        zichtbaar: 'Rasp een halve komkommer, knijp hem uit en meng hem door de yoghurt.',
      },
      'Verwarm de wraps kort in een droge pan. Snijd de rest van de komkommer in staafjes.',
      'Besmeer de wraps met de komkommersaus, leg de kip erop en rol ze op. Leg de staafjes erbij.',
    ],
    tips: {
      verstoppen: 'De saus maakt de wrap sappig; de komkommer valt erin weg.',
      weerstand: 'Laat iedereen zijn eigen wrap vullen. Zelf kiezen helpt.',
      veiligheid: 'Snijd de wrap voor kleine kinderen in plakjes.',
    },
    allergens: ['gluten', 'melk'],
  }),
  defineRecipe({
    id: 'komkommerstaafjes-dip',
    name: 'Komkommerstaafjes met kruidendip',
    description: 'Knapperige staafjes en een romige dip, om samen van te pakken.',
    category: 'snack',
    mainVeggie: 'komkommer',
    visibility: 4,
    nextStep: true,
    timeMinutes: 10,
    ingredients: [komkommer(1), roomkaas(100), griekseYoghurt(50), bieslook(1)],
    steps: [
      'Was de komkommer en snijd hem in staafjes of halve maantjes.',
      'Roer de roomkaas los met de yoghurt en de bieslook.',
      'Zet de komkommer en de dip midden op tafel, zodat iedereen zelf kan pakken.',
    ],
    tips: {
      weerstand: 'Laat je kind kiezen tussen staafjes en maantjes.',
      veiligheid: 'Snijd voor de kleinsten dunne halve maantjes.',
    },
    allergens: ['melk'],
  }),
];
