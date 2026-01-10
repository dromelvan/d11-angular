// @ts-check
// noinspection JSUnresolvedReference

const eslint = require('@eslint/js');
const { defineConfig } = require("eslint/config");
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig // disable conflicting ESLint rules
    ],
    plugins: {
      prettier // enable prettier plugin
    },
    processor: angular.processInlineTemplates,
    rules: {
      'prettier/prettier': 'error', // enforce Prettier
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ]
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettierConfig // also apply prettier to HTML
    ],
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'error'
    }
  }
]);
