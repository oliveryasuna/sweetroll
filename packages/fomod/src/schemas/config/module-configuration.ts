import z from 'zod';
import {compositeDependencySchema} from './composite-dependency';
import {conditionalFileInstallListSchema} from './conditional-file-install-list';
import {fileListSchema} from './file-list';
import {headerImageSchema} from './header-image';
import {moduleTitleSchema} from './module-title';
import {stepListSchema} from './step-list';

const moduleConfigurationSchema = z.object({
  moduleName: moduleTitleSchema,
  moduleImage: headerImageSchema.optional(),
  moduleDependencies: compositeDependencySchema.optional(),
  requiredInstallFiles: fileListSchema.optional(),
  installSteps: stepListSchema.optional(),
  conditionalFileInstalls: conditionalFileInstallListSchema.optional()
});

type ModuleConfiguration = z.infer<typeof moduleConfigurationSchema>;

export type {
  ModuleConfiguration
};
export {
  moduleConfigurationSchema
};
