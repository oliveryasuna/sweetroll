import z from 'zod';
import {conditionFlagListSchema} from './condition-flag-list';
import {fileListSchema} from './file-list';
import {imageSchema} from './image';
import {pluginTypeDescriptorSchema} from './plugin-type-descriptor';

const pluginSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: imageSchema.optional(),
  files: fileListSchema.optional(),
  conditionFlags: conditionFlagListSchema.optional(),
  typeDescriptor: pluginTypeDescriptorSchema
});

type Plugin = z.infer<typeof pluginSchema>;

export type {
  Plugin
};
export {
  pluginSchema
};
