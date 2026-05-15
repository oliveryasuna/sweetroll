import z from 'zod';

const pluginTypeEnumSchema = z.enum([
  'Required',
  'Optional',
  'Recommended',
  'NotUsable',
  'CouldBeUsable'
]);

type PluginTypeEnum = z.infer<typeof pluginTypeEnumSchema>;

export type {
  PluginTypeEnum
};
export {
  pluginTypeEnumSchema
};
