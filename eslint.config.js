import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
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
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      eqeqeq: ['error', 'smart'],
      semi: ['error', 'never'], // 禁用分号
      'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],
      'react-hooks/exhaustive-deps': 'off',
      'react/prop-types': 'off',
      'no-duplicate-imports': 'error',
      'keyword-spacing': 2,
      'no-unused-vars': 'off',
      'react/display-name': 'off',
    },
  },
]
