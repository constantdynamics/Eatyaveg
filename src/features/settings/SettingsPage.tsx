/** Instellingen (§6.5). */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { PageHeader } from '../../components/PageHeader';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Stepper } from '../../components/Stepper';
import { TextField } from '../../components/TextField';
import { Toggle } from '../../components/Toggle';
import { VeggieIcon } from '../../components/VeggieIcon';
import { VEGGIES } from '../../content/veggies';
import { ALLERGEN_LABEL } from '../../domain/recipes';
import { ALLERGENS } from '../../domain/types';
import { isStandalone } from '../../lib/fullscreen';
import { INSTALL_HINT, detectPlatform, promptInstall, useCanInstall } from '../../lib/install';
import { useAppStore } from '../../store/app-store';
import { ChildrenSection } from './ChildrenSection';
import { DataSection } from './DataSection';
import { VoiceSettings } from './VoiceSettings';

const sortedVeggies = [...VEGGIES].sort((a, b) => a.name.localeCompare(b.name, 'nl'));

function Section({
  id,
  title,
  children,
  intro,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="fv-card mb-4 p-5">
      <h2 id={id} className="text-xl">
        {title}
      </h2>
      {intro && <p className="mt-1 text-ink-soft">{intro}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="font-bold">{label}</p>
        {hint && <p className="text-sm text-ink-soft">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function InstallSection() {
  const canInstall = useCanInstall();
  if (isStandalone())
    return <p className="text-ink-soft">De app staat op je beginscherm. Mooi zo.</p>;
  return (
    <>
      <p className="text-ink-soft">
        Op je beginscherm opent de tuin op het hele scherm en bewaart je apparaat de gegevens beter.{' '}
        {!canInstall && INSTALL_HINT[detectPlatform()]}
      </p>
      {canInstall && (
        <Button className="mt-3" variant="primary" onClick={() => void promptInstall()}>
          Installeer de app
        </Button>
      )}
    </>
  );
}

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const update = useAppStore((s) => s.updateSettings);
  const parentNames = settings.parentNames ?? [];

  const setParentName = (index: number, value: string) => {
    const next = [parentNames[0] ?? '', parentNames[1] ?? ''];
    next[index] = value;
    const cleaned = next.map((n) => n.trim()).filter(Boolean);
    update({ parentNames: cleaned.length > 0 ? next.map((n) => n.slice(0, 30)) : [] });
  };

  return (
    <>
      <PageHeader title="Instellingen" back="/" />

      <Section id="s-kinderen" title="Kinderen">
        <ChildrenSection />
      </Section>

      <Section
        id="s-groenten"
        title="Groenten"
        intro="Welke groenten doen mee in de app en in de tuin?"
      >
        <div className="flex flex-wrap gap-2">
          {sortedVeggies.map((v) => {
            const on = settings.enabledVeggies.includes(v.id);
            return (
              <Chip
                key={v.id}
                selected={on}
                icon={<VeggieIcon id={v.id} size={24} />}
                onClick={() => {
                  if (on && settings.enabledVeggies.length <= 1) return;
                  update({
                    enabledVeggies: on
                      ? settings.enabledVeggies.filter((id) => id !== v.id)
                      : [...settings.enabledVeggies, v.id],
                  });
                }}
              >
                {v.name}
              </Chip>
            );
          })}
        </div>
      </Section>

      <Section id="s-groei" title="Groei">
        <SettingRow
          label="Registraties per fase"
          hint="Hoe vaak proeven voor het vriendje een stap groeit."
        >
          <div className="w-40">
            <SegmentedControl
              label="Registraties per fase"
              value={String(settings.perPhase) as '2' | '3'}
              onChange={(v) => update({ perPhase: v === '2' ? 2 : 3 })}
              options={[
                { value: '3', label: '3' },
                { value: '2', label: '2' },
              ]}
            />
          </div>
        </SettingRow>
        <SettingRow label="Daglimiet" hint="Maximaal aantal keer per groente per kind per dag.">
          <Stepper
            label="Daglimiet"
            value={settings.dailyCap}
            min={1}
            max={5}
            onChange={(v) => update({ dailyCap: v })}
          />
        </SettingRow>
        <h3 className="mt-4 text-lg">Weer oefenen</h3>
        <p className="text-sm text-ink-soft">
          Alleen voor groenten waar je Weer oefenen aanzet. Anders krimpt er nooit iets.
        </p>
        <SettingRow label="Kleiner worden na" hint="Dagen zonder proeven.">
          <Stepper
            label="Dagen"
            value={settings.shrinkDays}
            min={3}
            max={30}
            onChange={(v) => update({ shrinkDays: v })}
            format={(v) => `${v} dagen`}
          />
        </SettingRow>
        <SettingRow label="Hoogstens kleiner dan het record">
          <Stepper
            label="Fases"
            value={settings.maxShrink}
            min={1}
            max={5}
            onChange={(v) => update({ maxShrink: v })}
            format={(v) => `${v} ${v === 1 ? 'fase' : 'fases'}`}
          />
        </SettingRow>
        <SettingRow label="Terug groeien" hint="Registraties per fase tot het record.">
          <Stepper
            label="Terug groeien"
            value={settings.regrowPerPhase}
            min={1}
            max={3}
            onChange={(v) => update({ regrowPerPhase: v })}
          />
        </SettingRow>
      </Section>

      <Section id="s-geluid" title="Geluid en stem">
        <Toggle
          label="Geluidjes"
          checked={settings.sound}
          onChange={(sound) => update({ sound })}
        />
        <Toggle
          label="Stem"
          description="De vriendjes praten in het Nederlands."
          checked={settings.speech}
          onChange={(speech) => update({ speech })}
        />
        <Toggle
          label="Onthulmoment"
          description='In de tuin zegt de stem eerst "Er zat wortel in je eten!".'
          checked={settings.reveal}
          onChange={(reveal) => update({ reveal })}
        />
        {settings.speech && <VoiceSettings />}
      </Section>

      <Section
        id="s-ouders"
        title="Hoe noemt je kind de ouders?"
        intro='Optioneel. Dan worden de krachten persoonlijk, zoals "Wortel kan mama optillen!". Leeg laten kan ook.'
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Eerste naam"
            placeholder="bijvoorbeeld mama"
            value={parentNames[0] ?? ''}
            maxLength={30}
            onChange={(e) => setParentName(0, e.target.value)}
          />
          <TextField
            label="Tweede naam"
            placeholder="bijvoorbeeld papa"
            value={parentNames[1] ?? ''}
            maxLength={30}
            onChange={(e) => setParentName(1, e.target.value)}
          />
        </div>
      </Section>

      <Section
        id="s-allergie"
        title="Allergieën in het gezin"
        intro="Recepten met deze allergenen worden verborgen."
      >
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((a) => {
            const on = settings.allergies.includes(a);
            return (
              <Chip
                key={a}
                selected={on}
                onClick={() =>
                  update({
                    allergies: on
                      ? settings.allergies.filter((x) => x !== a)
                      : [...settings.allergies, a],
                  })
                }
              >
                {ALLERGEN_LABEL[a]}
              </Chip>
            );
          })}
        </div>
      </Section>

      <Section id="s-data" title="Mijn data" intro="Alles staat alleen op dit apparaat.">
        <DataSection />
      </Section>

      <Section id="s-install" title="App installeren">
        <InstallSection />
      </Section>

      <nav aria-label="Meer" className="fv-card mb-4 divide-y divide-line px-5">
        {[
          ['/hulp', 'Hulp en tips'],
          ['/over', 'Over deze app en privacy'],
        ].map(([to, label]) => (
          <Link key={to} to={to!} className="flex min-h-14 items-center justify-between font-bold">
            {label}
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </>
  );
}
