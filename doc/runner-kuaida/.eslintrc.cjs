module.exports = {
  root: true,
  extends: ['@onejs/eslint-config-all/typescript/react'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  rules: {
    radix: ['error', 'as-needed'],
    // 'object-curly-newline': ['warn', { multiline: true, minProperties: 7 }],
    '@typescript-eslint/no-unused-vars': 1,
    'max-len': ['error', { code: 300 }],
    '@typescript-eslint/no-shadow': 1,
    '@typescript-eslint/member-ordering': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-useless-constructor': 0,
    '@typescript-eslint/space-before-function-paren': 'off',
    'object-curly-newline': 'off',
    'no-console': 0,
    'react/destructuring-assignment': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-empty': 1,
    'prefer-object-spread': 0,
    'no-eval': 0
  }
};
