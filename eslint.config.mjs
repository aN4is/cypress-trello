import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress/flat';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'trelloapp/**',
      '*.config.js',
      '*.config.ts',
      '.husky/**',
      'faultInjector.js',
    ],
  },

  // Base config for all files
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // JavaScript recommended
  js.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },

  // Cypress test files
  {
    files: ['cypress/**/*.ts'],
    ...cypress.configs.recommended,
    rules: {
      ...cypress.configs.recommended.rules,
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/assertion-before-screenshot': 'warn',
    },
  },

  // Prettier (must be last to override formatting rules)
  prettier
);
