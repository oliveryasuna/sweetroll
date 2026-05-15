import z from 'zod';

const flagDependencySchema = z.object({
  flag: z.string(),
  value: z.string()
});

type FlagDependency = z.infer<typeof flagDependencySchema>;

export type {
  FlagDependency
};
export {
  flagDependencySchema
};
