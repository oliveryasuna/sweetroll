import z from 'zod';

const versionDependencySchema = z.object({version: z.string()});

type VersionDependency = z.infer<typeof versionDependencySchema>;

export type {
  VersionDependency
};
export {
  versionDependencySchema
};
