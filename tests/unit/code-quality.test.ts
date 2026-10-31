import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.(tsx?|css)$/.test(name) ? [path] : [];
  });
}

const sources = files('src').map((path) => ({ path, text: readFileSync(path, 'utf8') }));

describe('codekwaliteit (§15)', () => {
  it('geen dynamisch samengestelde Tailwind-classnames', () => {
    const pattern =
      /\b(bg|text|border|fill|stroke|ring|from|to|via|shadow|outline|decoration|accent|caret)-\$\{/;
    const offenders = sources.filter((s) => pattern.test(s.text)).map((s) => s.path);
    expect(offenders).toEqual([]);
  });

  it('geen emoji in de interface', () => {
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    const offenders = sources.filter((s) => emoji.test(s.text)).map((s) => s.path);
    expect(offenders).toEqual([]);
  });

  it('geen Date.now() of Math.random() in domeinlogica', () => {
    const offenders = sources
      .filter((s) => s.path.includes(`${join('src', 'domain')}`))
      .filter((s) => /Date\.now\(|Math\.random\(/.test(s.text))
      .map((s) => s.path);
    expect(offenders).toEqual([]);
  });
});
