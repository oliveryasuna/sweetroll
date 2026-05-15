import z from 'zod';
import {pluginTypeEnumSchema} from './plugin-type-enum';

const pluginTypeSchema = z.object({name: pluginTypeEnumSchema});

type PluginType = z.infer<typeof pluginTypeSchema>;

export type {
  PluginType
};
export {
  pluginTypeSchema
};
