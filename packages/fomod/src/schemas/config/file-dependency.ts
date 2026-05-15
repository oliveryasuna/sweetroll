import z from 'zod';

const fileDependencyStateSchema = z.enum([
  'Missing',
  'Inactive',
  'Active'
]);

type FileDependencyState = z.infer<typeof fileDependencyStateSchema>;

const fileDependencySchema = z.object({
  file: z.string(),
  state: fileDependencyStateSchema
});

type FileDependency = z.infer<typeof fileDependencySchema>;

export type {
  FileDependencyState,
  FileDependency
};
export {
  fileDependencyStateSchema,
  fileDependencySchema
};
