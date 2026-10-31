/**
 * Onboarding (§6.6): maximaal 4 schermen, daarna nooit meer.
 * 1 welkom · 2 kind(eren) · 3 welke groenten eet je kind al (optioneel) · 4 zo werkt het.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { EyeOff, Hand, Sprout, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { ColorPicker } from '../../components/ColorPicker';
import { IconButton } from '../../components/IconButton';
import { TextField } from '../../components/TextField';
import { VeggieGrid } from '../../components/VeggieGrid';
import { VeggieIcon } from '../../components/VeggieIcon';
import { VEGGIES } from '../../content/veggies';
import { CHILD_COLORS, type ChildColor, type VeggieId } from '../../domain/types';
import { INSTALL_HINT, detectPlatform, promptInstall, useCanInstall } from '../../lib/install';
import { requestPersistentStorage } from '../../lib/storage';
import { useAppStore } from '../../store/app-store';

interface Draft {
  key: number;
  name: string;
  color: ChildColor;
  known: VeggieId[];
}

const sortedVeggies = [...VEGGIES].sort((a, b) => a.name.localeCompare(b.name, 'nl'));

/** De kop van elke stap krijgt de focus, zodat een schermlezer de nieuwe stap voorleest. */
function StepHeading({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: false });
  }, []);
  return (
    <h1 ref={ref} tabIndex={-1} className="text-3xl outline-none">
      {children}
    </h1>
  );
}

function StepDots({ step }: { step: number }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <p className="text-sm font-bold text-ink-soft">Stap {step} van 4</p>
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-2 w-6 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div
        className="fv-tile mb-8 flex h-48 items-end justify-center gap-2 pb-6"
        aria-hidden="true"
      >
        <VeggieIcon id="broccoli" size={72} />
        <VeggieIcon id="wortel" size={96} />
        <VeggieIcon id="tomaat" size={64} />
      </div>
      <StepHeading>Welkom in de Proeftuin</StepHeading>
      <p className="mt-3 text-lg text-ink-soft">
        Verstop groenten in familierecepten en tik na het eten aan wat je kind heeft geproefd. In de
        tuin ziet je kind de groentevriendjes daarna groeien.
      </p>
      <p className="mt-3 text-ink-soft">Alles blijft op dit apparaat. Geen account nodig.</p>
      <Button variant="primary" size="lg" block className="mt-8" onClick={onNext}>
        Beginnen
      </Button>
    </>
  );
}

interface ChildrenStepProps {
  drafts: Draft[];
  setDrafts: (d: Draft[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function ChildrenStep({ drafts, setDrafts, onNext, onBack }: ChildrenStepProps) {
  const [tried, setTried] = useState(false);
  const valid = drafts.every((d) => d.name.trim().length > 0);
  const update = (key: number, patch: Partial<Draft>) =>
    setDrafts(drafts.map((d) => (d.key === key ? { ...d, ...patch } : d)));

  return (
    <>
      <StepHeading>Voor wie is de tuin?</StepHeading>
      <p className="mt-2 text-ink-soft">
        Een voornaam of bijnaam is genoeg. Meer hoeven we niet te weten.
      </p>
      <div className="mt-6 space-y-4">
        {drafts.map((d, i) => (
          <div key={d.key} className="fv-card space-y-4 p-5">
            <div className="flex items-end gap-2">
              <TextField
                className="flex-1"
                label={drafts.length > 1 ? `Naam kind ${i + 1}` : 'Naam of bijnaam'}
                value={d.name}
                maxLength={40}
                autoComplete="off"
                onChange={(e) => update(d.key, { name: e.target.value })}
                aria-invalid={tried && !d.name.trim()}
              />
              {drafts.length > 1 && (
                <IconButton
                  label={`Kind ${i + 1} weghalen`}
                  icon={<Trash2 size={20} aria-hidden="true" />}
                  onClick={() => setDrafts(drafts.filter((x) => x.key !== d.key))}
                />
              )}
            </div>
            <ColorPicker
              name={`kleur-${d.key}`}
              value={d.color}
              onChange={(color) => update(d.key, { color })}
            />
          </div>
        ))}
      </div>
      {tried && !valid && (
        <p role="alert" className="mt-3 font-bold text-danger">
          Vul bij elk kind een naam in.
        </p>
      )}
      <Button
        className="mt-4"
        variant="ghost"
        onClick={() =>
          setDrafts([
            ...drafts,
            {
              key: Math.max(...drafts.map((d) => d.key)) + 1,
              name: '',
              color: CHILD_COLORS[drafts.length % CHILD_COLORS.length]!,
              known: [],
            },
          ])
        }
      >
        Nog een kind toevoegen
      </Button>
      <div className="mt-8 grid grid-cols-2 gap-2">
        <Button size="lg" onClick={onBack}>
          Terug
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setTried(true);
            if (valid) onNext();
          }}
        >
          Volgende
        </Button>
      </div>
    </>
  );
}

interface KnownStepProps {
  drafts: Draft[];
  setDrafts: (d: Draft[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function KnownStep({ drafts, setDrafts, onNext, onBack }: KnownStepProps) {
  const [index, setIndex] = useState(0);
  const draft = drafts[index] ?? drafts[0]!;
  const selected = new Set(draft.known);
  const toggle = (id: VeggieId) => {
    const known = selected.has(id) ? draft.known.filter((k) => k !== id) : [...draft.known, id];
    setDrafts(drafts.map((d) => (d.key === draft.key ? { ...d, known } : d)));
  };
  const last = index >= drafts.length - 1;

  return (
    <>
      <StepHeading key={draft.key}>Welke groenten eet {draft.name.trim()} al?</StepHeading>
      <p className="mt-2 text-ink-soft">
        Die vriendjes staan dan meteen in de tuin. Geen idee? Sla het gerust over.
      </p>
      {drafts.length > 1 && (
        <p className="mt-2 text-sm font-bold text-ink-soft">
          Kind {index + 1} van {drafts.length}
        </p>
      )}
      <div className="mt-6">
        <VeggieGrid
          veggies={sortedVeggies}
          selected={selected}
          onToggle={toggle}
          label={`Groenten die ${draft.name.trim()} al eet`}
        />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-2">
        <Button size="lg" onClick={() => (index > 0 ? setIndex(index - 1) : onBack())}>
          Terug
        </Button>
        <Button variant="primary" size="lg" onClick={() => (last ? onNext() : setIndex(index + 1))}>
          {draft.known.length === 0 ? 'Overslaan' : 'Volgende'}
        </Button>
      </div>
    </>
  );
}

const HOW: { icon: typeof EyeOff; title: string; text: string }[] = [
  {
    icon: EyeOff,
    title: 'Verstop',
    text: 'Kies een recept. Zo verstopt als nodig, en later steeds zichtbaarder.',
  },
  { icon: Hand, title: 'Tik aan', text: 'Tik na het eten aan wat er is geproefd. Eén hapje telt.' },
  {
    icon: Sprout,
    title: 'Laat zien',
    text: 'Geef het scherm aan je kind en kijk samen hoe het vriendje groeit.',
  },
];

function HowStep({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const canInstall = useCanInstall();
  const platform = detectPlatform();
  return (
    <>
      <StepHeading>Zo werkt het</StepHeading>
      <ol className="mt-6 space-y-3">
        {HOW.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="fv-card flex gap-4 p-5">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
              <Icon size={24} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg font-bold">
                {i + 1}. {title}
              </span>
              <span className="block text-ink-soft">{text}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6 rounded-card bg-sand p-5">
        <h2 className="text-lg">Tip: zet de app op je beginscherm</h2>
        <p className="mt-1 text-ink-soft">
          Dan blijven je gegevens beter bewaard en opent de tuin op het hele scherm.{' '}
          {!canInstall && INSTALL_HINT[platform]}
        </p>
        {canInstall && (
          <Button className="mt-3" onClick={() => void promptInstall()}>
            Installeer de app
          </Button>
        )}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-2">
        <Button size="lg" onClick={onBack}>
          Terug
        </Button>
        <Button variant="primary" size="lg" onClick={onDone}>
          Aan de slag
        </Button>
      </div>
    </>
  );
}

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [drafts, setDrafts] = useState<Draft[]>([
    { key: 1, name: '', color: 'child-1', known: [] },
  ]);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setPersistRequested = useAppStore((s) => s.setPersistRequested);
  const navigate = useNavigate();

  const finish = () => {
    completeOnboarding(drafts.map((d) => ({ name: d.name, color: d.color, known: d.known })));
    setPersistRequested();
    void requestPersistentStorage();
    void navigate('/', { replace: true });
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-lg px-4 pb-10 pt-[calc(var(--safe-top)+24px)]">
      <StepDots step={step} />
      {step === 1 && <Welcome onNext={() => setStep(2)} />}
      {step === 2 && (
        <ChildrenStep
          drafts={drafts}
          setDrafts={setDrafts}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <KnownStep
          drafts={drafts}
          setDrafts={setDrafts}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && <HowStep onDone={finish} onBack={() => setStep(3)} />}
    </main>
  );
}
