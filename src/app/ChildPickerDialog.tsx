import { Dialog } from '../components/Dialog';
import { ChildAvatar } from '../components/ChildAvatar';
import { useAppStore } from '../store/app-store';

interface ChildPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onPick: (childId: string) => void;
  title?: string;
}

/** Bij meer kinderen: eerst kiezen welk kind (bijvoorbeeld voor de tuin). */
export function ChildPickerDialog({
  open,
  onClose,
  onPick,
  title = 'Wiens tuin?',
}: ChildPickerDialogProps) {
  const children = useAppStore((s) => s.children);
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <ul className="grid gap-2">
        {children.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onPick(c.id)}
              className="flex min-h-16 w-full items-center gap-3 rounded-card border border-line bg-paper px-4 text-left font-heading text-lg font-bold hover:bg-sand"
            >
              <ChildAvatar child={c} />
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
