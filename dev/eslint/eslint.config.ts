import {eslint, presetAll} from './src';

export default eslint(presetAll(import.meta.dirname, {
  tsconfigs: [
    './tsconfig.build.json',
    './tsconfig.config.json',
    './tsconfig.test.json'
  ]
})).append(
  {ignores: ['./src/typegen.d.ts']},
  {
    files: ['./src/**/*.ts'],
    rules: {
      complexity: ['off'],
      'max-lines-per-function': ['off'],
      'max-statements': ['off']
    }
  }
);
