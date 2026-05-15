import type {TSESLint} from '@typescript-eslint/utils';
import type {Linter} from 'eslint';
import type {Rules} from './typegen';

type Config = (
  Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins'>
  & {
    // Use the type from typescript-eslint
    languageOptions?: TSESLint.FlatConfig.Config['languageOptions'];
    // Relax on the plugins type
    plugins?: Record<string, any>;
  }
);

export type {
  Config
};
