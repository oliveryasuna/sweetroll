import {readFile} from 'node:fs/promises';
import {mergeConfig, type UserConfig} from 'tsdown';
import {createBaseConfig, type BaseConfigOptions} from './base.ts';

interface LibConfigOptions extends BaseConfigOptions   {
  external?: string[];
}

const createLibConfig = (async (opts?: LibConfigOptions): Promise<UserConfig> => mergeConfig(
  (await createBaseConfig(opts)),
  {
    deps: {neverBundle: [...Object.keys((JSON.parse(await readFile('./package.json', 'utf8')) as Record<string, unknown>).dependencies as Record<string, string> ?? {}), ...(opts?.external ?? [])]},
    dts: true,
    platform: 'node',
    sourcemap: true
  }
));

export type {
  LibConfigOptions
};
export {
  createLibConfig
};
