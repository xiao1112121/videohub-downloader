const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load setupTests.js config
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    '!components/**/*.test.{ts,tsx}',
    '!hooks/**/*.test.{ts,tsx}',
    '!utils/**/*.test.{ts,tsx}',
    '!services/**/*.test.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};

module.exports = createJestConfig(customJestConfig);
