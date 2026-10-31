/** Mijn data (§11.3): exporteren, importeren met validatie, alles wissen, opslagstatus. */
import { useEffect, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { joinNames } from '../../content/lines';
import { clock } from '../../lib/clock';
import { formatDate } from '../../lib/dates';
import {
  downloadFile,
  getPersistState,
  getStorageEstimate,
  requestPersistentStorage,
  type PersistState,
} from '../../lib/storage';
import { appStorage, useAppStore } from '../../store/app-store';
import {
  createExport,
  exportFilename,
  parseImport,
  type ImportResult,
} from '../../store/data-transfer';
import { useUiStore } from '../../store/ui-store';

const PERSIST_TEXT: Record<PersistState, string> = {
  persistent: 'Je gegevens zijn vastgezet op dit apparaat: de browser ruimt ze niet zomaar op.',
  'best-effort':
    'De browser kan je gegevens opruimen als er weinig ruimte is. Zet de app op je beginscherm en maak af en toe een back-up.',
  unsupported:
    'Deze browser laat niet zien of je gegevens vastgezet zijn. Maak af en toe een back-up.',
};

function StorageStatus() {
  const [state, setState] = useState<PersistState>();
  const [usage, setUsage] = useState<string>();
  useEffect(() => {
    let alive = true;
    void getPersistState().then((s) => alive && setState(s));
    void getStorageEstimate().then((e) => {
      if (alive && e) setUsage(`${Math.max(1, Math.round(e.usage / 1024))} kB in gebruik`);
    });
    return () => {
      alive = false;
    };
  }, []);
  const memory = appStorage.status() === 'memory';
  return (
    <div className="rounded-card bg-sand p-4">
      <p className="font-bold">Opslag op dit apparaat</p>
      {memory ? (
        <p className="mt-1 text-danger">
          Opslaan lukt niet in deze browser(modus). Wat je nu doet, is weg na het sluiten. Gebruik
          een gewoon (niet-privé) venster.
        </p>
      ) : (
        <p className="mt-1 text-ink-soft">
          {state ? PERSIST_TEXT[state] : 'Even kijken…'} {usage && `(${usage})`}
        </p>
      )}
      {state === 'best-effort' && (
        <Button className="mt-3" onClick={() => void requestPersistentStorage().then(setState)}>
          Vastzetten aanvragen
        </Button>
      )}
    </div>
  );
}

export function DataSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Extract<ImportResult, { ok: true }>>();
  const [wipeStep, setWipeStep] = useState<0 | 1 | 2>(0);
  const replaceAll = useAppStore((s) => s.replaceAll);
  const wipeAll = useAppStore((s) => s.wipeAll);
  const showSnackbar = useUiStore((s) => s.showSnackbar);

  const doExport = async () => {
    await appStorage.flush();
    const s = useAppStore.getState();
    const now = clock.now().toISOString();
    const file = createExport(
      {
        meta: s.meta,
        children: s.children,
        eatEvents: s.eatEvents,
        practiceEvents: s.practiceEvents,
        settings: s.settings,
        shopping: s.shopping,
        snapshots: s.snapshots,
      },
      now,
    );
    downloadFile(exportFilename(now), JSON.stringify(file, null, 2));
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const result = parseImport(await file.text(), clock.now().toISOString());
    if (fileRef.current) fileRef.current.value = '';
    if (!result.ok) {
      showSnackbar({ text: result.error });
      return;
    }
    setPending(result);
  };

  return (
    <div className="space-y-4">
      <StorageStatus />
      <div>
        <Button icon={<Download size={20} aria-hidden="true" />} onClick={() => void doExport()}>
          Back-up maken (exporteren)
        </Button>
        <p className="mt-1 text-sm text-ink-soft">
          Je krijgt een bestand met alle gegevens. Let op: de naam van je kind staat erin. Bewaar
          het op een veilige plek.
        </p>
      </div>
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Back-upbestand kiezen"
          id="import-file"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        <Button
          icon={<Upload size={20} aria-hidden="true" />}
          onClick={() => fileRef.current?.click()}
        >
          Back-up terugzetten (importeren)
        </Button>
        <p className="mt-1 text-sm text-ink-soft">
          Handig bij een nieuw apparaat of na het installeren.
        </p>
      </div>
      <div>
        <Button variant="danger" onClick={() => setWipeStep(1)}>
          Alles wissen
        </Button>
      </div>

      <Dialog
        open={Boolean(pending)}
        onClose={() => setPending(undefined)}
        title="Back-up terugzetten?"
        footer={
          <>
            <Button onClick={() => setPending(undefined)}>Annuleren</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (pending) replaceAll(pending.state);
                setPending(undefined);
                showSnackbar({ text: 'De back-up staat er weer in.' });
              }}
            >
              Terugzetten
            </Button>
          </>
        }
      >
        {pending && (
          <>
            <p>
              Back-up van {formatDate(pending.summary.exportedAt)} met{' '}
              {pending.summary.children.length > 0
                ? joinNames(pending.summary.children)
                : 'geen kinderen'}{' '}
              en {pending.summary.registrations} registraties.
            </p>
            <p className="mt-2 text-ink-soft">Dit vervangt alles wat nu in de app staat.</p>
            {pending.rejectedCount > 0 && (
              <p className="mt-2 text-ink-soft">
                {pending.rejectedCount} onderdelen waren onleesbaar en worden overgeslagen.
              </p>
            )}
          </>
        )}
      </Dialog>

      <Dialog
        open={wipeStep > 0}
        onClose={() => setWipeStep(0)}
        title={wipeStep === 1 ? 'Alles wissen?' : 'Echt alles wissen?'}
        footer={
          <>
            <Button onClick={() => setWipeStep(0)}>Annuleren</Button>
            {wipeStep === 1 ? (
              <Button variant="danger" onClick={() => setWipeStep(2)}>
                Ja, wissen
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={() => {
                  wipeAll();
                  setWipeStep(0);
                }}
              >
                Definitief wissen
              </Button>
            )}
          </>
        }
      >
        <p>
          {wipeStep === 1
            ? 'Alle kinderen, tuinen, registraties, instellingen en de boodschappenlijst verdwijnen van dit apparaat.'
            : 'Dit kun je niet ongedaan maken. Maak eventueel eerst een back-up.'}
        </p>
      </Dialog>
    </div>
  );
}
