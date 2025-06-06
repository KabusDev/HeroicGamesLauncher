/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {}
  },

  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.config.js'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/public',
    '<rootDir>/dist',
    '<rootDir>/build',
    '<rootDir>/coverage'
  ],
  coverageReporters: ['text', 'html'],
  moduleNameMapper: {
    '^windows-process-tree$': '<rootDir>/src/backend/__mocks__/windows-process-tree.ts'
  },
  projects: ['<rootDir>/src/backend'],

  rootDir: '.'
}
