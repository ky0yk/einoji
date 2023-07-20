module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'prettier/@typescript-eslint',
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    env: {
      node: true,
      es6: true,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  };
  