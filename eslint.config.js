import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dev-dist',
      'coverage',
      'playwright-report',
      'test-results',
      'screenshots',
      'public',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.flat['recommended-latest'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Date',
          property: 'now',
          message:
            'Gebruik clock.now() uit src/lib/clock.ts (te verschuiven in tests en dev-paneel).',
        },
        {
          object: 'Math',
          property: 'random',
          message: 'Gebruik een seeded RNG of newId(); geen willekeur in render.',
        },
      ],
    },
  },
  {
    // Visuele willekeur (confetti, vlinders) mag in de tuin; tijd blijft via clock.now().
    files: ['src/features/garden/**', 'src/characters/**', 'src/audio/**'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'Date',
          property: 'now',
          message: 'Gebruik clock.now() uit src/lib/clock.ts.',
        },
      ],
    },
  },
  {
    // Tekendata (lichamen, rekwisieten, dieren) met kleine lokale tekenhulpjes.
    files: ['src/characters/bodies.tsx', 'src/characters/props.tsx', 'src/characters/animals.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['src/lib/clock.ts', 'src/lib/id.ts', 'scripts/**', 'tests/**'],
    rules: { 'no-restricted-properties': 'off' },
  },
);
