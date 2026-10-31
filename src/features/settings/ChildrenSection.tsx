import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import { ChildAvatar } from '../../components/ChildAvatar';
import { ColorPicker } from '../../components/ColorPicker';
import { Dialog } from '../../components/Dialog';
import { IconButton } from '../../components/IconButton';
import { TextField } from '../../components/TextField';
import { CHILD_COLORS, type Child, type ChildColor } from '../../domain/types';
import { useAppStore } from '../../store/app-store';

interface EditState {
  id?: string;
  name: string;
  spokenName: string;
  color: ChildColor;
}

export function ChildrenSection() {
  const children = useAppStore((s) => s.children);
  const addChild = useAppStore((s) => s.addChild);
  const updateChild = useAppStore((s) => s.updateChild);
  const removeChild = useAppStore((s) => s.removeChild);
  const [edit, setEdit] = useState<EditState>();
  const [confirmRemove, setConfirmRemove] = useState<Child>();

  const save = () => {
    if (!edit || !edit.name.trim()) return;
    if (edit.id)
      updateChild(edit.id, { name: edit.name, spokenName: edit.spokenName, color: edit.color });
    else addChild({ name: edit.name, spokenName: edit.spokenName, color: edit.color });
    setEdit(undefined);
  };

  return (
    <>
      <ul className="divide-y divide-line">
        {children.map((c) => (
          <li key={c.id} className="flex items-center gap-3 py-2">
            <ChildAvatar child={c} />
            <span className="min-w-0 flex-1 font-heading text-lg font-bold">{c.name}</span>
            <IconButton
              label={`${c.name} bewerken`}
              icon={<Pencil size={20} aria-hidden="true" />}
              onClick={() =>
                setEdit({ id: c.id, name: c.name, spokenName: c.spokenName ?? '', color: c.color })
              }
            />
          </li>
        ))}
      </ul>
      <Button
        className="mt-2"
        variant="ghost"
        icon={<Plus size={20} aria-hidden="true" />}
        onClick={() =>
          setEdit({
            name: '',
            spokenName: '',
            color: CHILD_COLORS[children.length % CHILD_COLORS.length]!,
          })
        }
      >
        Kind toevoegen
      </Button>

      <Dialog
        open={Boolean(edit)}
        onClose={() => setEdit(undefined)}
        title={edit?.id ? 'Kind bewerken' : 'Kind toevoegen'}
        footer={
          <>
            {edit?.id && (
              <Button
                variant="danger"
                className="mr-auto"
                onClick={() => {
                  const child = children.find((c) => c.id === edit.id);
                  setEdit(undefined);
                  setConfirmRemove(child);
                }}
              >
                Verwijderen
              </Button>
            )}
            <Button variant="primary" onClick={save} disabled={!edit?.name.trim()}>
              Opslaan
            </Button>
          </>
        }
      >
        {edit && (
          <div className="space-y-4">
            <TextField
              label="Naam of bijnaam"
              value={edit.name}
              maxLength={40}
              autoComplete="off"
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
            />
            <TextField
              label="Uitspraak voor de stem (optioneel)"
              hint="Schrijf de naam zoals je hem uitspreekt, bijvoorbeeld 'Zoë' als 'Zo-wee'."
              value={edit.spokenName}
              maxLength={60}
              autoComplete="off"
              onChange={(e) => setEdit({ ...edit, spokenName: e.target.value })}
            />
            <ColorPicker
              name="kleur-edit"
              value={edit.color}
              onChange={(color) => setEdit({ ...edit, color })}
            />
          </div>
        )}
      </Dialog>

      <Dialog
        open={Boolean(confirmRemove)}
        onClose={() => setConfirmRemove(undefined)}
        title={`${confirmRemove?.name ?? ''} verwijderen?`}
        footer={
          <>
            <Button onClick={() => setConfirmRemove(undefined)}>Annuleren</Button>
            <Button
              variant="danger"
              disabled={children.length <= 1}
              onClick={() => {
                if (confirmRemove) removeChild(confirmRemove.id);
                setConfirmRemove(undefined);
              }}
            >
              Ja, verwijder alles van {confirmRemove?.name}
            </Button>
          </>
        }
      >
        <p>De tuin en alle registraties van {confirmRemove?.name} verdwijnen van dit apparaat.</p>
        {children.length <= 1 && (
          <p className="mt-2 text-ink-soft">
            Er moet minstens één kind overblijven. Wil je opnieuw beginnen? Kies dan Alles wissen.
          </p>
        )}
      </Dialog>
    </>
  );
}
