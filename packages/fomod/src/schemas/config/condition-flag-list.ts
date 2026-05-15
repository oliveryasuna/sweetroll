import z from 'zod';
import {setConditionFlagSchema} from './set-condition-flag';

const conditionFlagListSchema = z.object({flags: z.array(setConditionFlagSchema)});

type ConditionFlagList = z.infer<typeof conditionFlagListSchema>;

export type {
  ConditionFlagList
};
export {
  conditionFlagListSchema
};
