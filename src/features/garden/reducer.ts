import type { VisitPlan } from './plan';
import type { GardenAction, GardenState } from './types';

export function initState(plan: VisitPlan): GardenState {
  return {
    mode: { kind: 'overzicht' },
    camMs: 0,
    dragDx: 0,
    buddies: { ...plan.initial },
    objects: {},
    confetti: 0,
    dim: null,
    lastDim: null,
    playing: true,
  };
}

export function reducer(state: GardenState, action: GardenAction): GardenState {
  switch (action.type) {
    case 'mode':
      return { ...state, mode: action.mode, camMs: action.ms ?? 1100 };
    case 'drag':
      return { ...state, dragDx: action.dx };
    case 'patch': {
      const prev = state.buddies[action.id];
      if (!prev) return state;
      return { ...state, buddies: { ...state.buddies, [action.id]: { ...prev, ...action.patch } } };
    }
    case 'patchAll': {
      const buddies = { ...state.buddies };
      for (const key of Object.keys(buddies) as (keyof typeof buddies)[]) {
        const prev = buddies[key];
        if (prev && prev.phase > 0) buddies[key] = { ...prev, ...action.patch };
      }
      return { ...state, buddies };
    }
    case 'object':
      return {
        ...state,
        objects: { ...state.objects, [action.id]: (state.objects[action.id] ?? 0) + 1 },
      };
    case 'confetti':
      return { ...state, confetti: state.confetti + 1 };
    case 'dim':
      return { ...state, dim: action.id, lastDim: action.id ?? state.dim ?? state.lastDim };
    case 'playing':
      return { ...state, playing: action.value };
  }
}
