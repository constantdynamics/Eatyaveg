/** Hulp (§9.5, §13.4): nuchtere tips, wanneer hulp zoeken, het kind in de app houden. */
import { PageHeader } from '../../components/PageHeader';
import { EATING_TIPS, KEEP_IN_APP, SAFETY_TIPS, SEEK_HELP, type Tip } from '../../content/tips';

function TipList({ tips }: { tips: Tip[] }) {
  return (
    <dl className="space-y-4">
      {tips.map((t) => (
        <div key={t.title}>
          <dt className="font-heading text-lg font-bold">{t.title}</dt>
          <dd className="text-ink-soft">{t.text}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HelpPage() {
  return (
    <>
      <PageHeader
        title="Hulp en tips"
        back="/instellingen"
        subtitle="Weigeren hoort erbij. Morgen weer een kans."
      />
      <section aria-labelledby="h-eten" className="fv-card mb-4 p-5">
        <h2 id="h-eten" className="mb-3 text-xl">
          Samen aan groente wennen
        </h2>
        <TipList tips={EATING_TIPS} />
      </section>

      <section aria-labelledby="h-hulp" className="fv-card mb-4 p-5">
        <h2 id="h-hulp" className="text-xl">
          Wanneer zoek je hulp?
        </h2>
        <p className="mt-2">{SEEK_HELP.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {SEEK_HELP.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="mt-2 text-ink-soft">{SEEK_HELP.outro}</p>
      </section>

      <section aria-labelledby="h-veilig" className="fv-card mb-4 p-5">
        <h2 id="h-veilig" className="mb-3 text-xl">
          Veilig eten voor peuters
        </h2>
        <TipList tips={SAFETY_TIPS} />
      </section>

      <section aria-labelledby="h-app" className="fv-card mb-4 p-5">
        <h2 id="h-app" className="text-xl">
          Je kind in de tuin houden
        </h2>
        <p className="mt-2 text-ink-soft">{KEEP_IN_APP.intro}</p>
        {[KEEP_IN_APP.ipad, KEEP_IN_APP.android].map((block) => (
          <div key={block.title} className="mt-4">
            <h3 className="text-lg">{block.title}</h3>
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              {block.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
        <p className="mt-3 text-sm text-ink-soft">
          {KEEP_IN_APP.note} In de tuin zelf kom je terug door de Ouder-knop in de hoek 1,5 seconde
          vast te houden.
        </p>
      </section>
    </>
  );
}
