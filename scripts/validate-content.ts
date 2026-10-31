/** Contentvalidatie (§9.6). Faalt (exit 1) bij fouten; waarschuwingen worden alleen gemeld. */
import { validateContent } from '../src/content/validate';

const { errors, warnings } = validateContent();
for (const w of warnings) console.warn(`waarschuwing: ${w}`);
for (const e of errors) console.error(`fout: ${e}`);
console.log(`\n${errors.length} fout(en), ${warnings.length} waarschuwing(en).`);
process.exit(errors.length > 0 ? 1 : 0);
