/**
 * Schemaversies en migraties. Elke migratie zet data van versie n naar n + 1.
 * Voeg bij een wijziging van het opgeslagen formaat een migratie toe en verhoog SCHEMA_VERSION.
 */
import { SCHEMA_VERSION } from '../config/app';

export type Migration = (data: Record<string, unknown>) => Record<string, unknown>;

/** migrations[n] zet versie n om naar versie n + 1. */
export const MIGRATIONS: Record<number, Migration> = {};

export class MigrationError extends Error {}

export function migrate(
  data: unknown,
  fromVersion: number,
  toVersion: number = SCHEMA_VERSION,
  migrations: Record<number, Migration> = MIGRATIONS,
): Record<string, unknown> {
  if (typeof data !== 'object' || data === null) {
    throw new MigrationError('Geen geldige gegevens.');
  }
  if (!Number.isInteger(fromVersion) || fromVersion < 1) {
    throw new MigrationError(`Onbekende schemaversie ${String(fromVersion)}.`);
  }
  if (fromVersion > toVersion) {
    throw new MigrationError(
      'Deze gegevens komen uit een nieuwere versie van de app. Werk de app eerst bij.',
    );
  }
  let current = { ...(data as Record<string, unknown>) };
  for (let v = fromVersion; v < toVersion; v++) {
    const step = migrations[v];
    if (!step) throw new MigrationError(`Migratie van versie ${v} ontbreekt.`);
    current = step(current);
  }
  return current;
}
