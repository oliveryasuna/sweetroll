import z from 'zod';
import {dependencyPluginTypeSchema} from './dependency-plugin-type';
import {pluginTypeSchema} from './plugin-type';

const pluginTypeDescriptorSchema = z.union([
  z.object({
    dependencyType: dependencyPluginTypeSchema,
    type: z.never().optional()
  }),
  z.object({
    dependencyType: z.never().optional(),
    type: pluginTypeSchema
  })
]);

type PluginTypeDescriptor = z.infer<typeof pluginTypeDescriptorSchema>;

export type {
  PluginTypeDescriptor
};
export {
  pluginTypeDescriptorSchema
};
