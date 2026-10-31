import { useMemo } from 'react';
import { SettingsLink } from '../../app/SettingsLink';
import { ChildSwitcher } from '../../components/ChildSwitcher';
import { PageHeader } from '../../components/PageHeader';
import { joinNames } from '../../content/lines';
import { VEGGIE_BY_ID } from '../../content/veggies';
import { nl } from '../../i18n/nl';
import { dayKey, formatDate } from '../../lib/dates';
import { useToday } from '../../lib/clock';
import { useAppStore } from '../../store/app-store';
import { useChildProgress, useEnabledVeggies, useSelectedChild } from '../../store/selectors';
import { CookedCard } from './CookedCard';
import { DailyRecipeCard } from './DailyRecipeCard';
import { VeggieOverview } from './VeggieOverview';

function TodaySummary({ childId, name }: { childId: string; name: string }) {
  const today = useToday();
  const eatEvents = useAppStore((s) => s.eatEvents);
  const tasted = useMemo(() => {
    const ids = new Set(
      eatEvents
        .filter(
          (e) => e.childId === childId && e.source !== 'start' && dayKey(new Date(e.at)) === today,
        )
        .map((e) => e.veggieId),
    );
    return [...ids].map((id) => VEGGIE_BY_ID[id].name.toLowerCase());
  }, [eatEvents, childId, today]);

  return (
    <p className="text-ink-soft">
      {tasted.length === 0
        ? nl.micro.nothingYet
        : `Vandaag geproefd door ${name}: ${joinNames(tasted)}. ${nl.micro.everyBite}`}
    </p>
  );
}

export function TodayPage() {
  const child = useSelectedChild();
  const veggies = useEnabledVeggies();
  const progress = useChildProgress(child?.id);
  const today = useToday();

  return (
    <>
      <PageHeader
        title="Vandaag"
        subtitle={formatDate(`${today}T12:00:00`)}
        actions={<SettingsLink />}
      />
      <ChildSwitcher />
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        <div className="lg:sticky lg:top-6">
          <CookedCard />
          <DailyRecipeCard child={child} />
        </div>
        {child && progress && (
          <section aria-labelledby="veggies-title" className="mt-8 lg:mt-0">
            <h2 id="veggies-title" className="text-xl">
              Groenten van {child.name}
            </h2>
            <div className="mt-1">
              <TodaySummary childId={child.id} name={child.name} />
            </div>
            <VeggieOverview child={child} veggies={veggies} progress={progress} />
          </section>
        )}
      </div>
    </>
  );
}
