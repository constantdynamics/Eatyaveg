/** Export en import van Mijn data als JSON-bestand (§11.3). */
import { EXPORT_APP_ID, SCHEMA_VERSION } from '../config/app';
import { migrate, MigrationError } from './migrations';
import { sanitizeState } from './sanitize';
import { exportFileSchema } from './schema';
import type { PersistedState } from './state';

export interface ExportFile {
  app: typeof EXPORT_APP_ID;
  schemaVersion: number;
  exportedAt: string;
  data: PersistedState;
}

export function createExport(state: PersistedState, nowIso: string): ExportFile {
  return { app: EXPORT_APP_ID, schemaVersion: SCHEMA_VERSION, exportedAt: nowIso, data: state };
}

export function exportFilename(nowIso: string): string {
  return `familie-vriendelijk-${nowIso.slice(0, 10)}.json`;
}

export type ImportResult =
  | { ok: true; state: PersistedState; summary: ImportSummary; rejectedCount: number }
  | { ok: false; error: string };

export interface ImportSummary {
  children: string[];
  registrations: number;
  exportedAt: string;
}

export function parseImport(text: string, nowIso: string): ImportResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Dit bestand kunnen we niet lezen. Kies een export van deze app.' };
  }
  const file = exportFileSchema.safeParse(json);
  if (!file.success) {
    return { ok: false, error: 'Dit lijkt geen back-up van Familie Vriendelijk.' };
  }
  try {
    const migrated = migrate(file.data.data, file.data.schemaVersion);
    const { state, rejected } = sanitizeState(migrated, nowIso);
    return {
      ok: true,
      state: { ...state, meta: { ...state.meta, onboarded: state.children.length > 0 } },
      rejectedCount: rejected.length,
      summary: {
        children: state.children.map((c) => c.name),
        registrations: state.eatEvents.length,
        exportedAt: file.data.exportedAt,
      },
    };
  } catch (error) {
    if (error instanceof MigrationError) return { ok: false, error: error.message };
    return { ok: false, error: 'Importeren lukte niet.' };
  }
}
