module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: ['plugin:prettier/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    'prettier',
    'no-only-tests'
  ],
  rules: {
    'no-underscore-dangle': 0,
    'no-only-tests/no-only-tests': 'error',
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        printWidth: 120,
        singleQuote: true,
        trailingComma: 'es5'
      }
    ],
    'no-console': 'off',
  },
  settings: {
    'import/core-modules': ['path', 'http'],
    'import/resolver': {
      webpack: {
        config: 'config/webpack.config.js'
      }
    },
  },
  globals: {
    jsdom: true,
  },
};
