/** Tijdelijke UI-staat (niet bewaard): snackbar en update-melding. */
import { create } from 'zustand';

export interface SnackbarAction {
  label: string;
  onClick: () => void;
}

export interface SnackbarMessage {
  id: number;
  text: string;
  actions?: SnackbarAction[];
  /** Hoe lang de melding blijft staan (ms). */
  duration?: number;
}

interface UiState {
  snackbar?: SnackbarMessage;
  showSnackbar(message: Omit<SnackbarMessage, 'id'>): void;
  hideSnackbar(id?: number): void;
}

let counter = 0;

export const useUiStore = create<UiState>()((set, get) => ({
  snackbar: undefined,
  showSnackbar(message) {
    counter += 1;
    set({ snackbar: { ...message, id: counter } });
  },
  hideSnackbar(id) {
    const current = get().snackbar;
    if (!current || (id !== undefined && current.id !== id)) return;
    set({ snackbar: undefined });
  },
}));
