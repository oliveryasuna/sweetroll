import z from 'zod';
import {fileDependencySchema} from './file-dependency';
import {flagDependencySchema} from './flag-dependency';
import {versionDependencySchema} from './version-dependency';

interface CompositeDependency {
  operator: 'And' | 'Or';
  items: DependencyType[];
}

type DependencyType = (
  | {
    type: 'fileDependency';
    value: z.infer<typeof fileDependencySchema>;
  }
  | {
    type: 'flagDependency';
    value: z.infer<typeof flagDependencySchema>;
  }
  | {
    type: 'gameDependency';
    value: z.infer<typeof versionDependencySchema>;
  }
  | {
    type: 'fommDependency';
    value: z.infer<typeof versionDependencySchema>;
  }
  | {
    type: 'dependencies';
    value: CompositeDependency;
  }
);

const compositeDependencySchema: z.ZodType<CompositeDependency> = z.object({
  operator: z.enum(['And', 'Or']).optional().default('And'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  items: z.array(z.lazy(() => dependencyTypeSchema))
});

const dependencyTypeSchema: z.ZodType<DependencyType> = z.union([
  z.object({
    type: z.literal('fileDependency'),
    value: fileDependencySchema
  }),
  z.object({
    type: z.literal('flagDependency'),
    value: flagDependencySchema
  }),
  z.object({
    type: z.literal('gameDependency'),
    value: versionDependencySchema
  }),
  z.object({
    type: z.literal('fommDependency'),
    value: versionDependencySchema
  }),
  z.object({
    type: z.literal('dependencies'),
    value: z.lazy(() => compositeDependencySchema)
  })
]);

export type {
  CompositeDependency,
  DependencyType
};
export {
  compositeDependencySchema,
  dependencyTypeSchema
};
