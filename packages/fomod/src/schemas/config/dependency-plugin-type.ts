import z from 'zod';
import {dependencyPatternListSchema} from './dependency-pattern-list';
import {pluginTypeSchema} from './plugin-type';

const dependencyPluginTypeSchema = z.object({
  defaultType: pluginTypeSchema,
  patterns: dependencyPatternListSchema
});

type DependencyPluginType = z.infer<typeof dependencyPluginTypeSchema>;

export type {
  DependencyPluginType
};
export {
  dependencyPluginTypeSchema
};
