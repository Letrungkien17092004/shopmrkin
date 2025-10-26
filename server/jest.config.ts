import type { Config } from 'jest';

const config: Config = {
  // Sử dụng preset ESM của ts-jest
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  // Root directory cho Jest
  rootDir: './',

  // Extensions to treat as ESM
  extensionsToTreatAsEsm: ['.ts'],

  // Module name mapper - map import paths với .js extension sang .ts files
  moduleNameMapper: {
    // Core paths
    '^(\\.{1,2}/.*)\\.js$': '$1',
    
    // Absolute imports từ core
    '^../../core/entities/(.*)\\.js$': '<rootDir>/src/core/entities/$1.ts',
    '^../../core/applications/interfaces/usecases/(.*)\\.js$': '<rootDir>/src/core/applications/interfaces/usecases/$1.ts',
    '^../../core/applications/interfaces/repositories/(.*)\\.js$': '<rootDir>/src/core/applications/interfaces/repositories/$1.ts',
    '^../../core/applications/usecase/(.*)\\.js$': '<rootDir>/src/core/applications/usecase/$1.ts',
    
    // Adapter paths
    '^../../adapter/controller/(.*)\\.js$': '<rootDir>/src/adapter/controller/$1.ts',
    '^../../adapter/DTO/(.*)\\.js$': '<rootDir>/src/adapter/DTO/$1.ts',
    
    // Repository paths
    '^../../repositories/(.*)\\.js$': '<rootDir>/src/repositories/$1.ts',
    
    // Services
    '^../../services/(.*)\\.js$': '<rootDir>/src/services/$1.ts',
    
    // Generic pattern cho tất cả .js imports
    '^(.*)\\.js$': '$1'
  },

  // Cấu hình cho ts-jest với ESM - SỬ DỤNG tsconfig.test.json
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.test.json' // Sử dụng tsconfig riêng cho test
      }
    ]
  },

  // Nơi tìm file test - tìm trong thư mục __test__
  testMatch: [
    '<rootDir>/src/__test__/**/*.test.ts',
    '<rootDir>/src/**/__test__/**/*.test.ts',
    '<rootDir>/src/**/*.test.ts'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/client/'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__test__/**',
    '!src/app.ts',
    '!src/expressApp/bootstrap.ts'
  ],

  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Verbose output
  verbose: true,

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
};

export default config;