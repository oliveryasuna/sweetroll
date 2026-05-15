import z from 'zod';
import {orderEnumSchema} from './order-enum';
import {pluginSchema} from './plugin-schema';

const pluginListSchema = z.object({
  plugins: z.array(pluginSchema),
  order: orderEnumSchema.optional().default('Ascending')
});

type PluginList = z.infer<typeof pluginListSchema>;

export type {
  PluginList
};
export {
  pluginListSchema
};
