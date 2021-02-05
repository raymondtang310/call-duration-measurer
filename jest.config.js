module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'reports',
  coveragePathIgnorePatterns: ['index.ts'],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES2018',
      },
    },
  },
  preset: 'ts-jest',
  reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/reports/', uniqueOutputName: 'true' }]],
  setupFilesAfterEnv: ['<rootDir>/testSetup.js'],
  testMatch: ['<rootDir>/src/**/?(*.)test.ts'],
  transform: { '^.+\\.js$': '<rootDir>/node_modules/babel-jest' },
  transformIgnorePatterns: ['[/\\\\]node_modules(/)[/\\\\].+\\.js$'],
};
