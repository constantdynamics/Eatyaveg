import {
  bloem,
  boter,
  broccoli,
  defineRecipe,
  ei,
  gehakt,
  kaas,
  melk,
  nootmuskaat,
  olie,
  paneermeel,
  pasta,
  peper,
  roomkaas,
  ui,
} from './_helpers';

export const broccoliRecipes = [
  defineRecipe({
    id: 'pasta-broccoli-kaassaus',
    name: 'Pasta met broccoli-kaassaus',
    description: 'Milde kaassaus waarin de broccoli helemaal opgaat.',
    category: 'saus-dip',
    mainVeggie: 'broccoli',
    visibility: 1,
    timeMinutes: 25,
    ingredients: [
      pasta(350, 'pasta', 'bijvoorbeeld schelpjes'),
      broccoli(300),
      boter(25),
      bloem(25),
      melk(400),
      kaas(100),
      nootmuskaat(),
    ],
    steps: [
      'Kook de pasta volgens de verpakking. Kook de broccoli, ook de geschilde steel, in 8 minuten heel zacht.',
      'Smelt de boter, roer de bloem erdoor en giet er al roerend in delen de melk bij. Laat 3 minuten zachtjes koken.',
      {
        verstopt: 'Pureer de broccoli glad met een paar eetlepels saus en roer dat door de rest.',
        zichtbaar: 'Hak de broccoli heel fijn en roer hem door de saus.',
      },
      'Smelt de kaas in de saus, breng op smaak met nootmuskaat en meng met de pasta.',
    ],
    tips: {
      verstoppen: 'Gepureerde broccoli maakt de saus lichtgroen maar mild; de kaas doet de rest.',
      weerstand: 'Noem het groene kaassaus. Eerlijk, zonder er een groot ding van te maken.',
      bewaren: '2 dagen in de koelkast.',
    },
    allergens: ['gluten', 'melk'],
  }),
  defineRecipe({
    id: 'broccoli-gehaktballetjes',
    name: 'Gehaktballetjes met verstopte broccoli',
    description:
      'Gewone gehaktballetjes met een geheim groen randje, lekker met aardappeltjes of pasta.',
    category: 'hoofdgerecht',
    mainVeggie: 'broccoli',
    visibility: 1,
    timeMinutes: 30,
    ingredients: [broccoli(150), gehakt(400), ui(1), ei(1), paneermeel(40), peper(), olie(2)],
    steps: [
      {
        verstopt:
          'Maal de broccoli (roosjes en steel) in de keukenmachine tot heel fijne kruimels.',
        zichtbaar: 'Hak de broccoli met een mes heel fijn.',
      },
      'Snipper de ui heel fijn en meng hem met het gehakt, de broccoli, het ei, het paneermeel en wat peper.',
      'Draai er met natte handen ongeveer 20 balletjes van.',
      'Bak ze in de olijfolie in 12 tot 15 minuten rondom bruin en gaar.',
    ],
    tips: {
      verstoppen: 'In tomatensaus zie je de groene spikkeltjes nauwelijks.',
      weerstand: 'Laat je kind helpen met balletjes draaien.',
      bewaren: 'Rauwe balletjes kun je invriezen.',
      veiligheid:
        'Geen zout in het gehakt: dan kan de kinderportie zonder. Zout eventueel aan tafel, alleen bij de volwassenen.',
    },
    allergens: ['ei', 'gluten'],
  }),
  defineRecipe({
    id: 'broccoliboompjes-kaasdip',
    name: 'Broccoliboompjes met kaasdip',
    description: 'Een klein bos van zachte boompjes, met warme kaasdip.',
    category: 'snack',
    mainVeggie: 'broccoli',
    visibility: 4,
    nextStep: true,
    timeMinutes: 15,
    ingredients: [broccoli(400), roomkaas(100), melk(30), kaas(30)],
    steps: [
      'Snijd de broccoli in kleine boompjes en kook of stoom ze in 5 minuten zacht.',
      'Verwarm de roomkaas met de melk en roer de geraspte kaas erdoor tot een gladde dip.',
      'Zet de boompjes rechtop in een kommetje, als een klein bos, met de dip ernaast.',
    ],
    tips: {
      weerstand: 'Een bos boompjes om in te dippen is vaak spannender dan een hoopje op het bord.',
      veiligheid: 'Kook ze zo zacht dat je ze met je tong tegen je gehemelte kunt pletten.',
    },
    allergens: ['melk'],
  }),
];
