import z from 'zod';
import {conditionalInstallPatternSchema} from './conditional-install-pattern';

const conditionalInstallPatternListSchema = z.object({patterns: z.array(conditionalInstallPatternSchema)});

type ConditionalInstallPatternList = z.infer<typeof conditionalInstallPatternListSchema>;

export type {
  ConditionalInstallPatternList
};
export {
  conditionalInstallPatternListSchema
};
