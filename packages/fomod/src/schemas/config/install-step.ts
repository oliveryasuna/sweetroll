import z from 'zod';
import {compositeDependencySchema} from './composite-dependency';
import {groupListSchema} from './group-list';

const installStepSchema = z.object({
  name: z.string(),
  visible: compositeDependencySchema.optional(),
  optionalFileGroups: groupListSchema
});

type InstallStep = z.infer<typeof installStepSchema>;

export type {
  InstallStep
};
export {
  installStepSchema
};
