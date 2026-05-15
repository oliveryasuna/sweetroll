import z from 'zod';
import {dependencyPatternSchema} from './dependency-pattern';

const dependencyPatternListSchema = z.object({patterns: z.array(dependencyPatternSchema)});

type DependencyPatternList = z.infer<typeof dependencyPatternListSchema>;

export type {
  DependencyPatternList
};
export {
  dependencyPatternListSchema
};
