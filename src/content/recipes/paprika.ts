import {
  basilicum,
  defineRecipe,
  kaas,
  knoflook,
  olie,
  paprika,
  passata,
  pasta,
  peper,
  roomkaas,
  ui,
  wraps,
  yoghurt,
  zout,
  ZOUT_STAP,
} from './_helpers';

export const paprikaRecipes = [
  defineRecipe({
    id: 'zoete-paprikasaus',
    name: 'Zoete paprikasaus',
    description: 'Rode pastasaus van zacht gebakken paprika en tomaat.',
    category: 'saus-dip',
    mainVeggie: 'paprika',
    veggies: ['paprika', 'tomaat'],
    visibility: 1,
    timeMinutes: 25,
    ingredients: [
      pasta(350, 'spaghetti'),
      paprika(2),
      ui(1),
      knoflook(1),
      olie(1),
      passata(300),
      basilicum(1),
      zout(),
      peper(),
    ],
    steps: [
      'Kook de spaghetti volgens de verpakking. Snipper de ui en de knoflook.',
      {
        verstopt:
          'Snijd de paprika in stukjes en bak ze met de ui en de knoflook in de olijfolie in 8 minuten heel zacht.',
        zichtbaar:
          'Snijd de paprika in heel kleine blokjes en bak ze met de ui en de knoflook in de olijfolie in 6 minuten zacht.',
      },
      {
        verstopt:
          'Voeg de passata en de basilicum toe, laat 5 minuten pruttelen en pureer alles glad.',
        zichtbaar: 'Voeg de passata en de basilicum toe en laat 5 minuten pruttelen.',
      },
      `Meng met de spaghetti. ${ZOUT_STAP}`,
    ],
    tips: {
      verstoppen: 'Rode paprika in rode saus: niemand die het ziet.',
      weerstand: 'Vertel achteraf wat erin zat; de onthulling in de tuin helpt daarbij.',
      bewaren: 'De saus kan 3 maanden in de vriezer.',
    },
    allergens: ['gluten'],
  }),
  defineRecipe({
    id: 'quesadillas-paprika',
    name: "Quesadilla's met paprika en kaas",
    description: 'Krokante wraps met gesmolten kaas, in punten om met de hand te eten.',
    category: 'hoofdgerecht',
    mainVeggie: 'paprika',
    visibility: 1,
    timeMinutes: 20,
    ingredients: [paprika(2), olie(1, { variant: 'verstopt' }), roomkaas(75), wraps(8), kaas(150)],
    steps: [
      {
        verstopt:
          'Snijd de paprika in stukjes, bak ze in de olijfolie in 6 minuten zacht en pureer ze met de roomkaas.',
        zichtbaar: 'Snijd de paprika in heel kleine blokjes en meng ze met de roomkaas.',
      },
      'Besmeer de helft van de wraps met het paprikamengsel en strooi de kaas erover. Leg er een tweede wrap op.',
      'Bak de quesadilla’s in een droge koekenpan in 2 tot 3 minuten per kant goudbruin, tot de kaas gesmolten is.',
      'Snijd ze in punten, als een taart.',
    ],
    tips: {
      verstoppen: 'Gepureerde paprika kleurt de kaas een beetje oranje; verder zie je niets.',
      weerstand: 'Punten die je met de hand eet, maken proeven makkelijker.',
      veiligheid: 'Laat ze even afkoelen: gesmolten kaas blijft heet.',
    },
    allergens: ['gluten', 'melk'],
  }),
  defineRecipe({
    id: 'paprikareepjes-dip',
    name: 'Paprikareepjes met dip',
    description: 'Zoete rode en gele reepjes met een romige dip.',
    category: 'snack',
    mainVeggie: 'paprika',
    visibility: 4,
    nextStep: true,
    timeMinutes: 10,
    ingredients: [{ ...paprika(2), note: 'rood of geel' }, roomkaas(100), yoghurt(50)],
    steps: [
      'Was de paprika’s, haal de zaadlijsten eruit en snijd ze in dunne reepjes.',
      'Roer de roomkaas los met de yoghurt tot een smeuïge dip.',
      'Zet alles midden op tafel en dip samen.',
    ],
    tips: {
      weerstand: 'Zet rode en gele reepjes neer en laat je kind een kleur kiezen.',
      veiligheid:
        'Snijd voor kinderen onder de 3 jaar extra dunne reepjes, of bak ze eerst even zacht.',
    },
    allergens: ['melk'],
  }),
];
