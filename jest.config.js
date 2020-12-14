module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'reports',
  coveragePathIgnorePatterns: ['index.js'],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ['<rootDir>/src/**/?(*.)test.js'],
  setupFilesAfterEnv: ['<rootDir>/testSetup.js'],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules(/)[/\\\\].+\\.(js|jsx)$', '^.+\\.module\\.(css|sass|scss|svg)$'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^lodash-es$': '<rootDir>/node_modules/lodash/index.js',
  },
  moduleFileExtensions: ['js', 'json'],
  reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/reports/', uniqueOutputName: 'true' }]],
};
