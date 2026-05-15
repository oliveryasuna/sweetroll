import z from 'zod';
import {compositeDependencySchema} from './composite-dependency';
import {fileListSchema} from './file-list';

const conditionalInstallPatternSchema = z.object({
  dependencies: compositeDependencySchema,
  files: fileListSchema
});

type ConditionalInstallPattern = z.infer<typeof conditionalInstallPatternSchema>;

export type {
  ConditionalInstallPattern
};
export {
  conditionalInstallPatternSchema
};
