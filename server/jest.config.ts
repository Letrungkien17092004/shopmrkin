import type { Config } from 'jest';

const config: Config = {
  // Sử dụng preset ESM của ts-jest
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  
  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^core/(.*)\\.js$': '<rootDir>/src/core/$1.ts',
    "^repositories/(.*)\\.js$" : "<rootDir>/src/repositories/$1.ts",
    "^services/(.*)$" : "<rootDir>/src/services/$1",
  } ,

  // Cấu hình cho ts-jest
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json'
      }
    ],
    '^.+\\.js$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json'
      }
    ]
  },

  // Nơi tìm file test
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],

  // Cho output log rõ ràng hơn
  verbose: true
};

export default config;
