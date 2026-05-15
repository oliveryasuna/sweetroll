import z from 'zod';
import {groupSchema} from './group';
import {orderEnumSchema} from './order-enum';

const groupListSchema = z.object({
  groups: z.array(groupSchema),
  order: orderEnumSchema.optional().default('Ascending')
});

type GroupList = z.infer<typeof groupListSchema>;

export type {
  GroupList
};
export {
  groupListSchema
};
