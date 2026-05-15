import type {UserConfig} from 'tsdown';

interface BaseConfigOptions {
  entry?: string[];
  tsconfig?: string;
}

const createBaseConfig = (async (opts?: BaseConfigOptions): Promise<UserConfig> => ({
  entry: (opts?.entry ?? ['./src/index.ts']),
  minify: true,
  treeshake: {moduleSideEffects: false},
  tsconfig: (opts?.tsconfig ?? './tsconfig.build.json')
}));

export type {
  BaseConfigOptions
};
export {
  createBaseConfig
};
