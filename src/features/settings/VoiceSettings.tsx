/** Stem kiezen en testen (§8.5). Bij voorkeur een stem die op het apparaat zelf werkt. */
import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import {
  listDutchVoices,
  playSound,
  speak,
  unlockAudio,
  voicesReady,
  type VoiceOption,
} from '../../audio';
import { Button } from '../../components/Button';
import { useAppStore } from '../../store/app-store';

const TEST_LINE = 'Hoi! Ik ben Wortel. Zullen we samen proeven?';

export function VoiceSettings() {
  const voiceURI = useAppStore((s) => s.settings.voiceURI);
  const update = useAppStore((s) => s.updateSettings);
  const [voices, setVoices] = useState<VoiceOption[] | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => alive && setVoices(listDutchVoices());
    void voicesReady().then(load);
    const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
    synth?.addEventListener('voiceschanged', load);
    return () => {
      alive = false;
      synth?.removeEventListener('voiceschanged', load);
    };
  }, []);

  if (voices === null) return <p className="mt-3 text-ink-soft">Stemmen zoeken…</p>;

  const firstLocal = voices.find((v) => v.local);
  const current = voices.find((v) => v.uri === voiceURI) ?? firstLocal;

  return (
    <div className="mt-3 space-y-3">
      {voices.length === 0 ? (
        <p className="rounded-card bg-sand p-4 text-ink-soft">
          Op dit apparaat is geen Nederlandse stem gevonden. De vriendjes maken dan alleen
          geluidjes. Je kunt een Nederlandse stem installeren in de instellingen van je apparaat
          (bij spraak of tekst-naar-spraak).
        </p>
      ) : (
        <fieldset>
          <legend className="mb-1 font-bold">Stem</legend>
          <ul className="divide-y divide-line">
            {voices.map((v) => (
              <li key={v.uri}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 py-2">
                  <input
                    type="radio"
                    name="stem"
                    className="h-5 w-5 accent-[var(--color-accent)]"
                    checked={current?.uri === v.uri}
                    onChange={() => update({ voiceURI: v.uri })}
                  />
                  <span className="min-w-0">
                    <span className="block">{v.name}</span>
                    <span className="block text-sm text-ink-soft">
                      {v.lang} · {v.local ? 'werkt op dit apparaat' : 'werkt via internet'}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {current && !current.local && (
            <p className="mt-2 text-sm text-ink-soft">
              Deze stem werkt via internet: wat de vriendjes zeggen (ook de naam van je kind) gaat
              dan naar de maker van de browser. Kies liever een stem die op dit apparaat werkt.
            </p>
          )}
          {!firstLocal && !voiceURI && (
            <p className="mt-2 text-sm text-ink-soft">
              Er is alleen een stem via internet. Die gebruiken we pas als je hem hier zelf kiest.
            </p>
          )}
        </fieldset>
      )}
      <div className="flex flex-wrap gap-2">
        {voices.length > 0 && (
          <Button
            icon={<Volume2 size={20} aria-hidden="true" />}
            onClick={() => {
              unlockAudio();
              void speak(TEST_LINE, { force: true });
            }}
          >
            Test de stem
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => {
            unlockAudio();
            setTimeout(() => playSound('groei'), 50);
          }}
        >
          Test een geluidje
        </Button>
      </div>
    </div>
  );
}
