import {eslint, presetAll} from '@sweetroll/dev-eslint';

export default eslint(presetAll(import.meta.dirname, {
  tsconfigs: [
    './tsconfig.build.json',
    './tsconfig.config.json',
    './tsconfig.test.json',
    './tsconfig.storybook.json'
  ]
}));
