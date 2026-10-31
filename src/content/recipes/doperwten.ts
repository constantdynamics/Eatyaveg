import {
  citroen,
  defineRecipe,
  doperwten,
  ei,
  ing,
  knoflook,
  olie,
  parmezaan,
  pasta,
  peper,
  rijst,
  roomkaas,
  ui,
} from './_helpers';

export const doperwtenRecipes = [
  defineRecipe({
    id: 'groene-erwtendip',
    name: 'Groene erwtendip',
    description: 'Zoete, groene smeerdip van doperwtjes, in tien minuten klaar.',
    category: 'saus-dip',
    mainVeggie: 'doperwten',
    visibility: 1,
    timeMinutes: 10,
    ingredients: [
      doperwten(300),
      roomkaas(100),
      citroen(0.5),
      ing('blaadje munt', 5, 'stuks', 'kruiden', { plural: 'blaadjes munt', optional: true }),
    ],
    steps: [
      'Kook de doperwten 3 minuten en spoel ze koud af.',
      {
        verstopt: 'Pureer de erwten glad met de roomkaas, een scheutje citroensap en de munt.',
        zichtbaar:
          'Stamp de erwten grof met een vork en roer de roomkaas, wat citroensap en de munt erdoor.',
      },
      'Lekker op brood, op een cracker of als saus door de pasta.',
    ],
    tips: {
      verstoppen: 'Glad gepureerd lijkt het op groene smeerkaas.',
      weerstand: 'Smeer samen een beetje op een cracker, naast een cracker met iets vertrouwds.',
      bewaren: '2 dagen in de koelkast.',
    },
    allergens: ['melk'],
  }),
  defineRecipe({
    id: 'pasta-erwtenpesto',
    name: 'Pasta met erwtenpesto',
    description: 'Zachte groene pesto van doperwten en kaas, zonder noten.',
    category: 'hoofdgerecht',
    mainVeggie: 'doperwten',
    visibility: 1,
    timeMinutes: 20,
    ingredients: [
      pasta(350, 'spaghetti'),
      doperwten(300),
      parmezaan(40),
      olie(3),
      knoflook(1),
      ing('verse basilicum', 15, 'g', 'kruiden', { note: 'een klein bosje' }),
      peper(),
    ],
    steps: [
      'Kook de spaghetti volgens de verpakking. Kook de doperwten 3 minuten in een apart pannetje.',
      {
        verstopt:
          'Pureer de erwten met de knoflook, de Parmezaanse kaas, de olijfolie en de basilicum tot een gladde pesto.',
        zichtbaar:
          'Pureer de erwten maar kort met de knoflook, de kaas, de olijfolie en de basilicum, zodat er kleine stukjes in blijven.',
      },
      'Meng de pesto met de spaghetti en een scheutje kookvocht. Breng op smaak met peper.',
    ],
    tips: {
      verstoppen: 'Glad gepureerd is het gewoon groene pesto.',
      weerstand: 'Laat je kind zelf een beetje kaas over het bord strooien.',
      bewaren: 'Pesto blijft 2 dagen goed in de koelkast, of vries hem in in een ijsblokjesvorm.',
    },
    allergens: ['gluten', 'melk'],
  }),
  defineRecipe({
    id: 'gebakken-rijst-erwtjes',
    name: 'Gebakken rijst met erwtjes en ei',
    description: 'Vertrouwde gebakken rijst waarin de erwtjes gewoon te zien zijn.',
    category: 'hoofdgerecht',
    mainVeggie: 'doperwten',
    visibility: 3,
    nextStep: true,
    timeMinutes: 30,
    ingredients: [
      rijst(250),
      ui(1),
      olie(2),
      doperwten(200),
      ei(3),
      ing('zoutarme sojasaus', 1, 'el', 'houdbaar', { optional: true }),
    ],
    steps: [
      'Kook de rijst volgens de verpakking en laat hem uitdampen. Rijst van gisteren werkt ook prima.',
      'Snipper de ui en bak hem 3 minuten in de olie. Bak de doperwten 3 minuten mee.',
      'Schuif alles opzij, klop de eieren los en roerbak ze in de pan tot ze gestold zijn.',
      'Schep de rijst erdoor en bak 3 minuten mee. Schep de kinderportie op en maak de rest op smaak met een paar druppels sojasaus.',
    ],
    tips: {
      weerstand: 'Laat je kind de erwtjes zoeken in de rijst. Opeten hoeft niet.',
      bewaren: 'Koel rijst snel af, bewaar hem in de koelkast en eet hem binnen een dag op.',
      veiligheid: 'Plet een paar erwtjes even voor de allerkleinsten.',
    },
    allergens: ['ei', 'soja', 'gluten'],
  }),
];
