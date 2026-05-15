import z from 'zod';
import {compositeDependencySchema} from './composite-dependency';
import {pluginTypeSchema} from './plugin-type';

const dependencyPatternSchema = z.object({
  dependencies: compositeDependencySchema,
  type: pluginTypeSchema
});

type DependencyPattern = z.infer<typeof dependencyPatternSchema>;

export type {
  DependencyPattern
};
export {
  dependencyPatternSchema
};
