import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { IconButton } from '../../components/IconButton';
import { ProgressBar } from '../../components/ProgressBar';
import { VeggieIcon } from '../../components/VeggieIcon';
import { progressStatus } from '../../content/phases';
import type { VeggieProgress } from '../../domain/growth';
import type { Child, Veggie } from '../../domain/types';
import { useQuickRegister } from '../logging/useQuickRegister';

interface RowProps {
  veggie: Veggie;
  progress: VeggieProgress;
  child: Child;
  onPlus: () => void;
}

function VeggieRow({ veggie, progress, child, onPlus }: RowProps) {
  const status = progressStatus(progress);
  const total = progress.dropsNeeded || 1;
  const value = progress.phase === 0 ? 0 : progress.maxed ? 1 : progress.drops;
  return (
    <li className="flex items-center gap-3 py-3">
      <Link
        to={`/groenten/${veggie.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-card py-1 pr-2 hover:bg-sand/60"
      >
        <span className="fv-tile flex h-14 w-14 shrink-0 items-center justify-center">
          <VeggieIcon id={veggie.id} size={44} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-lg font-bold">{veggie.name}</span>
          <span className="block text-sm text-ink-soft">{status}</span>
          <span className="mt-1.5 block max-w-56">
            <ProgressBar
              value={value}
              max={progress.maxed ? 1 : total}
              label={`Voortgang ${veggie.name}`}
              valueText={status}
            />
          </span>
        </span>
      </Link>
      <IconButton
        label={`${veggie.name} gegeten of geproefd door ${child.name}`}
        tone="soft"
        icon={<Plus size={24} strokeWidth={2.5} aria-hidden="true" />}
        onClick={onPlus}
      />
    </li>
  );
}

export function VeggieOverview({
  child,
  veggies,
  progress,
}: {
  child: Child;
  veggies: Veggie[];
  progress: Record<string, VeggieProgress>;
}) {
  const quickRegister = useQuickRegister();
  return (
    <ul className="divide-y divide-line">
      {veggies.map((v) => (
        <VeggieRow
          key={v.id}
          veggie={v}
          child={child}
          progress={progress[v.id]!}
          onPlus={() => quickRegister(child, v.id)}
        />
      ))}
    </ul>
  );
}
