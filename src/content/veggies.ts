/** De 14 groenten (§9.1). Kleuren als CSS-variabelen uit src/styles/veggies.css. */
import type { Veggie, VeggieId, VeggiePalette } from '../domain/types';

function palette(id: VeggieId): VeggiePalette {
  return {
    body: `var(--veg-${id}-body)`,
    shade: `var(--veg-${id}-shade)`,
    accent: `var(--veg-${id}-accent)`,
    leaf: `var(--veg-${id}-leaf)`,
  };
}

export const VEGGIES: Veggie[] = [
  {
    id: 'wortel',
    name: 'Wortel',
    buddyName: 'Wortel',
    spoken: 'wortel',
    taste: 'makkelijk',
    palette: palette('wortel'),
    tips: {
      verstoppen: [
        'Rasp wortel op de fijnste kant van de rasp: in tomatensaus of gehakt valt hij weg.',
        'Kook wortel zacht en pureer hem door saus, soep of aardappelpuree.',
        'Een gekookte, afgekoelde wortel verdwijnt in een fruitsmoothie.',
      ],
      weerstand: [
        'Eet zelf een stukje wortel en vertel wat je proeft: zoet en knapperig.',
        'Laat je kind de wortel wassen of in de pan doen. Wie helpt, proeft sneller.',
        'Weigeren hoort erbij. Leg morgen gewoon weer een klein stukje neer.',
      ],
      volgendeStap: [
        'Wortelfrietjes uit de oven zijn zacht, zoet en herkenbaar.',
        'Leg een paar dunne, gekookte wortelstaafjes naast iets vertrouwds.',
      ],
    },
  },
  {
    id: 'courgette',
    name: 'Courgette',
    buddyName: 'Courgette',
    spoken: 'courgette',
    taste: 'makkelijk',
    palette: palette('courgette'),
    tips: {
      verstoppen: [
        'Schil de courgette: zonder groene schil is hij in een witte saus onzichtbaar.',
        'Rasp courgette fijn en knijp het vocht eruit voor gehakt of ovenschotels.',
        'Rauwe courgette valt weg in een smoothie. Proef eerst een stukje: is hij bitter, gebruik hem dan niet.',
      ],
      weerstand: [
        'Begin met geschilde courgette: de smaak is mild, het groen schrikt soms af.',
        'Laat je kind meehelpen met raspen (met jouw hand erbij). Dan is het hun eigen werk.',
      ],
      volgendeStap: [
        'Courgettemuntjes met kaas uit de oven zijn een vriendelijke eerste kennismaking.',
        'Snijd courgette in dunne halve maantjes in een vertrouwde pastasaus.',
      ],
    },
  },
  {
    id: 'pompoen',
    name: 'Pompoen',
    buddyName: 'Pompoen',
    spoken: 'pompoen',
    taste: 'makkelijk',
    palette: palette('pompoen'),
    tips: {
      verstoppen: [
        'Pompoen maakt sauzen romig en zoet; pureer hem met wat roomkaas.',
        'Voorgesneden pompoenblokjes uit de supermarkt schelen veel snijwerk.',
        'Pompoen past onzichtbaar in soep en in pannenkoekbeslag.',
      ],
      weerstand: [
        'Vertel dat pompoen dezelfde kleur heeft als een wortel. Kleuren zijn een mooi gespreksonderwerp.',
        'Geef een klein schaaltje soep naast een boterham om in te dippen.',
      ],
      volgendeStap: ['Geroosterde pompoenblokjes met een snufje kaneel zijn zacht en zoet.'],
    },
  },
  {
    id: 'komkommer',
    name: 'Komkommer',
    buddyName: 'Komkommer',
    spoken: 'komkommer',
    taste: 'makkelijk',
    palette: palette('komkommer'),
    tips: {
      verstoppen: [
        'Rasp komkommer fijn en knijp hem uit voor een frisse dip.',
        'Geschilde komkommer valt weg in een yoghurtsaus.',
      ],
      weerstand: [
        'Komkommer is mild en fris: een fijne eerste rauwe groente.',
        'Snijd verschillende vormen (plakjes, staafjes, halve maantjes) en laat je kind kiezen.',
        'Leg komkommer naast iets vertrouwds, zonder er iets over te zeggen.',
      ],
      volgendeStap: ['Dunne komkommerstaafjes met een dip zijn leuk om zelf te pakken.'],
    },
  },
  {
    id: 'tomaat',
    name: 'Tomaat',
    buddyName: 'Tomaat',
    spoken: 'tomaat',
    taste: 'makkelijk',
    palette: palette('tomaat'),
    tips: {
      verstoppen: [
        'Tomatensaus is al een vertrouwde smaak: daar passen andere groenten ook in.',
        'Pureer tomatenblokjes als stukjes nog lastig zijn.',
      ],
      weerstand: [
        'Sommige kinderen vinden velletjes en pitjes gek. Pureer de tomaat dan gewoon.',
        'Begin met tomatensaus en zet daarna een paar stukjes tomaat op tafel.',
      ],
      volgendeStap: ['Snijd cherrytomaatjes in de lengte in vieren en leg ze op een broodje.'],
    },
  },
  {
    id: 'doperwten',
    name: 'Doperwten',
    buddyName: 'Erwtje',
    spoken: 'erwtjes',
    taste: 'makkelijk',
    palette: palette('doperwten'),
    tips: {
      verstoppen: [
        'Doperwten uit de diepvries zijn zoet en snel: pureer ze tot een groene dip of pesto.',
        'Gepureerde erwtjes geven een pastasaus een frisse, milde smaak.',
      ],
      weerstand: [
        'Erwtjes zijn klein en rollen: dat mag leuk zijn. Laat je kind ze zelf scheppen.',
        'Een klein schepje naast iets vertrouwds is genoeg.',
      ],
      volgendeStap: [
        'Gebakken rijst met erwtjes laat ze zien in een vertrouwd gerecht.',
        'Plet zachtgekookte erwtjes even voor de allerkleinsten.',
      ],
    },
  },
  {
    id: 'bloemkool',
    name: 'Bloemkool',
    buddyName: 'Bloemkool',
    spoken: 'bloemkool',
    taste: 'gemiddeld',
    palette: palette('bloemkool'),
    tips: {
      verstoppen: [
        'Gepureerde bloemkool maakt kaassaus romig en valt helemaal weg.',
        'Kook bloemkool mee met de aardappels en stamp alles samen tot puree.',
      ],
      weerstand: [
        'De kookgeur kan afschrikken; bloemkool uit de oven ruikt en smaakt zachter.',
        'Noem de roosjes wolkjes of boompjes, als je kind dat leuk vindt.',
      ],
      volgendeStap: ['Kleine roosjes uit de oven met een beetje kaas zijn een goede eerste stap.'],
    },
  },
  {
    id: 'sperziebonen',
    name: 'Sperziebonen',
    buddyName: 'Boontje',
    spoken: 'boontjes',
    taste: 'gemiddeld',
    palette: palette('sperziebonen'),
    tips: {
      verstoppen: [
        'Kook sperziebonen goed gaar en pureer ze tot een groene pesto.',
        'Fijngehakte boontjes vallen weg in gehakt met tomatensaus.',
      ],
      weerstand: [
        'Snijd boontjes in korte stukjes; lange boontjes zijn lastig voor kleine handen.',
        'Een klein klontje boter of wat geraspte kaas maakt de smaak zachter.',
      ],
      volgendeStap: [
        'Zachte boontjes uit de oven met wat Parmezaanse kaas kun je met je vingers eten.',
      ],
    },
  },
  {
    id: 'prei',
    name: 'Prei',
    buddyName: 'Prei',
    spoken: 'prei',
    taste: 'gemiddeld',
    palette: palette('prei'),
    tips: {
      verstoppen: [
        'Stoof prei heel zacht: dan wordt hij zoet en valt hij weg in een romige saus.',
        'Gepureerde prei in soep proef je nauwelijks.',
      ],
      weerstand: [
        'Was prei goed: er zit vaak zand tussen de laagjes, en knarsen schrikt af.',
        'Begin met het witte deel, dat is het mildst.',
      ],
      volgendeStap: ['Hartige pannenkoekjes met fijne preiringetjes zijn een vriendelijke stap.'],
    },
  },
  {
    id: 'paprika',
    name: 'Paprika',
    buddyName: 'Paprika',
    spoken: 'paprika',
    taste: 'uitdagend',
    palette: palette('paprika'),
    tips: {
      verstoppen: [
        'Rode paprika is zoet: zacht gebakken en gepureerd valt hij weg in tomatensaus.',
        'Pureer paprika en meng hem door de kaas van een quesadilla.',
      ],
      weerstand: [
        'Begin met rode of gele paprika: die zijn zoeter dan groene.',
        'Het velletje kan taai zijn. Bak de paprika zacht of pureer hem als dat helpt.',
      ],
      volgendeStap: [
        'Dunne reepjes zoete paprika met een dip; voor de kleinsten extra dun of zacht gebakken.',
      ],
    },
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    buddyName: 'Broccoli',
    spoken: 'broccoli',
    taste: 'uitdagend',
    palette: palette('broccoli'),
    tips: {
      verstoppen: [
        'Kook broccoli zacht en pureer hem door een kaassaus: groen, maar mild.',
        'Hak rauwe broccoli in de keukenmachine tot kruimels en meng ze door gehakt.',
      ],
      weerstand: [
        'De steel is zoeter dan de roosjes: schil hem en gebruik hem ook.',
        'Laat je kind de roosjes zelf in een dip dopen.',
        'Een nieuwe smaak vraagt vaak tien keer proeven of meer. Blijf rustig aanbieden.',
      ],
      volgendeStap: ['Zachtgekookte broccoliboompjes met een kaasdip, naast iets vertrouwds.'],
    },
  },
  {
    id: 'spinazie',
    name: 'Spinazie',
    buddyName: 'Spinazie',
    spoken: 'spinazie',
    taste: 'uitdagend',
    palette: palette('spinazie'),
    tips: {
      verstoppen: [
        'Spinazie slinkt enorm en verdwijnt in hummus, pannenkoekbeslag of een smoothie.',
        'Mix spinazie met het ei in de blender en gebruik dat groene mengsel in gehakt.',
      ],
      weerstand: [
        'Groen eten mag grappig zijn: noem het monsterhummus of drakenpannenkoeken.',
        'Rauwe jonge spinazie is milder dan gekookte.',
      ],
      volgendeStap: ['Spinaziestamppot is een vertrouwde manier om spinazie te laten zien.'],
    },
  },
  {
    id: 'rode-biet',
    name: 'Rode biet',
    buddyName: 'Bietje',
    spoken: 'rode biet',
    taste: 'uitdagend',
    palette: palette('rode-biet'),
    tips: {
      verstoppen: [
        'Voorgekookte bieten (vacuüm verpakt) zijn in een paar minuten gepureerd tot roze saus.',
        'Bieten kleuren alles roze, en dat is vaak juist een feestje.',
      ],
      weerstand: [
        'Laat je kind raden waar de roze kleur vandaan komt.',
        'Bieten zijn zoet; een beetje appel erbij maakt ze nog vriendelijker.',
      ],
      volgendeStap: ['Stamppot rode biet met appel: zoet, zacht en herkenbaar roze.'],
    },
  },
  {
    id: 'spruitjes',
    name: 'Spruitjes',
    buddyName: 'Spruitje',
    spoken: 'spruitjes',
    taste: 'uitdagend',
    palette: palette('spruitjes'),
    tips: {
      verstoppen: [
        'Kook spruitjes zacht en pureer ze in een kaassaus: kaas verzacht de bittere smaak.',
        'Hak gekookte spruitjes fijn door aardappelpuree of koekjes.',
      ],
      weerstand: [
        'Spruitjes zijn voor veel mensen even wennen. Proeven is al knap.',
        'Spruitjes uit de oven smaken zoeter dan gekookte.',
      ],
      volgendeStap: [
        'Halve spruitjes uit de oven met wat Parmezaanse kaas, naast iets vertrouwds.',
      ],
    },
  },
];

export const VEGGIE_BY_ID: Record<VeggieId, Veggie> = Object.fromEntries(
  VEGGIES.map((v) => [v.id, v]),
) as Record<VeggieId, Veggie>;

export function veggie(id: VeggieId): Veggie {
  return VEGGIE_BY_ID[id];
}

/** Alfabetisch op naam (voor de lijsten in de ouder-app). */
export function sortVeggiesByName<T extends { id: VeggieId }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) =>
    VEGGIE_BY_ID[a.id].name.localeCompare(VEGGIE_BY_ID[b.id].name, 'nl'),
  );
}
