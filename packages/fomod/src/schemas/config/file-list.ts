import z from 'zod';
import {fileSystemItemSchema} from './file-system-item';

const fileListSchema = z.object({
  files: z.array(fileSystemItemSchema),
  folders: z.array(fileSystemItemSchema)
});

type FileList = z.infer<typeof fileListSchema>;

export type {
  FileList
};
export {
  fileListSchema
};
