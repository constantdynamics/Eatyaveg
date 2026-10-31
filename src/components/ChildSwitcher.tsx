import { useAppStore } from '../store/app-store';
import { ChildAvatar } from './ChildAvatar';

/** Kindkiezer: alleen zichtbaar bij meer dan één kind. */
export function ChildSwitcher() {
  const children = useAppStore((s) => s.children);
  const selectedId = useAppStore((s) => s.meta.selectedChildId ?? s.children[0]?.id);
  const select = useAppStore((s) => s.selectChild);
  if (children.length < 2) return null;
  return (
    <div
      role="group"
      aria-label="Kies een kind"
      className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {children.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={active}
            onClick={() => select(c.id)}
            className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-card border py-1 pl-1 pr-4 font-heading font-bold transition-colors duration-200 ease-out ${
              active
                ? 'border-accent bg-accent-soft text-accent-strong'
                : 'border-line bg-paper text-ink hover:bg-sand'
            }`}
          >
            <ChildAvatar child={c} size="sm" />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
