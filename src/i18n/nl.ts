/** UI-teksten van de ouder-app. Kort, warm en nooit belerend (§14.3). */
export const nl = {
  appName: 'Familie Vriendelijk',
  nav: {
    today: 'Vandaag',
    recipes: 'Recepten',
    logged: 'Gegeten',
    shopping: 'Boodschappen',
    garden: 'Tuin',
    settings: 'Instellingen',
    main: 'Hoofdmenu',
  },
  common: {
    save: 'Opslaan',
    cancel: 'Annuleren',
    close: 'Sluiten',
    back: 'Terug',
    next: 'Volgende',
    previous: 'Vorige',
    undo: 'Ongedaan maken',
    remove: 'Verwijderen',
    done: 'Klaar',
    add: 'Toevoegen',
    loading: 'Even laden…',
    showTo: (name: string) => `Toon aan ${name}`,
  },
  micro: {
    everyBite: 'Elke hap telt.',
    refusingIsNormal: 'Weigeren hoort erbij. Morgen weer een kans.',
    whoIsWaiting: 'Kijk wie er op je wacht!',
    nothingYet: 'Vandaag nog niks aangetikt. Geen zorgen.',
  },
  logged: {
    label: 'Gegeten of geproefd',
  },
  errors: {
    generic: 'Er ging iets mis. Probeer het nog eens.',
    notFound: 'Deze pagina bestaat niet (meer).',
  },
} as const;
