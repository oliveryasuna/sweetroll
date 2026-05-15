import {mergeConfig, type UserConfig} from 'tsdown';
import {createBaseConfig, type BaseConfigOptions} from './base.ts';

interface NodeConfigOptions extends BaseConfigOptions   {
}

const createNodeConfig = (async (opts?: NodeConfigOptions): Promise<UserConfig> => mergeConfig(
  (await createBaseConfig(opts)),
  {
    platform: 'node',
    target: 'node22',
    minify: false,
    sourcemap: false,
    unbundle: true
  }
));

export type {
  NodeConfigOptions
};
export {
  createNodeConfig
};
