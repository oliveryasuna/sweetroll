import z from 'zod';

const deployedLinkSchema = z.object({
  relativePath: z.string(),
  targetPath: z.string(),
  sourcePath: z.string(),
  linkType: z.enum(['hardlink', 'symlink', 'copy']),
  isDirectory: z.boolean()
});

type DeployedLink = z.infer<typeof deployedLinkSchema>;

const deployManifestSchema = z.object({
  version: z.literal(1),
  deployedAt: z.string().datetime(),
  targetDir: z.string(),
  links: z.array(deployedLinkSchema),
  createdDirs: z.array(z.string())
});

type DeployManifest = z.infer<typeof deployManifestSchema>;

export type {
  DeployedLink,
  DeployManifest
};
export {
  deployedLinkSchema,
  deployManifestSchema
};
