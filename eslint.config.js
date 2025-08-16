import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginTailwind from 'eslint-plugin-tailwindcss';
import eslintPluginVue from 'eslint-plugin-vue';

export default [
  {
    files: ['src/**/*.{ts,mts,js,mjs,tsx,vue}'],
    ignore: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: eslintPluginVue,
      '@typescript-eslint': eslintPluginTs,
      tailwindcss: eslintPluginTailwind,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      '@vue/eslint-config-typescript',
      'prettier',
    ],
  },
];
