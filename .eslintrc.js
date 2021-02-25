module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:import/typescript',
    'plugin:jest/all',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['CallDurationMeasurer.test.ts'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
    {
      files: ['testSetup.js'],
      rules: {
        'jest/require-top-level-describe': 'off',
      },
    },
    {
      files: ['webpack.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'import'],
  rules: {
    'jest/consistent-test-it': ['error', { fn: 'it' }],
    'jest/lowercase-name': ['error', { ignore: ['describe'] }],
    'jest/no-hooks': 'off',
    'jest/prefer-expect-assertions': 'off',
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        printWidth: 130,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
  },
  settings: {
    'import/core-modules': ['path', 'http'],
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
};
