import z from 'zod';
import {pluginListSchema} from './plugin-list';

const groupTypeSchema = z.enum([
  'SelectAtLeastOne',
  'SelectAtMostOne',
  'SelectExactlyOne',
  'SelectAll',
  'SelectAny'
]);

type GroupType = z.infer<typeof groupTypeSchema>;

const groupSchema = z.object({
  name: z.string(),
  type: groupTypeSchema,
  plugins: pluginListSchema
});

type Group = z.infer<typeof groupSchema>;

export type {
  GroupType,
  Group
};
export {
  groupTypeSchema,
  groupSchema
};
