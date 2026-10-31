import type { ChildColor } from '../domain/types';

/** Vaste classnames per kindkleur (nooit dynamisch samengesteld, §15.2). */
export const COLOR_CLASS: Record<ChildColor, string> = {
  'child-1': 'bg-child-1',
  'child-2': 'bg-child-2',
  'child-3': 'bg-child-3',
  'child-4': 'bg-child-4',
  'child-5': 'bg-child-5',
  'child-6': 'bg-child-6',
};

export const CHILD_COLOR_LABEL: Record<ChildColor, string> = {
  'child-1': 'goudgeel',
  'child-2': 'hemelsblauw',
  'child-3': 'roze',
  'child-4': 'saliegroen',
  'child-5': 'lila',
  'child-6': 'abrikoos',
};
