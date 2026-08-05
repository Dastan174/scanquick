import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'public/**',
  ]),

  {
    // Apply strict best practices and quality control rules across your app
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // --- Cleanliness & Dead Code Elimination ---
      'no-unused-vars': 'off', // Turned off so the TypeScript rule below can handle it safely
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // --- Safety & Type Logic ---
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-shadow': 'off', // Turned off so the TypeScript rule below can handle it safely
      '@typescript-eslint/no-shadow': 'error',

      // --- Formatting & Next.js Preferences ---
      curly: ['error', 'all'],
      'arrow-body-style': ['error', 'as-needed'],
      'react/react-in-jsx-scope': 'off', // Not needed for Next.js App or Pages routers
      'react/prop-types': 'off', // TypeScript takes care of prop validation
    },
  },

  // Prettier config must be spread at the very end to override conflicting rules
  prettier,
]);

export default eslintConfig;
