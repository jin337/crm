import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      prettier,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      eqeqeq: ['error', 'smart'],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],
      'react-hooks/exhaustive-deps': 'off',
      'react/prop-types': 'off',
      'no-duplicate-imports': 'error',
      'keyword-spacing': 2,
      'no-unused-vars': 'off',
      semi: ['error', 'never'], // 禁用分号
      'react/display-name': 'off',
    },
  },
]
