import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  roots: ['<rootDir>/functions'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

export default config;
