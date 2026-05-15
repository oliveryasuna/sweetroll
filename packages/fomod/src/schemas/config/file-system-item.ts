import z from 'zod';

const fileSystemItemSchema = z.object({
  source: z.string(),
  // Default is the same as the source
  destination: z.string().optional(),
  alwaysInstall: z.boolean().optional().default(false),
  installIfUsable: z.boolean().optional().default(false),
  priority: z.number().optional().default(0)
});

type FileSystemItem = z.infer<typeof fileSystemItemSchema>;

export type {
  FileSystemItem
};
export {
  fileSystemItemSchema
};
