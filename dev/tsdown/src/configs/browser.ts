import {mergeConfig, type UserConfig} from 'tsdown';
import {createBaseConfig, type BaseConfigOptions} from './base.ts';

interface BrowserConfigOptions extends BaseConfigOptions   {
}

const createBrowserConfig = (async (opts?: BrowserConfigOptions): Promise<UserConfig> => mergeConfig(
  (await createBaseConfig(opts)),
  {
    platform: 'browser',
    sourcemap: false
  }
));

export type {
  BrowserConfigOptions
};
export {
  createBrowserConfig
};
