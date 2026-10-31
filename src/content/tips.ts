/** Hulp-pagina (§9.5, §13): korte, nuchtere tips en wanneer je hulp zoekt. */

export interface Tip {
  title: string;
  text: string;
}

export const EATING_TIPS: Tip[] = [
  {
    title: 'Blijf aanbieden',
    text: 'Een nieuwe smaak vraagt vaak tien keer proeven of meer. Een hapje dat weer uit de mond komt, telt ook als kennismaken.',
  },
  {
    title: 'Eet samen en doe het voor',
    text: 'Kinderen kijken veel af. Eet zelf ook van de groente, zonder er een punt van te maken.',
  },
  {
    title: 'Een klein beetje naast iets vertrouwds',
    text: 'Leg een klein beetje van de nieuwe groente naast iets wat je kind al lekker vindt. Opeten hoeft niet.',
  },
  {
    title: 'Laat je kind helpen',
    text: 'Wassen, roeren, strooien of op de knop van de blender drukken: wie helpt, proeft sneller.',
  },
  {
    title: 'Geen druk, geen omkoping',
    text: 'Geen toetje als beloning en geen "nog drie hapjes". Druk maakt eten spannender, niet lekkerder.',
  },
  {
    title: 'Weigeren hoort erbij',
    text: 'Peuters zijn voorzichtig met nieuw eten. Dat is normaal en gaat vanzelf over. Morgen weer een kans.',
  },
  {
    title: 'Wie bepaalt wat',
    text: 'Jij bepaalt wat, wanneer en waar er gegeten wordt. Je kind bepaalt of het eet en hoeveel.',
  },
  {
    title: 'Verstoppen is een hulpmiddel',
    text: 'Verstopte groente is fijn, maar het doel is wennen aan de echte. Daarom zegt de tuin welke groente erin zat, en zijn er Volgende stap-recepten.',
  },
];

export const SEEK_HELP = {
  intro: 'Bespreek het met het consultatiebureau of de huisarts als je kind:',
  items: [
    'afvalt of niet goed groeit;',
    'maar heel weinig verschillende dingen eet;',
    'vaak kokhalst of zich verslikt;',
  ],
  outro:
    'Of als eten veel spanning geeft, bij je kind of bij jou. Je hoeft het niet alleen op te lossen.',
};

export const SAFETY_TIPS: Tip[] = [
  {
    title: 'Verslikken',
    text: 'Geef kinderen onder de 4 jaar geen hele noten of pinda’s; gebruik notenpasta of fijngemalen noten. Snijd druiven, cherrytomaten en grote bessen in de lengte in vieren. Rasp harde rauwe groente, snijd hem dun of kook hem zacht. Laat kinderen rustig zitten tijdens het eten.',
  },
  {
    title: 'Zout',
    text: 'Gebruik weinig zout en geef de kinderportie geen extra zout: schep die eerst op. Let op bouillonblokjes en kant-en-klare sauzen en kies zoutarm.',
  },
  {
    title: 'Honing',
    text: 'Geef geen honing aan kinderen jonger dan 1 jaar. Bij recepten met honing staat dat erbij.',
  },
  {
    title: 'Spinazie en rode biet',
    text: 'Voor peuters gewoon te eten, ook vaker per week. Koel restjes snel af en bewaar ze in de koelkast.',
  },
  {
    title: 'Smoothies',
    text: 'Een smoothie is af en toe een leuk tussendoortje of iets bij het ontbijt, aan tafel in een beker. Hele groente en fruit eten blijft het fijnst: dan kauwt je kind en zit het langer vol. Water en melk blijven de gewone dranken.',
  },
];

export const KEEP_IN_APP = {
  intro:
    'De tuin is bedoeld voor korte momenten rond het eten. Zo blijft je kind in de tuin en tikt het er niet per ongeluk uit:',
  ipad: {
    title: 'iPad: Begeleide toegang',
    steps: [
      'Open Instellingen › Toegankelijkheid › Begeleide toegang en zet het aan.',
      'Stel een toegangscode in.',
      'Open de tuin en druk drie keer op de zijknop (of de thuisknop) en tik op Start.',
      'Stoppen: druk weer drie keer en voer je code in.',
    ],
  },
  android: {
    title: 'Android: App vastzetten',
    steps: [
      'Open Instellingen › Beveiliging (of Beveiliging en privacy) › App vastzetten en zet het aan.',
      'Open het overzicht van recente apps, tik op het icoon boven deze app en kies Vastzetten.',
      'Losmaken: houd Terug en Overzicht tegelijk ingedrukt, of veeg omhoog en houd vast.',
    ],
  },
  note: 'De precieze namen verschillen per toestel en versie.',
};
