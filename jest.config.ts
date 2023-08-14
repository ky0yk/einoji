import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  roots: ['<rootDir>/functions'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
