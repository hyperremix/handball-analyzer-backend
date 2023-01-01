module.exports = {
  resetMocks: true,
  maxWorkers: 1,
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: 'src/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@model(.*)$': '<rootDir>/src/libs/handball-analyzer-model$1',
  },
  setupFiles: ['./src/jest-setup-file.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      allowSyntheticDefaultImports: false,
    },
  },
};
