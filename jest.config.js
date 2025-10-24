module.exports = {
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests', '<rootDir>/src/server'],
      testMatch: [
        '<rootDir>/src/server/**/__tests__/**/*.test.ts',
        '<rootDir>/tests/unit/**/*.test.ts',
        '<rootDir>/tests/integration/**/*.test.ts'
      ],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(uuid)/)'
      ],
      setupFiles: ['<rootDir>/tests/setup.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      testTimeout: 10000,
    },
    {
      displayName: 'client',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src/client'],
      testMatch: ['<rootDir>/src/client/**/__tests__/**/*.test.tsx'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
      setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      testTimeout: 10000,
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
};
