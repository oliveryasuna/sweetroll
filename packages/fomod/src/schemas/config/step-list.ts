import z from 'zod';
import {installStepSchema} from './install-step';
import {orderEnumSchema} from './order-enum';

const stepListSchema = z.object({
  installSteps: z.array(installStepSchema),
  order: orderEnumSchema.optional().default('Ascending')
});

type StepList = z.infer<typeof stepListSchema>;

export type {
  StepList
};
export {
  stepListSchema
};
