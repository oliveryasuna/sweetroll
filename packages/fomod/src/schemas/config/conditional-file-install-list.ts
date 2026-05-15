import z from 'zod';
import {conditionalInstallPatternListSchema} from './conditional-install-pattern-list';

const conditionalFileInstallListSchema = z.object({patterns: conditionalInstallPatternListSchema});

type ConditionalFileInstallList = z.infer<typeof conditionalFileInstallListSchema>;

export type {
  ConditionalFileInstallList
};
export {
  conditionalFileInstallListSchema
};
