import type z from 'zod';
import {moduleConfigurationSchema} from './module-configuration';

const configSchema = moduleConfigurationSchema;

type Config = z.infer<typeof configSchema>;

export type {
  Config
};
export {
  configSchema
};
