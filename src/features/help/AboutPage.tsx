/** Over (§6, §9.5, §13.1): wat de app doet, privacy, disclaimer, bronnen en credits. */
import { PageHeader } from '../../components/PageHeader';

export function AboutPage() {
  return (
    <>
      <PageHeader title="Over deze app" back="/instellingen" />
      <section className="fv-card mb-4 p-5" aria-labelledby="o-wat">
        <h2 id="o-wat" className="text-xl">
          Proeftuin
        </h2>
        <p className="mt-2">
          Een app voor ouders en verzorgers van kinderen van 2 tot 5 jaar. Je verstopt groenten in
          familierecepten, tikt aan wat je kind heeft geproefd, en in de tuin groeien de vriendjes
          mee. Verstoppen is een hulpmiddel: de app helpt stap voor stap naar herkenbare groente.
        </p>
      </section>

      <section className="fv-card mb-4 p-5" aria-labelledby="o-privacy">
        <h2 id="o-privacy" className="text-xl">
          Privacy
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Alles wat je invult, blijft op dit apparaat. Er is geen account en geen server.</li>
          <li>
            Van je kind bewaren we alleen een voornaam of bijnaam (en eventueel hoe je die
            uitspreekt).
          </li>
          <li>
            Geen cookies, geen analytics, geen advertenties. De app maakt geen verbinding met andere
            websites.
          </li>
          <li>
            De stem gebruikt de spraak van je apparaat. We kiezen bij voorkeur een stem die op het
            apparaat zelf werkt, zodat ook de naam van je kind het apparaat niet verlaat.
          </li>
          <li>Een back-up maak je zelf, als bestand. Daarin staat de naam van je kind.</li>
        </ul>
      </section>

      <section className="fv-card mb-4 p-5" aria-labelledby="o-disclaimer">
        <h2 id="o-disclaimer" className="text-xl">
          Geen medisch advies
        </h2>
        <p className="mt-2">
          De recepten en tips zijn algemeen en vervangen geen advies van een arts, diëtist of het
          consultatiebureau. Maak je je zorgen over het eten of groeien van je kind, bespreek het
          dan met het consultatiebureau of de huisarts.
        </p>
      </section>

      <section className="fv-card mb-4 p-5" aria-labelledby="o-bronnen">
        <h2 id="o-bronnen" className="text-xl">
          Bronnen en credits
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Voedingsadviezen sluiten aan bij de adviezen van het Voedingscentrum voor peuters.
          </li>
          <li>
            Alle illustraties en vriendjes zijn eigen ontwerp. Geluidjes worden in de app zelf
            gemaakt.
          </li>
          <li>Lettertypen: Nunito en Atkinson Hyperlegible Next (SIL Open Font License).</li>
          <li>Iconen: Lucide (ISC-licentie).</li>
        </ul>
        <p className="mt-3 text-sm text-ink-soft">Versie {__APP_VERSION__}</p>
      </section>
    </>
  );
}
